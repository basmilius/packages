import { Socket } from 'node:net';
import type BaseDevice from './device';

type HeadersInit = Record<string, string>;
type Method = 'GET' | 'OPTIONS' | 'POST' | 'PUT' | 'GET_PARAMETER' | 'SET_PARAMETER' | 'ANNOUNCE' | 'RECORD' | 'SETUP' | 'TEARDOWN';

export default class BaseHttpClient {
    readonly #device: BaseDevice;
    #connected = false;
    #reject?: (reason?: any) => void;
    #resolve?: (value: Response) => void;
    #seq: number = 0;
    #socket?: Socket;

    #bufferedData: Buffer = Buffer.alloc(0);
    #requestInFlight = false;

    constructor(device: BaseDevice) {
        this.#device = device;
    }

    async connect(): Promise<void> {
        this.#socket = new Socket();

        this.#socket.on('close', this.#onClose.bind(this));
        this.#socket.on('data', this.#onData.bind(this));
        this.#socket.on('error', this.#onError.bind(this));

        return new Promise((resolve, reject) => {
            this.#reject = reject;

            this.#socket!.connect(this.#device.port, this.#device.host, () => {
                this.#connected = true;
                resolve();
            });
        });
    }

    async readRaw(data: Buffer): Promise<Buffer> {
        return data;
    }

    async write(method: Method, path: string, body: Uint8Array | string | null = null, headers: HeadersInit = {}): Promise<Response> {
        if (!this.#connected || !this.#socket) {
            throw new Error('Not connected!');
        }

        if (this.#requestInFlight) {
            throw new Error('Another request is already in flight');
        }

        this.#requestInFlight = true;

        let data: Buffer;

        if (body) {
            if (typeof body === 'string') {
                headers['Content-Length'] = Buffer.byteLength(body).toString();
            } else if (body instanceof Uint8Array) {
                headers['Content-Length'] = Buffer.byteLength(body).toString();
            } else {
                throw new Error('Body must be string or Uint8Array or null');
            }

            data = Buffer.concat([
                Buffer.from(await this.#encodeHeaders(method, path, headers)),
                Buffer.from(body)
            ]);
        } else {
            headers['Content-Length'] = '0';

            data = Buffer.from(await this.#encodeHeaders(method, path, headers));
        }

        console.debug(method, path, data.toString('hex'));

        return await this.writeRaw(data);
    }

    async writeRaw(data: Buffer): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            let timer: any;

            this.#reject = (reason) => {
                this.#requestInFlight = false;
                reject(reason);
                clearTimeout(timer);
            };

            this.#resolve = (response) => {
                this.#requestInFlight = false;
                resolve(response);
                clearTimeout(timer);
            };

            timer = setTimeout(() => reject(new Error('Request timed out')), 3000);

            this.#socket.write(data);
        });
    }

    async #encodeHeaders(method: Method, path: string, headers: HeadersInit): Promise<string> {
        if (!this.#connected || !this.#socket) {
            throw new Error('Not connected!');
        }

        const lines = [];
        lines.push(`${method} ${path} HTTP/1.1`);
        // lines.push(`Host: ${this.#device.host}:${this.#device.port}`);
        lines.push('Connection: keep-alive');
        // lines.push(`CSeq: ${this.#seq++}`);
        lines.push('User-Agent: AirPlay/320.20');

        for (const [key, value] of Object.entries(headers)) {
            lines.push(`${key}: ${value}`);
        }

        lines.push('');
        lines.push('');

        return lines.join('\r\n');
    }

    #onClose(): void {
        this.#connected = false;

        this.#reject?.(new Error('Connection closed'));
        this.#reject = undefined;
        this.#resolve = undefined;

        console.debug('Connection closed');
    }

    async #onData(data: Buffer): Promise<void> {
        // console.debug('received data', data);

        this.#bufferedData = Buffer.concat([this.#bufferedData, data]);
        this.#bufferedData = await this.readRaw(this.#bufferedData);

        while (true) {
            const headerEndIndex = this.#bufferedData.indexOf('\r\n\r\n');
            if (headerEndIndex === -1) {
                return;
            }

            const headerPart = this.#bufferedData.subarray(0, headerEndIndex).toString('utf8');
            const lines = headerPart.split('\r\n');
            const statusLine = lines[0];
            const statusMatch = statusLine.match(/(HTTP|RTSP)\/[\d.]+\s+(\d+)\s+(.+)/);
            if (!statusMatch) {
                this.#reject?.(new Error('Invalid HTTP status line'));
                this.#reject = undefined;
                this.#resolve = undefined;
                return;
            }

            const status = parseInt(statusMatch[2]);
            const statusText = statusMatch[3];

            const headers: Record<string, string> = {};
            for (let i = 1; i < lines.length; i++) {
                const colonIndex = lines[i].indexOf(':');

                if (colonIndex > 0) {
                    const key = lines[i].substring(0, colonIndex).trim();
                    headers[key] = lines[i].substring(colonIndex + 1).trim();
                }
            }

            let contentLength = 0;
            if (headers['Content-Length']) {
                contentLength = parseInt(headers['Content-Length'], 10);

                if (isNaN(contentLength)) {
                    contentLength = 0;
                }
            }

            const totalResponseLength = headerEndIndex + 4 + contentLength;

            if (this.#bufferedData.length < totalResponseLength) {
                return;
            }

            const bodyBuffer = this.#bufferedData.subarray(headerEndIndex + 4, totalResponseLength);

            this.#bufferedData = this.#bufferedData.subarray(totalResponseLength);

            const response = new Response(bodyBuffer, {
                status,
                statusText,
                headers: new Headers(headers)
            });

            console.debug(response.status, response.statusText);

            this.#resolve?.(response);

            this.#reject = undefined;
            this.#resolve = undefined;

            if (this.#bufferedData.length === 0) {
                break;
            }
        }
    }

    #onError(err: Error): void {
        this.#reject?.(err);
        this.#reject = undefined;
        this.#resolve = undefined;

        console.error(err);
    }
}
