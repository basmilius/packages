import { BaseDevice } from '@/base';
import CompanionLinkPairing from './pairing';
import CompanionLinkSocket from './socket';
import CompanionLinkVerify from './verify';

export default class CompanionLinkDevice extends BaseDevice {
    get pairing(): CompanionLinkPairing {
        return this.#pairing;
    }

    get socket(): CompanionLinkSocket {
        return this.#socket;
    }

    get verify(): CompanionLinkVerify {
        return this.#verify;
    }

    readonly #pairing: CompanionLinkPairing;
    readonly #socket: CompanionLinkSocket;
    readonly #verify: CompanionLinkVerify;

    constructor(fqdn: string, host: string, port: number, mac?: string) {
        super(fqdn, host, port, mac);

        this.#socket = new CompanionLinkSocket(this);
        this.#pairing = new CompanionLinkPairing(this, this.#socket);
        this.#verify = new CompanionLinkVerify(this, this.#socket);
    }
}
