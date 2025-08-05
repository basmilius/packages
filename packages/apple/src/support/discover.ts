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

    async findUntil(fqdn: string, tries: number = 10, timeout: number = 1000): Promise<T> {
        while (tries > 0) {
            const devices = await this.find();
            const device = devices.find(device => device.fqdn === fqdn);

            if (device) {
                return device;
            }

            console.log();
            console.log(`Device not found, retrying in ${timeout}ms...`);
            console.log(devices.map(device => device.fqdn).join('\n'));

            tries--;

            await new Promise(resolve => setTimeout(resolve, timeout));

            if (tries === 0) {
                throw new Error(`Device not found after serveral tries, aborting.`);
            }
        }
    }

    static airplay(): Discover<AirPlayDiscoveredDevice> {
        return new Discover(AIRPLAY_SERVICE);
    }

    static companionLink(): Discover<CompanionLinkDiscoveredDevice> {
        return new Discover(COMPANION_LINK_SERVICE);
    }

    static raop(): Discover<never> {
        return new Discover(RAOP_SERVICE);
    }
}

export type AirPlayDiscoveredDevice = Record<string, any>;
export type CompanionLinkDiscoveredDevice = Record<string, any>;
