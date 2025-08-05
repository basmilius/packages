import { SRP, SrpClient } from 'fast-srp-hap';
import { AIRPLAY_TRANSIENT_PIN } from '@/const';
import { bailTlv, decodeTlv, decryptChacha20, encodeOPack, encodeTlv, encryptChacha20, hkdf, TlvMethod, TlvState, TlvValue } from '@/support';
import { FrameType } from './protocol';
import tweetnacl from 'tweetnacl';
import type CompanionLinkDevice from './device';
import type CompanionLinkSocket from './socket';

export default class CompanionLinkPairing {
    readonly #device: CompanionLinkDevice;
    readonly #socket: CompanionLinkSocket;
    readonly #pairingId: Buffer;
    #deviceName: string = 'AirPlay Client';
    #privateKey: Buffer;
    #publicKey: Buffer;
    #srp?: SrpClient;

    constructor(device: CompanionLinkDevice, socket: CompanionLinkSocket) {
        this.#device = device;
        this.#socket = socket;

        this.#pairingId = this.#device.mac
            ? Buffer.from(this.#device.mac, 'utf8')
            : Buffer.from(`${device.id}@companionlink.local`, 'utf8');
    }

    async start(): Promise<void> {
        const keyPair = tweetnacl.sign.keyPair();
        this.#privateKey = Buffer.from(keyPair.secretKey);
        this.#publicKey = Buffer.from(keyPair.publicKey);
    }

    async pin(askPin: () => Promise<string>): Promise<M6> {
        const m1 = await this.#m1();
        const m2 = await this.#m2(m1.publicKey, m1.salt, await askPin());
        const m3 = await this.#m3(m2.publicKey, m2.proof);
        const m4 = await this.#m4(m3.serverProof);
        const m5 = await this.#m5(m4.sharedSecret);
        const m6 = await this.#m6(m4, m5);

        if (!m6) {
            throw new Error('Pairing failed, could not get accessory keys.');
        }

        return m6;
    }

    async transient(): Promise<M6> {
        const m1 = await this.#m1();
        const m2 = await this.#m2(m1.publicKey, m1.salt);
        const m3 = await this.#m3(m2.publicKey, m2.proof);
        const m4 = await this.#m4(m3.serverProof);
        const m5 = await this.#m5(m4.sharedSecret);
        const m6 = await this.#m6(m4, m5);

        if (!m6) {
            throw new Error('Pairing failed, could not get accessory keys.');
        }

        return m6;
    }

    async #m1(): Promise<M1> {
        const [, response] = await this.#socket.send(FrameType.PS_Start, {
            _pd: encodeTlv([
                [TlvValue.Method, TlvMethod.PairSetup],
                [TlvValue.State, TlvState.M1]
            ]),
            _pwTy: 1
        });

        const data = this.#decode(response);
        const publicKey = data.get(TlvValue.PublicKey);
        const salt = data.get(TlvValue.Salt);

        return {publicKey, salt};
    }

    async #m2(serverPublicKey: Buffer, salt: Buffer, pin: string = AIRPLAY_TRANSIENT_PIN): Promise<M2> {
        const srpKey = await SRP.genKey(32);

        this.#srp = new SrpClient(SRP.params.hap, salt, Buffer.from('Pair-Setup'), Buffer.from(pin), srpKey);
        this.#srp.setB(serverPublicKey);

        const publicKey = this.#srp.computeA();
        const proof = this.#srp.computeM1();

        return {publicKey, proof};
    }

    async #m3(publicKey: Buffer, proof: Buffer): Promise<M3> {
        const [, response] = await this.#socket.send(FrameType.PS_Next, {
            _pd: encodeTlv([
                [TlvValue.State, TlvState.M3],
                [TlvValue.PublicKey, publicKey],
                [TlvValue.Proof, proof]
            ]),
            _pwTy: 1
        });

        const data = this.#decode(response);
        const serverProof = data.get(TlvValue.Proof);

        return {serverProof};
    }

    async #m4(serverProof: Buffer): Promise<M4> {
        this.#srp.checkM2(serverProof);

        let sharedSecret = this.#srp.computeK();

        // if (sharedSecret.length > 32) {
        //     sharedSecret = Buffer.from(sharedSecret).subarray(0, 32);
        // } else if (sharedSecret.length < 32) {
        //     const newKey = Buffer.alloc(32);
        //     Buffer.from(sharedSecret).copy(newKey);
        //     sharedSecret = newKey;
        // }

        return {sharedSecret};
    }

    async #m5(sharedSecret: Buffer): Promise<M5> {
        const iosDeviceX = hkdf({
            hash: 'sha512',
            key: sharedSecret,
            length: 32,
            salt: Buffer.from('Pair-Setup-Controller-Sign-Salt'),
            info: Buffer.from('Pair-Setup-Controller-Sign-Info')
        });

        const sessionKey = hkdf({
            hash: 'sha512',
            key: sharedSecret,
            length: 32,
            salt: Buffer.from('Pair-Setup-Encrypt-Salt'),
            info: Buffer.from('Pair-Setup-Encrypt-Info')
        });

        const deviceInfo = Buffer.concat([
            iosDeviceX,
            this.#pairingId,
            this.#publicKey
        ]);

        const signature = tweetnacl.sign.detached(deviceInfo, this.#privateKey);

        const innerTLV = encodeTlv([
            [TlvValue.Identifier, this.#pairingId],
            [TlvValue.PublicKey, this.#publicKey],
            [TlvValue.Signature, Buffer.from(signature)],
            [TlvValue.Name, Buffer.from(encodeOPack({
                name: this.#deviceName
            }))]
        ]);

        const {authTag, ciphertext} = encryptChacha20(sessionKey, Buffer.from('PS-Msg05'), null, innerTLV);
        const encrypted = Buffer.concat([ciphertext, authTag]);

        const [, response] = await this.#socket.send(FrameType.PS_Next, {
            _pd: encodeTlv([
                [TlvValue.State, TlvState.M5],
                [TlvValue.EncryptedData, Buffer.from(encrypted)]
            ]),
            _pwTy: 1
        });

        const data = this.#decode(response);
        const encryptedDataRaw = data.get(TlvValue.EncryptedData);
        const encryptedData = encryptedDataRaw.subarray(0, -16);
        const encryptedTag = encryptedDataRaw.subarray(-16);

        return {
            authTag: encryptedTag,
            data: encryptedData,
            sessionKey
        };
    }

    async #m6(m4: M4, m5: M5): Promise<M6> {
        const data = decryptChacha20(m5.sessionKey, Buffer.from('PS-Msg06'), null, m5.data, m5.authTag);
        const tlv = decodeTlv(data);

        const accessoryIdentifier = tlv.get(TlvValue.Identifier);
        const accessoryLongTermPublicKey = tlv.get(TlvValue.PublicKey);
        const accessorySignature = tlv.get(TlvValue.Signature);

        const accessoryX = hkdf({
            hash: 'sha512',
            key: m4.sharedSecret,
            length: 32,
            salt: Buffer.from('Pair-Setup-Accessory-Sign-Salt'),
            info: Buffer.from('Pair-Setup-Accessory-Sign-Info')
        });

        const accessoryInfo = Buffer.concat([
            accessoryX,
            accessoryIdentifier,
            accessoryLongTermPublicKey
        ]);

        if (!tweetnacl.sign.detached.verify(accessoryInfo, accessorySignature, accessoryLongTermPublicKey)) {
            throw new Error('Invalid accessory signature.');
        }

        return {
            accessoryIdentifier: accessoryIdentifier.toString(),
            accessoryLongTermPublicKey: accessoryLongTermPublicKey,
            pairingId: this.#pairingId,
            privateKey: this.#privateKey,
            publicKey: this.#publicKey
        };
    }

    #decode(response: unknown): Map<number, Buffer> {
        if (typeof response !== 'object' || response === null) {
            throw new Error('Invalid response.');
        }

        const data = decodeTlv(response['_pd']);

        if (data.has(TlvValue.Error)) {
            bailTlv(data);
        }

        console.log('Decoded TLV8', data);

        return data;
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

type M5 = {
    readonly authTag: Buffer;
    readonly data: Buffer;
    readonly sessionKey: Buffer;
};

type M6 = {
    readonly accessoryIdentifier: string;
    readonly accessoryLongTermPublicKey: Buffer;
    readonly pairingId: Buffer;
    readonly privateKey: Buffer;
    readonly publicKey: Buffer;
};
