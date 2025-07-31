import { chacha20poly1305 } from '@noble/ciphers/chacha';
import { SRP, SrpClient } from 'fast-srp-hap';
import { AIRPLAY_TRANSIENT_PIN } from '@/const';
import hkdf from 'futoin-hkdf';
import tweetnacl from 'tweetnacl';
import * as tlv8 from '@/tlv8';
import type AirPlayDevice from './device';
import type AirPlayHttpClient from './http';

export default class AirPlayPairing {
    readonly #client: AirPlayHttpClient;
    readonly #device: AirPlayDevice;
    readonly #pairingId: Buffer;
    #deviceName: string = 'AirPlay Client';
    #privateKey: Buffer;
    #publicKey: Buffer;
    #srp?: SrpClient;

    constructor(device: AirPlayDevice, client: AirPlayHttpClient) {
        this.#device = device;
        this.#client = client;

        this.#pairingId = this.#device.mac
            ? Buffer.from(this.#device.mac, 'utf8')
            : Buffer.from(`${device.id}@airplay.local`, 'utf8');
    }

    async start(deviceName: string): Promise<void> {
        this.#deviceName = deviceName;

        const pair = tweetnacl.sign.keyPair();
        this.#privateKey = Buffer.from(pair.secretKey);
        this.#publicKey = Buffer.from(pair.publicKey);

        await this.#client.write('POST', '/pair-pin-start');
    }

    async bail(data: Map<number, Buffer>): Promise<never> {
        if (data.has(tlv8.Value.BackOff)) {
            throw new Error(`AirPlay device is busy, try again in ${data.get(tlv8.Value.BackOff).readUint8(0)} seconds.`);
        }

        if (data.has(tlv8.Value.Error)) {
            throw new Error(`AirPlay device returned error: ${data.get(tlv8.Value.Error).readUint8(0)}`);
        }

        console.error(data);

        throw new Error('Invalid response');
    }

    async m1(): Promise<M1> {
        const response = await this.#client.write('POST', '/pair-setup', tlv8.encode([
            [tlv8.Value.Method, tlv8.Method.PairSetup],
            [tlv8.Value.State, tlv8.State.M1],
            // [tlv8.Value.Flags, tlv8.Flags.TransientPairing]
        ]), {
            'Content-Type': 'application/pairing+tlv8'
        });

        const tlv = await response.arrayBuffer();
        const data = tlv8.decode(Buffer.from(tlv));

        if (data.has(tlv8.Value.Error)) {
            await this.bail(data);
        }

        const publicKey = data.get(tlv8.Value.PublicKey);
        const salt = data.get(tlv8.Value.Salt);

        return {publicKey, salt};
    }

    async m2(serverPublicKey: Buffer, salt: Buffer, pin: string = AIRPLAY_TRANSIENT_PIN): Promise<M2> {
        const srpKey = await SRP.genKey(32);

        this.#srp = new SrpClient(SRP.params.hap, salt, Buffer.from('Pair-Setup'), Buffer.from(pin), srpKey);
        this.#srp.setB(serverPublicKey);

        const publicKey = this.#srp.computeA();
        const proof = this.#srp.computeM1();

        return {publicKey, proof};
    }

    async m3(publicKey: Buffer, proof: Buffer): Promise<M3> {
        const response = await this.#client.write('POST', '/pair-setup', tlv8.encode([
            [tlv8.Value.State, tlv8.State.M3],
            [tlv8.Value.PublicKey, publicKey],
            [tlv8.Value.Proof, proof]
        ]), {
            'Content-Type': 'application/pairing+tlv8'
        });

        const tlv = await response.arrayBuffer();
        const data = tlv8.decode(Buffer.from(tlv));

        if (data.has(tlv8.Value.Error)) {
            await this.bail(data);
        }

        const serverProof = data.get(tlv8.Value.Proof);

        return {serverProof};
    }

    async m4(serverProof: Buffer): Promise<M4> {
        this.#srp.checkM2(serverProof);

        let sharedSecret = this.#srp.computeK();

        if (sharedSecret.length > 32) {
            sharedSecret = Buffer.from(sharedSecret).subarray(0, 32);
        } else if (sharedSecret.length < 32) {
            const newKey = Buffer.alloc(32);
            Buffer.from(sharedSecret).copy(newKey);
            sharedSecret = newKey;
        }

        return {sharedSecret};
    }

    async m5(sharedSecret: Buffer): Promise<void> {
        const iosDeviceX = hkdf(sharedSecret, 32, {
            hash: 'sha512',
            salt: Buffer.from('Pair-Setup-Controller-Sign-Salt'),
            info: Buffer.from('Pair-Setup-Controller-Sign-Info')
        });

        const sessionKey = hkdf(sharedSecret, 32, {
            hash: 'sha512',
            salt: Buffer.from('Pair-Setup-Encrypt-Salt'),
            info: Buffer.from('Pair-Setup-Encrypt-Info')
        });

        const deviceInfo = Buffer.concat([
            Buffer.from(iosDeviceX),
            this.#pairingId,
            this.#publicKey
        ]);

        const signature = tweetnacl.sign.detached(deviceInfo, this.#privateKey);

        const innerTLV = tlv8.encode([
            [tlv8.Value.Identifier, this.#pairingId],
            [tlv8.Value.PublicKey, this.#publicKey],
            [tlv8.Value.Signature, Buffer.from(signature)]
            // [tlv8.Value.Name, Buffer.from(this.#deviceName)]
        ]);

        const nonce = Buffer.concat([Buffer.from('PS-Msg05'), Buffer.alloc(4)]);
        const cipher = chacha20poly1305(Buffer.from(sessionKey), nonce);
        const encrypted = cipher.encrypt(innerTLV);

        console.log({
            iosDeviceX: iosDeviceX.toString('hex'),
            sessionKey: sessionKey.toString('hex'),
            deviceInfo: deviceInfo.toString('hex'),
            signature: Buffer.from(signature).toString('hex'),
            innerTLV: innerTLV.toString(),
            nonce: nonce.toString('hex'),
            encrypted: Buffer.from(encrypted).toString('hex')
        });

        const response = await this.#client.write('POST', '/pair-setup', tlv8.encode([
            [tlv8.Value.State, tlv8.State.M5],
            [tlv8.Value.EncryptedData, Buffer.from(encrypted)]
        ]), {
            'Content-Type': 'application/pairing+tlv8'
        });

        const tlv = await response.arrayBuffer();
        const data = tlv8.decode(Buffer.from(tlv));

        console.log({data});
    }
}

type M1 = {
    readonly publicKey: Buffer;
    readonly salt: Buffer;
}

type M2 = {
    readonly publicKey: Buffer;
    readonly proof: Buffer;
};

type M3 = {
    readonly serverProof: Buffer;
};

type M4 = {
    readonly sharedSecret: Buffer;
};
