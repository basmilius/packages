import { v4 as uuidv4 } from 'uuid';
import * as plist from '@plist/binary.parse';
import AirPlayHttpClient from './http';
import AirPlayPairing from './pairing';

export default class AirPlayDevice {
    get id(): string {
        return this.#id;
    }

    get fqdn(): string {
        return this.#fqdn;
    }

    get host(): string {
        return this.#host;
    }

    get port(): number {
        return this.#port;
    }

    get mac(): string | undefined {
        return this.#mac;
    }

    get pairing(): AirPlayPairing {
        return this.#pairing;
    }

    readonly #id: string;
    readonly #fqdn: string;
    readonly #host: string;
    readonly #port: number;
    readonly #mac?: string;
    readonly #client: AirPlayHttpClient;
    readonly #pairing: AirPlayPairing;

    constructor(fqdn: string, host: string, port: number, mac?: string) {
        this.#id = uuidv4().substring(0, 8);
        this.#fqdn = fqdn;
        this.#host = host;
        this.#port = port;
        this.#mac = mac;
        this.#client = new AirPlayHttpClient(this);
        this.#pairing = new AirPlayPairing(this, this.#client);
    }

    async connect(): Promise<void> {
        await this.#client.connect();
    }

    async pair(): Promise<void> {
        await this.#pairing.start('Bun Client');

        const m1 = await this.#pairing.m1();
        const m2 = await this.#pairing.m2(m1.publicKey, m1.salt);
        const m3 = await this.#pairing.m3(m2.publicKey, m2.proof);
        const m4 = await this.#pairing.m4(m3.serverProof);
        await this.#pairing.m5(m4.sharedSecret);
    }

    async info(): Promise<Record<string, unknown>> {
        const info = await this.#client.write('GET', '/info');
        const data = await info.arrayBuffer();

        return plist.parse(data) as Record<string, unknown>;
    }

    async playbackInfo(): Promise<string> {
        const info = await this.#client.write('GET', '/playback-info');
        const data = await info.text();

        // todo(Bas): parse, validate and dto.

        return data;
    }

    async serverInfo(): Promise<string> {
        const info = await this.#client.write('GET', '/server-info');
        const data = await info.text();

        // todo(Bas): parse, validate and dto.

        return data;
    }

    async volume(): Promise<number> {
        const info = await this.#client.write('GET', '/volume');
        const data = await info.text();

        // todo(Bas): parse, validate and dto.

        return Number(data);
    }

    async changeVolume(volume: number): Promise<void> {
        await this.#client.write('POST', '/volume', String(volume));
    }
}
