import * as plist from '@plist/binary.parse';
import { BaseDevice } from '@/base';
import AirPlayHttpClient from './http';
import AirPlayPairing from './pairing';
import AirPlayRTSP from './rtsp';
import AirPlayVerify from './verify';

export default class AirPlayDevice extends BaseDevice {
    get client(): AirPlayHttpClient {
        return this.#client;
    }

    get pairing(): AirPlayPairing {
        return this.#pairing;
    }

    get rtsp(): AirPlayRTSP {
        return this.#rtsp;
    }

    get verify(): AirPlayVerify {
        return this.#verify;
    }

    readonly #client: AirPlayHttpClient;
    readonly #pairing: AirPlayPairing;
    readonly #rtsp: AirPlayRTSP;
    readonly #verify: AirPlayVerify;

    constructor(fqdn: string, host: string, port: number, mac?: string) {
        super(fqdn, host, port, mac);

        this.#client = new AirPlayHttpClient(this);
        this.#pairing = new AirPlayPairing(this, this.#client);
        this.#rtsp = new AirPlayRTSP(this, this.#client);
        this.#verify = new AirPlayVerify(this, this.#client);
    }

    async connect(): Promise<void> {
        await this.#client.connect();
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
