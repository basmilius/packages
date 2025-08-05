import { randomBytes, randomInt } from 'node:crypto';
import { default as _hkdf } from 'futoin-hkdf';
import tweetnacl, { BoxKeyPair } from 'tweetnacl';

export function generateCurve25519KeyPair(): BoxKeyPair {
    return tweetnacl.box.keyPair();
}

export function generateCurve25519SharedSecKey(priKey: Uint8Array, pubKey: Uint8Array): Uint8Array {
    return tweetnacl.scalarMult(priKey, pubKey);
}

export function generateActiveRemote(): number {
    return randomInt(0, 2 ** 32);
}

export function generateDacpId(): string {
    return randomBytes(8).toString('hex').toUpperCase();
}

export function hkdf(options: HKDFOptions): Buffer {
    return _hkdf(options.key, options.length, {
        hash: options.hash,
        salt: options.salt,
        info: options.info
    });
}


const MAX_UINT32 = 0x00000000FFFFFFFF;
const MAX_INT53 = 0x001FFFFFFFFFFFFF;

function uintHighLow(number: number) {
    let high = 0;
    const signbit = number & 0xFFFFFFFF;
    const low = signbit < 0 ? (number & 0x7FFFFFFF) + 0x80000000 : signbit;

    if (number > MAX_UINT32) {
        high = (number - low) / (MAX_UINT32 + 1);
    }

    return [high, low];
}

export function writeUInt64LE(number: number, buffer: Buffer, offset = 0): void {
    const hl = uintHighLow(number);
    buffer.writeUInt32LE(hl[1], offset);
    buffer.writeUInt32LE(hl[0], offset + 4);
}

export type HKDFOptions = {
    readonly hash: string;
    readonly key: Buffer;
    readonly length: number;
    readonly salt: Buffer;
    readonly info: Buffer;
};
