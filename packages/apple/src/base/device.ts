import { v4 as uuid } from 'uuid';

export default class BaseDevice {
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

    readonly #id: string;
    readonly #fqdn: string;
    readonly #host: string;
    readonly #port: number;
    readonly #mac?: string;

    constructor(fqdn: string, host: string, port: number, mac?: string) {
        this.#id = uuid();
        this.#fqdn = fqdn;
        this.#host = host;
        this.#port = port;
        this.#mac = mac;
    }
}
