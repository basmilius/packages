import { hkdf } from '@/support';
import type AirPlayDevice from './device';
import AirPlayHttpClient from './http';

export default class AirPlayDataStream extends AirPlayHttpClient {
    constructor(device: AirPlayDevice) {
        super(device);
    }

    async setup(sharedSecret: Buffer, seed: number): Promise<void> {
        const readKey = hkdf({
            hash: 'sha512',
            key: Buffer.concat([sharedSecret, Buffer.from(seed.toString())]),
            length: 32,
            salt: Buffer.from('DataStream-Salt'),
            info: Buffer.from('DataStream-Read-Encryption-Key')
        });

        const writeKey = hkdf({
            hash: 'sha512',
            key: Buffer.concat([sharedSecret, Buffer.from(seed.toString())]),
            length: 32,
            salt: Buffer.from('DataStream-Salt'),
            info: Buffer.from('DataStream-Write-Encryption-Key')
        });

        // note: These keys are flipped, because the device is the one sending the data.
        this.enableEncryption(writeKey, readKey);
    }
}
