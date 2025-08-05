import { BaseHttpClient } from '@/base';
import { decryptChacha20, encryptChacha20, writeUInt64LE } from '@/support';
import AirPlayDevice from './device';

export default class AirPlayHttpClient extends BaseHttpClient {
    get isEncrypted(): boolean {
        return !!this.#readKey && !!this.#writeKey;
    }

    #readCount: number = 0;
    #readKey: Buffer;
    #writeCount: number = 0;
    #writeKey: Buffer;
    #incompleteFrame?: Buffer;

    constructor(device: AirPlayDevice) {
        super(device);
    }

    enableEncryption(readKey: Buffer, writeKey: Buffer): void {
        this.#readKey = readKey;
        this.#writeKey = writeKey;
    }

    async readRaw(data: Buffer): Promise<Buffer> {
        // console.debug('incoming data', this.isEncrypted, data);

        if (!this.isEncrypted) {
            return await super.readRaw(data);
        }

        if (this.#incompleteFrame) {
            data = Buffer.concat([this.#incompleteFrame, data]);
            this.#incompleteFrame = undefined;
        }

        let result = Buffer.alloc(0);
        let offset = 0;

        while (offset + 2 <= data.length) {
            const length = data.readUInt16LE(offset); // 2-byte LE length

            // Total chunk = 2 (length prefix) + ciphertext length + 16 (auth tag)
            const totalChunkLength = 2 + length + 16;

            if (offset + totalChunkLength > data.length) {
                // Incomplete frame, wait for more data
                this.#incompleteFrame = data.subarray(offset);
                break;
            }

            const aad = data.subarray(offset, offset + 2); // the 2-byte LE length
            const ciphertext = data.subarray(offset + 2, offset + 2 + length);
            const authTag = data.subarray(offset + 2 + length, offset + 2 + length + 16);

            const nonce = Buffer.alloc(12);
            nonce.writeBigUInt64LE(BigInt(this.#readCount++), 4); // write at offset 4

            const plaintext = decryptChacha20(
                this.#readKey,
                nonce,
                aad,
                ciphertext,
                authTag
            );

            result = Buffer.concat([result, plaintext]);
            offset += totalChunkLength;
        }

        // console.debug('read', result);

        return result;
    }

    async writeRaw(data: Buffer): Promise<Response> {
        if (!this.isEncrypted) {
            return super.writeRaw(data);
        }

        const total = data.length;
        let result = Buffer.alloc(0);

        for (let offset = 0; offset < total;) {
            const length = Math.min(total - offset, 0x400);
            const leLength = Buffer.alloc(2);
            leLength.writeUInt16LE(length, 0);

            const nonce = Buffer.alloc(12); // 12 bytes total
            nonce.writeBigUInt64LE(BigInt(this.#writeCount++), 4); // write counter at offset 4

            const encrypted = encryptChacha20(
                this.#writeKey,
                nonce,
                leLength, // AAD
                data.subarray(offset, offset + length)
            );

            offset += length;
            result = Buffer.concat([result, leLength, encrypted.ciphertext, encrypted.authTag]);
        }

        // console.debug('write', result.toString('hex'));

        return super.writeRaw(result);
    }
}
