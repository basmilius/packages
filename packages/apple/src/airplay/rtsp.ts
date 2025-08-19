import { dbFromPercentage, generateActiveRemote, generateDacpId, getMacAddress, parseBinaryPlist, serializeBinaryPlist, uuid } from '@/support';
import type AirPlayDevice from './device';
import type AirPlayHttpClient from './http';
import { Socket } from 'node:net';

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

    async setup(request: Buffer): Promise<any> {
        const response = await this.#client.write('SETUP', `/${this.#sessionId}`, request, {
            'Content-Type': 'application/x-apple-binary-plist',
            'DACP-ID': this.#dacpId,
            'Client-Instance': this.#dacpId,
            'Active-Remote': this.#activeRemote
        });
        const data = await response.arrayBuffer();

        return parseBinaryPlist(data);
    }

    async setupDataStream(sharedSecret: Buffer): Promise<void> {
        const seed = Math.floor(Math.random() * 2 ** 64);
        const request = serializeBinaryPlist({
            streams: [
                {
                    controlType: 2,
                    channelID: uuid().toUpperCase(),
                    seed,
                    clientUUID: uuid().toUpperCase(),
                    type: 130,
                    wantsDedicatedSocket: true,
                    clientTypeUUID: '1910A70F-DBC0-4242-AF95-115DB30604E1'
                }
            ]
        });

        const response = await this.setup(Buffer.from(request));
        const dataStreamPort = response.streams[0].dataPort & 0xFFFF;

        await this.#device.dataStream.setup(sharedSecret, seed);
        await this.#device.dataStream.connect(dataStreamPort, this.#device.host);
    }

    async setupEventStream(pairingId: Buffer, sharedSecret: Buffer): Promise<void> {
        const request = serializeBinaryPlist({
            isRemoteControlOnly: true,
            osName: 'iPhone OS',
            sourceVersion: '550.10',
            timingProtocol: 'None',
            model: 'iPhone10,6',
            deviceID: pairingId.toString(),
            osVersion: '18.4.0',
            osBuildVersion: '18G82',
            macAddress: getMacAddress(),
            sessionUUID: this.#sessionUUID,
            name: 'Bas AirPlay Client'
        });

        const response = await this.setup(Buffer.from(request));
        const eventPort = response.eventPort & 0xFFFF;

        await this.#device.eventStream.setup(sharedSecret);
        await this.#device.eventStream.connect(eventPort, this.#device.host);
    }

    async feedback(): Promise<void> {
        const feedback = await this.#client.write('POST', '/feedback', null, {
            'DACP-ID': this.#dacpId,
            'Client-Instance': this.#dacpId,
            'Active-Remote': this.#activeRemote
        });
        // console.log('feedback', feedback, await feedback.text());
    }

    async record(): Promise<void> {
        const record = await this.#client.write('RECORD', `/${this.#sessionId}`, null, {
            'DACP-ID': this.#dacpId,
            'Client-Instance': this.#dacpId,
            'Active-Remote': this.#activeRemote
        });
        // console.log('record', {record, response: await record.text()});
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
