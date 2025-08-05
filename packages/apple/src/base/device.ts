import { v4 as uuidv4 } from 'uuid';

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
        this.#id = uuidv4().substring(0, 8);
        this.#fqdn = fqdn;
        this.#host = host;
        this.#port = port;
        this.#mac = mac;
    }
}
