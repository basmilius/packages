declare module 'chacha' {
    declare class Cipher {
        setAAD(aad: Buffer): void;
        getAuthTag(): Buffer;
        setAuthTag(tag: Buffer): void;
        _final(): void;
        _update(chunk: Buffer): Buffer;
    }

    export function createCipher(key: Buffer, nonce: Buffer): Cipher;
    export function createDecipher(key: Buffer, nonce: Buffer): Cipher;
}

declare module 'node-dns-sd';
