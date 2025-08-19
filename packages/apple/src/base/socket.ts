import { Socket as NativeSocket } from 'node:net';
import type BaseDevice from './device';
import { styleText } from 'node:util';
import { HTTP_TIMEOUT } from '@/const';

type Method = 'GET' | 'OPTIONS' | 'POST' | 'PUT' | 'GET_PARAMETER' | 'SET_PARAMETER' | 'ANNOUNCE' | 'RECORD' | 'SETUP' | 'TEARDOWN';

type Reject = (reason?: Error) => void;
type Resolve = (value?: unknown) => void;

class Responder {
    #reject: Reject;
    #resolve: Resolve;

    clear(): void {
        this.#reject = undefined;
        this.#resolve = undefined;
    }

    reject(reason?: Error): void {
        this.#reject?.(reason);
        this.#reject = undefined;
        this.#resolve = undefined;
    }

    resolve(value?: unknown): void {
        this.#resolve?.(value);
        this.#reject = undefined;
        this.#resolve = undefined;
    }

    use(resolve: Resolve, reject: Reject): void {
        this.#reject = reject;
        this.#resolve = resolve;
    }
}

abstract class BaseSocket {
    get connected(): boolean {
        return this.#connected;
    }

    get device(): BaseDevice {
        return this.#device;
    }

    get encrypted(): boolean {
        return !!this.#encryption;
    }

    readonly #device: BaseDevice;
    readonly #responder: Responder;
    #connected = false;
    #encryption: BaseSocketEncryption;
    #socket: NativeSocket;

    constructor(device: BaseDevice) {
        this.#device = device;
        this.#responder = new Responder();

        this.#socket = new NativeSocket();
        this.#socket.on('close', this.#onClose.bind(this));
        this.#socket.on('connect', this.#onConnect.bind(this));
        this.#socket.on('data', this.#onData.bind(this));
        this.#socket.on('end', this.#onEnd.bind(this));
        this.#socket.on('error', this.#onError.bind(this));
        this.#socket.on('lookup', this.#onLookup.bind(this));
        this.#socket.on('ready', this.#onReady.bind(this));
        this.#socket.on('timeout', this.#onTimeout.bind(this));
    }

    async connect(port: number, host: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.#responder.use(resolve, reject);
            this.#socket.connect(port, host);
        });
    }

    abstract read(data: Buffer): Promise<void>;

    async write(data: Buffer): Promise<void> {
        return new Promise((resolve, reject) => this.#socket.write(data, (err?: Error) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        }));
    }

    disableEncryption(): void {
        this.#encryption = undefined;
    }

    enableEncryption(readKey: Buffer, writeKey: Buffer): void {
        this.#encryption = new BaseSocketEncryption(readKey, writeKey);
    }

    #onClose(): void {
        this.#connected = false;
        this.#responder.reject(new Error('Connection closed'));
        this.debug(styleText('red', 'Connection closed!'));
    }

    #onConnect(): void {
        this.#responder.resolve();
        this.debug(styleText('green', `Connected to ${this.#socket.remoteAddress}:${this.#socket.remotePort}!`));
    }

    async #onData(data: Buffer): Promise<void> {
        this.debug('Received data', data);

        if (this.encrypted) {
            data = await this.#encryption.decrypt(data);
        }

        await this.read(data);
    }

    #onEnd(): void {
        this.debug('Connection ended.');
    }

    #onError(err: Error): void {
        this.#responder.reject(err);
        this.error('Socket error', err);
    }

    #onLookup(err: Error, address: string, family: string, host: string): void {
        this.debug('Lookup error', err, address, family, host);
    }

    #onReady(): void {
        this.debug('Socket is ready.');
    }

    #onTimeout(): void {
        this.debug('Socket timed out.');
    }

    debug(...data: any[]): void {
        console.debug(styleText('magenta', `[${this.constructor.name}]`), ...data);
    }

    error(...data: any[]): void {
        console.error(styleText('magenta', `[${this.constructor.name}]`), ...data);
    }

    log(...data: any[]): void {
        console.log(styleText('magenta', `[${this.constructor.name}]`), ...data);
    }

    warn(...data: any[]): void {
        console.warn(styleText('magenta', `[${this.constructor.name}]`), ...data);
    }
}

export class BaseReadSocket extends BaseSocket {
    #requestInFlight = false;
    readonly #responder: Responder;
    #sequence = 0;

