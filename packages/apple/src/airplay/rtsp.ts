import { dbFromPercentage, generateActiveRemote, generateDacpId, getMacAddress, parseBinaryPlist, serializeBinaryPlist, uuid } from '@/support';
import type AirPlayDevice from './device';
import type AirPlayHttpClient from './http';

export default class AirPlayRTSP {
    readonly #client: AirPlayHttpClient;
    readonly #device: AirPlayDevice;
    readonly #activeRemote: string;
    readonly #dacpId: string;
    readonly #sessionId: string;
    readonly #sessionUUID: string;

    constructor(device: AirPlayDevice, client: AirPlayHttpClient) {
        this.#client = client;
        this.#device = device;

        this.#activeRemote = generateActiveRemote().toString();
        this.#dacpId = generateDacpId();
        this.#sessionId = generateActiveRemote().toString();
        this.#sessionUUID = uuid();
    }

    async setup(pairingId: string): Promise<void> {
        const setupPlist = serializeBinaryPlist({
            isRemoteControlOnly: true,
            osName: 'macOS',
            sourceVersion: '550.10',
            timingProtocol: 'None',
            model: 'MacBookPro18,1',
            deviceID: pairingId,
            osVersion: '18.4.0',
            osBuildVersion: '22E240',
            macAddress: getMacAddress(),
            sessionUUID: this.#sessionUUID,
            name: 'Bas AirPlay Client'
        });

        const response = await this.#client.write('SETUP', `/${this.#sessionId}`, Buffer.from(setupPlist), {
            'Content-Type': 'application/x-apple-binary-plist',
            'Transport': 'RTP/AVP/UDP;unicast;interleaved=0-1;mode=record;control_port=6001;timing_port=6002',
            'DACP-ID': this.#dacpId,
            'Client-Instance': this.#dacpId,
            'Active-Remote': this.#activeRemote
        });
        const data = await response.arrayBuffer();
        const parsed = parseBinaryPlist(data) as { eventPort: number; timingPort: number; };
        const eventPort = (parsed.eventPort < 0) ? parsed.eventPort + 65536 : parsed.eventPort;

        console.log('setup', {response, parsed, eventPort});
    }

    async feedback(): Promise<void> {
        const feedback = await this.#client.write('POST', '/feedback', null, {
            'DACP-ID': this.#dacpId,
            'Client-Instance': this.#dacpId,
            'Active-Remote': this.#activeRemote
        });
        console.log('feedback', feedback, await feedback.text());
    }

    async record(): Promise<void> {
        const record = await this.#client.write('RECORD', `/${this.#sessionId}`, null, {
            'DACP-ID': this.#dacpId,
            'Client-Instance': this.#dacpId,
            'Active-Remote': this.#activeRemote,
            'Range': 'npt=0-',
            'RTP-Info': 'seq=0;rtptime=0'
        });
        console.log('record', {record, response: await record.text()});
    }

    async command(command: string): Promise<void> {
        const response = await this.#client.write('POST', '/command', command, {
            'Content-Type': 'text/plain',
            'DACP-ID': this.#dacpId,
            'Client-Instance': this.#dacpId,
            'Active-Remote': this.#activeRemote
        });
        console.log('command', {response, text: await response.text()});
    }

    async getVolume(): Promise<number> {
        const volume = await this.#client.write('GET_PARAMETER', `/${this.#sessionId}`, 'volume\r\n', {
            'Content-Type': 'text/parameters',
            'DACP-ID': this.#dacpId,
            'Client-Instance': this.#dacpId,
            'Active-Remote': this.#activeRemote
        });

        console.log('volume', {volume, response: await volume.text()});

        return 0;
    }

    async setVolume(volume: number): Promise<void> {
        const db = dbFromPercentage(volume).toFixed(6);

        const response = await this.#client.write('SET_PARAMETER', `/${this.#sessionId}`, `volume: ${db}`, {
            'Content-Type': 'text/parameters',
            'DACP-ID': this.#dacpId,
            'Client-Instance': this.#dacpId,
            'Active-Remote': this.#activeRemote
        });

        console.log('set volume', {response, text: await response.text(), db});
    }
}
