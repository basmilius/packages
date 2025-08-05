import { Socket } from 'node:net';
import type { AirPlayDevice } from '@/airplay';
import { decodeOPack, decryptChacha20, encodeOPack, encryptChacha20 } from '@/support';
import { DecodeOPackFrameTypes, FrameType } from './protocol';
import type CompanionLinkDevice from './device';

export default class CompanionLinkSocket {
    get isEncrypted(): boolean {
        return !!this.#readKey && !!this.#writeKey;
    }

    readonly #device: AirPlayDevice | CompanionLinkDevice;
    readonly #socket: Socket;
    #queue: Record<number, Function> = [];
    #xid: number = Math.floor(Math.random() * 65536);
    #readCount: number = 0;
    #readKey: Buffer;
    #writeCount: number = 0;
    #writeKey: Buffer;
    #incompleteFrame?: Buffer;

    constructor(device: AirPlayDevice | CompanionLinkDevice) {
        this.#device = device;

        this.#socket = new Socket();
        this.#socket.on('close', this.#onClose.bind(this));
        this.#socket.on('connect', this.#onConnect.bind(this));
        this.#socket.on('data', this.#onData.bind(this));
        this.#socket.on('end', this.#onEnd.bind(this));
        this.#socket.on('error', this.#onError.bind(this));
    }

    async connect(): Promise<void> {
        return await new Promise(resolve => {
            this.#socket.connect({
                host: this.#device.host,
                port: this.#device.port,
                keepAlive: true
            }, resolve);
        });
    }

    enableEncryption(readKey: Buffer, writeKey: Buffer): void {
        this.#readKey = readKey;
        this.#writeKey = writeKey;
    }

    #onClose(): void {
        console.log('Connection closed');
    }

    #onConnect(): void {
        console.log(`Connected to ${this.#device.host}:${this.#device.port}!`);
    }

    async #onData(buffer: Buffer): Promise<void> {
        // console.debug('Received data', buffer.toString('hex'));
        await this.receive(buffer);
    }

    #onEnd(): void {
        console.log('Connection ended by server');
    }

    #onError(err: Error): void {
        console.error('Connection error', err);
    }

    async receive(buffer: Buffer): Promise<void> {
        console.debug('Received data', buffer.toString('hex'));

        buffer = await this.decrypt(buffer);

        const header = buffer.subarray(0, 4).readInt8();
        let payload = buffer.subarray(4);

        // console.log('Received OPACK', payload.toString('hex'));

        if (DecodeOPackFrameTypes.includes(header)) {
            payload = decodeOPack(payload);
        }

        console.debug('Decoded OPACK', {header, payload});

        if (this.#queue[header]) {
            this.#queue[header]([header, payload]);
            delete this.#queue[header];
        }
    }

    async send(type: number, obj: Record<string, any>): Promise<[number, unknown]> {
        obj._x ??= this.#xid++;

        let identifier = type;

        if (type === FrameType.PS_Start) {
            identifier = FrameType.PS_Next;
        } else if (type === FrameType.PV_Start) {
            identifier = FrameType.PV_Next;
        }

        let payload = encodeOPack(obj);
        let payloadLength = payload.byteLength;

        if (this.isEncrypted) {
            payloadLength += 16;
        }

        const header = Buffer.alloc(4);
        header.writeUInt8(type, 0);
        header.writeUIntBE(payloadLength, 1, 3);

        if (this.isEncrypted) {
            const nonce = Buffer.alloc(12);
            nonce.writeBigUInt64LE(BigInt(this.#writeCount++), 4);

            const encrypted = encryptChacha20(this.#writeKey, nonce, null, Buffer.from(payload));
            payload = Buffer.concat([encrypted.ciphertext, encrypted.authTag]);
        }

        const data = Buffer.concat([header, payload]);

        return new Promise((resolve, reject) => {
            console.debug('Sending OPACK', data);

            this.#queue[identifier] = resolve;
            this.#socket.write(data, err => err && reject(err));
        });
    }

    async decrypt(data: Buffer): Promise<Buffer> {
        if (!this.isEncrypted) {
            return data;
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

        return result;
    }

    async encrypt(data: Buffer): Promise<Buffer> {
        if (!this.isEncrypted) {
            return data;
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

        return result;
    }
}
