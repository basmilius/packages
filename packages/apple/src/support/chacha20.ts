import { createCipheriv, createDecipheriv } from 'node:crypto';

const AUTH_TAG_LENGTH = 16;
const NONCE_LENGTH = 12;

export function decrypt(key: Buffer, nonce: Buffer, aad: Buffer | null, ciphertext: Buffer, authTag: Buffer): Buffer {
    if (nonce.length < NONCE_LENGTH) {
        nonce = Buffer.concat([
            Buffer.alloc(NONCE_LENGTH - nonce.length, 0),
            nonce
        ]);
    }

    const decipher = createDecipheriv('chacha20-poly1305', key, nonce, {authTagLength: AUTH_TAG_LENGTH});
    aad && decipher.setAAD(aad, {plaintextLength: ciphertext.length});
    decipher.setAuthTag(authTag);

    const plaintext = decipher.update(ciphertext);
    decipher.final();

    return plaintext;
}

export function encrypt(key: Buffer, nonce: Buffer, aad: Buffer | null, plaintext: Buffer): EncryptedData {
    if (nonce.length < NONCE_LENGTH) {
        nonce = Buffer.concat([
            Buffer.alloc(NONCE_LENGTH - nonce.length, 0),
            nonce
        ]);
    }

    const cipher = createCipheriv('chacha20-poly1305', key, nonce, {authTagLength: AUTH_TAG_LENGTH});
    aad && cipher.setAAD(aad, {plaintextLength: plaintext.length});

    const ciphertext = cipher.update(plaintext);
    cipher.final();

    const authTag = cipher.getAuthTag();

    return {
        ciphertext: ciphertext,
        authTag: authTag
    };
}

export type EncryptedData = {
    readonly ciphertext: Buffer;
    readonly authTag: Buffer;
};
