import { SRP, SrpClient } from 'fast-srp-hap';
import type { BaseHttpClient } from '@/base';
import { AIRPLAY_TRANSIENT_PIN } from '@/const';
import { bailTlv, decodeTlv, decryptChacha20, encodeOPack, encodeTlv, encryptChacha20, hkdf, TlvFlags, TlvMethod, TlvState, TlvValue } from '@/support';
import tweetnacl from 'tweetnacl';
import type AirPlayDevice from './device';

export default class AirPlayPairing {
    readonly #client: BaseHttpClient;
    readonly #device: AirPlayDevice;
    readonly #pairingId: Buffer;
    readonly #deviceName: string;
    #privateKey: Buffer;
    #publicKey: Buffer;
    #srp?: SrpClient;

    constructor(device: AirPlayDevice, client: BaseHttpClient) {
        this.#device = device;
        this.#client = client;

        this.#deviceName = 'Bas AirPlay Client';
        this.#pairingId = Buffer.from(this.#device.id, 'utf8');
    }

    async startPinPairing(askPin: () => Promise<string>): Promise<M6> {
        this.#start();

        await this.#client.write('POST', '/pair-pin-start', null, {
            'X-Apple-HKP': '3'
        });

        const m1 = await this.#m1(3);
        const m2 = await this.#m2(m1, await askPin());
        const m3 = await this.#m3(3, m2);
        const m4 = await this.#m4(m3);
        const m5 = await this.#m5(m4);
        const m6 = await this.#m6(m4, m5);

        if (!m6) {
            throw new Error('Pairing failed, could not get accessory keys.');
        }

        return m6;
    }

    async startTransientPairing(): Promise<TransientPairingCredentials> {
        this.#start();

        await this.#client.write('POST', '/pair-pin-start', null, {
            'X-Apple-HKP': '4'
        });

        const m1 = await this.#m1(4, [[TlvValue.Flags, TlvFlags.TransientPairing]]);
        const m2 = await this.#m2(m1);
        const m3 = await this.#m3(4, m2);
        const m4 = await this.#m4(m3);

        const accessoryToControllerKey = hkdf({
            hash: 'sha512',
            key: m4.sharedSecret,
            length: 32,
            salt: Buffer.from('Control-Salt'),
            info: Buffer.from('Control-Read-Encryption-Key')
        });

        const controllerToAccessoryKey = hkdf({
            hash: 'sha512',
            key: m4.sharedSecret,
            length: 32,
            salt: Buffer.from('Control-Salt'),
            info: Buffer.from('Control-Write-Encryption-Key')
        });

        return {
            pairingId: this.#pairingId,
            sharedSecret: m4.sharedSecret,
            accessoryToControllerKey,
            controllerToAccessoryKey
        };
    }

    #start(): void {
        const keyPair = tweetnacl.sign.keyPair();
        this.#privateKey = Buffer.from(keyPair.secretKey);
        this.#publicKey = Buffer.from(keyPair.publicKey);
    }

    async #m1(hkp: 3 | 4, additionalTlv: [number, number | Buffer][] = []): Promise<M1> {
        const response = await this.#client.write('POST', '/pair-setup', encodeTlv([
            [TlvValue.Method, TlvMethod.PairSetup],
            [TlvValue.State, TlvState.M1],
            ...additionalTlv
        ]), {
            'Content-Type': 'application/octet-stream',
            'X-Apple-HKP': hkp.toString()
        });

        const tlv = await response.arrayBuffer();
        const data = decodeTlv(Buffer.from(tlv));

        if (data.has(TlvValue.Error)) {
            bailTlv(data);
        }

        const publicKey = data.get(TlvValue.PublicKey);
        const salt = data.get(TlvValue.Salt);

        return {publicKey, salt};
    }

    async #m2(m1: M1, pin: string = AIRPLAY_TRANSIENT_PIN): Promise<M2> {
        const srpKey = await SRP.genKey(32);

        this.#srp = new SrpClient(SRP.params.hap, m1.salt, Buffer.from('Pair-Setup'), Buffer.from(pin), srpKey, true);
        this.#srp.setB(m1.publicKey);

        const publicKey = this.#srp.computeA();
        const proof = this.#srp.computeM1();

        return {publicKey, proof};
    }

    async #m3(hkp: 3 | 4, m2: M2): Promise<M3> {
        const response = await this.#client.write('POST', '/pair-setup', encodeTlv([
            [TlvValue.State, TlvState.M3],
            [TlvValue.PublicKey, m2.publicKey],
            [TlvValue.Proof, m2.proof]
        ]), {
            'Content-Type': 'application/octet-stream',
            'X-Apple-HKP': hkp.toString()
        });

        const tlv = await response.arrayBuffer();
        const data = decodeTlv(Buffer.from(tlv));

        if (data.has(TlvValue.Error)) {
            bailTlv(data);
        }

        const serverProof = data.get(TlvValue.Proof);

        return {serverProof};
    }

    async #m4(m3: M3): Promise<M4> {
        this.#srp.checkM2(m3.serverProof);

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

    async #m5(m4: M4): Promise<M5> {
        const iosDeviceX = hkdf({
            hash: 'sha512',
            key: m4.sharedSecret,
            length: 32,
            salt: Buffer.from('Pair-Setup-Controller-Sign-Salt', 'utf8'),
            info: Buffer.from('Pair-Setup-Controller-Sign-Info', 'utf8')
        });

        const sessionKey = hkdf({
            hash: 'sha512',
            key: m4.sharedSecret,
            length: 32,
            salt: Buffer.from('Pair-Setup-Encrypt-Salt', 'utf8'),
            info: Buffer.from('Pair-Setup-Encrypt-Info', 'utf8')
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

        const response = await this.#client.write('POST', '/pair-setup', encodeTlv([
            [TlvValue.State, TlvState.M5],
            [TlvValue.EncryptedData, encrypted]
        ]), {
            'Content-Type': 'application/octet-stream',
            'X-Apple-HKP': '3'
        });

        const tlv = await response.arrayBuffer();
        const data = decodeTlv(Buffer.from(tlv));

        if (data.has(TlvValue.Error)) {
            bailTlv(data);
        }

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

type TransientPairingCredentials = {
    readonly pairingId: Buffer;
    readonly sharedSecret: Buffer;
    readonly accessoryToControllerKey: Buffer;
    readonly controllerToAccessoryKey: Buffer;
};
