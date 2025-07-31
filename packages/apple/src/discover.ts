import mdns from 'node-dns-sd';
import { AIRPLAY_SERVICE, COMPANION_LINK_SERVICE, RAOP_SERVICE } from '@/const';

export default class Discover<T extends Record<string, any>> {
    readonly #service: string;

    constructor(service: string) {
        this.#service = service;
    }

    async find(): Promise<T[]> {
        return await mdns.discover({
            name: this.#service
        });
    }

    static airplay(): Discover<AirPlayDiscoveredDevice> {
        return new Discover(AIRPLAY_SERVICE);
    }

    static companionLink(): Discover<never> {
        return new Discover(COMPANION_LINK_SERVICE);
    }

    static raop(): Discover<never> {
        return new Discover(RAOP_SERVICE);
    }
}

export type AirPlayDiscoveredDevice = Record<string, any>;