    constructor(device: BaseDevice) {
        super(device);

        this.#responder = new Responder();
    }

    async read(data: Buffer): Promise<void> {
        const boundary = data.indexOf('\r\n\r\n');

        if (boundary === -1) {
            return;
        }

        const rawHeader = data.subarray(0, boundary).toString('utf8');
        const rawHeaders = rawHeader.split('\r\n');

        const statusLine = rawHeaders[0];
        const statusMatch = statusLine.match(/(HTTP|RTSP)\/[\d.]+\s+(\d+)\s+(.+)/);

        const status = parseInt(statusMatch[2]);
        const statusText = statusMatch[3];

        const headers: Record<string, string> = {};
        for (let i = 1; i < rawHeaders.length; i++) {
            const colonIndex = rawHeaders[i].indexOf(':');

            if (colonIndex > 0) {
                const key = rawHeaders[i].substring(0, colonIndex).trim();
                headers[key] = rawHeaders[i].substring(colonIndex + 1).trim();
            }
        }

        let contentLength = 0;
        if (headers['Content-Length']) {
            contentLength = parseInt(headers['Content-Length'], 10);

            if (isNaN(contentLength)) {
                contentLength = 0;
            }
        }

        const totalResponseLength = boundary + 4 + contentLength;
        const bodyBuffer = data.subarray(boundary + 4, totalResponseLength);

        const response = new Response(bodyBuffer, {
            status,
            statusText,
            headers: new Headers(headers)
        });

        console.debug(styleText('cyan', '⬅'), response.status, response.statusText);

        this.#responder.resolve(response);
    }

    async request(method: Method, path: string, body?: Uint8Array | string, headers: Record<string, string> = {}): Promise<Response> {
        if (!this.connected) {
            throw new Error('Not connected!');
        }

        if (this.#requestInFlight) {
            throw new Error('Another request is already in flight!');
        }

        this.#requestInFlight = true;

        let data: Buffer;

        if (body) {
            headers['Content-Length'] = Buffer.byteLength(body).toString();

            data = Buffer.concat([
                this.#headers(method, path, headers),
                Buffer.from(body)
            ]);
        } else {
            headers['Content-Length'] = '0';

            data = this.#headers(method, path, headers);
        }

        this.debug(styleText('cyanBright', '⮕'), method, path /*data.toString('hex')*/);

        return new Promise(async (resolve, reject) => {
            let timer: any;

            this.#responder.use(
                (response: Response) => {
                    this.#requestInFlight = false;
                    resolve(response);
                    clearTimeout(timer);
                },
                (reason) => {
                    this.#requestInFlight = false;
                    reject(reason);
                    clearTimeout(timer);
                }
            );

            timer = setTimeout(() => reject(new Error('Request timed out.')), HTTP_TIMEOUT);

            await this.write(data);
        });
    }

    #headers(method: Method, path: string, headers: Record<string, string>): Buffer {
        headers['Connection'] = 'keep-alive';
        headers['CSeq'] = (this.#sequence++).toString();
        headers['User-Agent'] = 'AirPlay/320.20';

        const lines: string[] = [];
        lines.push(`${method} ${path} RTSP/1.0`);
        Object.entries(headers).forEach(([key, value]) => lines.push(`${key}: ${value}`));
        lines.push('');
        lines.push('');

        return Buffer.from(lines.join('\r\n'));
    }
}

class BaseWriteSocket extends BaseSocket {

    // async respond(status: number, statusText: string, body?: Buffer, headers: Record<string, string> = {}): Promise<void> {
    //     if (body) {
    //         headers['Content-Length'] = Buffer.byteLength(body).toString();
    //
    //         await this.send(Buffer.concat([
    //             this.#headersRaw(`RTSP/1.0 ${status} ${statusText}`, headers),
    //             body
    //         ]));
    //     } else {
    //         await this.send(this.#headersRaw(`RTSP/1.0 ${status} ${statusText}`, headers));
    //     }
    // }

}

class BaseSocketEncryption {
    readonly #readKey: Buffer;
    readonly #writeKey: Buffer;
    #readCounter = 0;
    #writeCounter = 0;

    constructor(readKey: Buffer, writeKey: Buffer) {
        this.#readKey = readKey;
        this.#writeKey = writeKey;
    }

    async decrypt(data: Buffer): Promise<Buffer> {
    }

    async encrypt(data: Buffer): Promise<Buffer> {
    }
}
