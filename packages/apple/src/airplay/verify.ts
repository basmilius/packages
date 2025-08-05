import tweetnacl, { type BoxKeyPair } from 'tweetnacl';
import { BaseHttpClient } from '@/base';
import { bailTlv, decodeTlv, decryptChacha20, encodeTlv, encryptChacha20, generateCurve25519KeyPair, generateCurve25519SharedSecKey, hkdf, TlvState, TlvValue } from '@/support';
import type AirPlayDevice from './device';

export default class AirPlayVerify {
    readonly #client: BaseHttpClient;
    readonly #device: AirPlayDevice;
    readonly #ephemeralKeyPair: BoxKeyPair;

    constructor(device: AirPlayDevice, client: BaseHttpClient) {
        this.#client = client;
        this.#device = device;
        this.#ephemeralKeyPair = generateCurve25519KeyPair();
    }

    async verify(credentials: Credentials): Promise<M4> {
        const longTermPublicKey = Buffer.from(credentials.longTermPublicKey, 'hex');
        const privateKey = Buffer.from(credentials.privateKey, 'hex');
        const publicKey = Buffer.from(credentials.publicKey, 'hex');

        const m1 = await this.#m1();
        const m2 = await this.#m2(credentials.identifier, longTermPublicKey, m1);
        await this.#m3(credentials.pairingId, privateKey, m2);

        return await this.#m4(m2);
    }

    async #m1(): Promise<M1> {
        const response = await this.#client.write('POST', '/pair-verify', encodeTlv([
            [TlvValue.State, TlvState.M1],
            [TlvValue.PublicKey, Buffer.from(this.#ephemeralKeyPair.publicKey)]
        ]), {
            'Content-Type': 'application/pairing+tlv8',
            'X-Apple-HKP': '3'
        });

        const tlv = await response.arrayBuffer();
        const data = decodeTlv(Buffer.from(tlv));

        if (data.has(TlvValue.Error)) {
            bailTlv(data);
        }

        const serverPublicKey = data.get(TlvValue.PublicKey);
        const encryptedData = data.get(TlvValue.EncryptedData);

        return {
            encryptedData,
            serverPublicKey
        };
    }

    async #m2(localAccessoryIdentifier: string, longTermPublicKey: Buffer, m1: M1): Promise<M2> {
        const sharedSecret = Buffer.from(generateCurve25519SharedSecKey(
            this.#ephemeralKeyPair.secretKey,
            m1.serverPublicKey
        ));

        const sessionKey = hkdf({
            hash: 'sha512',
            key: sharedSecret,
            length: 32,
            salt: Buffer.from('Pair-Verify-Encrypt-Salt'),
            info: Buffer.from('Pair-Verify-Encrypt-Info')
        });

        const encryptedData = m1.encryptedData.subarray(0, -16);
        const encryptedTag = m1.encryptedData.subarray(-16);

        const data = decryptChacha20(sessionKey, Buffer.from('PV-Msg02'), null, encryptedData, encryptedTag);
        const tlv = decodeTlv(data);

        const accessoryIdentifier = tlv.get(TlvValue.Identifier);
        const accessorySignature = tlv.get(TlvValue.Signature);

        if (accessoryIdentifier.toString() !== localAccessoryIdentifier) {
            throw new Error(`Invalid accessory identifier. Expected ${accessoryIdentifier.toString()} to be ${localAccessoryIdentifier}.`);
        }

        const accessoryInfo = Buffer.concat([
            m1.serverPublicKey,
            accessoryIdentifier,
            this.#ephemeralKeyPair.publicKey
        ]);

        if (!tweetnacl.sign.detached.verify(accessoryInfo, accessorySignature, longTermPublicKey)) {
            throw new Error('Invalid accessory signature.');
        }

        return {
            serverEphemeralPublicKey: m1.serverPublicKey,
            sessionKey,
            sharedSecret
        };
    }

    async #m3(pairingId: string, privateKey: Buffer, m2: M2): Promise<M3> {
        const iosDeviceInfo = Buffer.concat([
            this.#ephemeralKeyPair.publicKey,
            Buffer.from(pairingId),
            m2.serverEphemeralPublicKey
        ]);

        const iosDeviceSignature = Buffer.from(tweetnacl.sign.detached(iosDeviceInfo, privateKey));

        const innerTLV = encodeTlv([
            [TlvValue.Identifier, Buffer.from(pairingId)],
            [TlvValue.Signature, iosDeviceSignature]
        ]);

        const encrypted = encryptChacha20(m2.sessionKey, Buffer.from('PV-Msg03'), null, innerTLV);

        const response = await this.#client.write('POST', '/pair-verify', encodeTlv([
            [TlvValue.State, TlvState.M3],
            [TlvValue.EncryptedData, Buffer.concat([encrypted.ciphertext, encrypted.authTag])]
        ]), {
            'Content-Type': 'application/pairing+tlv8',
            'X-Apple-HKP': '3'
        });

        const tlv = await response.arrayBuffer();
        const data = decodeTlv(Buffer.from(tlv));

        if (data.has(TlvValue.Error)) {
            bailTlv(data);
        }

        return {};
    }

    async #m4(m2: M2): Promise<M4> {
        const salt = Buffer.from('Control-Salt');

        const accessoryToControllerKey = hkdf({
            hash: 'sha512',
            key: m2.sharedSecret,
            length: 32,
            salt,
            info: Buffer.from('Control-Read-Encryption-Key')
        });

        const controllerToAccessoryKey = hkdf({
            hash: 'sha512',
            key: m2.sharedSecret,
            length: 32,
            salt,
            info: Buffer.from('Control-Write-Encryption-Key')
        });

        return {
            accessoryToControllerKey,
            controllerToAccessoryKey
        };
    }
}

type Credentials = {
    readonly identifier: string;
    readonly longTermPublicKey: string;
    readonly pairingId: string;
    readonly privateKey: string;
    readonly publicKey: string;
};

type M1 = {
    readonly encryptedData: Buffer;
    readonly serverPublicKey: Buffer;
};

type M2 = {
    readonly serverEphemeralPublicKey: Buffer;
    readonly sessionKey: Buffer;
    readonly sharedSecret: Buffer;
};

type M3 = {};

type M4 = {
    readonly accessoryToControllerKey: Buffer;
    readonly controllerToAccessoryKey: Buffer;
};
