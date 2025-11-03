import type { Request } from '@/base/http';
import { hkdf, parseBinaryPlist } from '@/support';
import type AirPlayDevice from './device';
import AirPlayHttpClient from './http';
import * as buffer from 'node:buffer';

export default class AirPlayEventStream extends AirPlayHttpClient {
    constructor(device: AirPlayDevice) {
        super(device);
    }

    async setup(sharedSecret: Buffer): Promise<void> {
        const readKey = hkdf({
            hash: 'sha512',
            key: sharedSecret,
            length: 32,
            salt: Buffer.from('Events-Salt'),
            info: Buffer.from('Events-Read-Encryption-Key')
        });

        const writeKey = hkdf({
            hash: 'sha512',
            key: sharedSecret,
            length: 32,
            salt: Buffer.from('Events-Salt'),
            info: Buffer.from('Events-Write-Encryption-Key')
        });

        // note: These keys are flipped, because the device is the one sending the data.
        this.enableEncryption(writeKey, readKey);
    }

    async handleAsServer(headerEndIndex: number, rawHeaders: string[]): Promise<Request> {
        const request = await super.handleAsServer(headerEndIndex, rawHeaders);

        if (!request) {
            return request;
        }

        const id = `${request.method} ${request.path}`;

        switch (id) {
            case 'POST /command':
                const buf = new Uint8Array(request.body);

                console.log(parseBinaryPlist(
                    buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
                ));

                const lines = [];
                lines.push(`RTSP/1.0 200 OK`);
                lines.push(`Content-Length: 0`);
                lines.push(`Audio-Latency: 0`);
                request.headers['Server'] && lines.push(`Server: ${request.headers['Server']}`);
                request.headers['CSeq'] && lines.push(`CSeq: ${request.headers['CSeq']}`);
                lines.push(``);
                lines.push(``);

                await this.writeRaw(Buffer.from(lines.join('\r\n')));
                break;

            default:
                console.log('Unhandled request', id, {
                    headers: request.headers,
                    body: request.body.toString()
                });
                break;
        }

        return request;
    }
}

/*
                headers = {
                    "Content-Length": "0",
                    "Audio-Latency": "0",
                }
                if "Server" in request.headers:
                    headers["Server"] = request.headers["Server"]
                if "CSeq" in request.headers:
                    headers["CSeq"] = request.headers["CSeq"]
                self.send(
                    self.format_response(
                        HttpResponse(
                            request.protocol,
                            request.version,
                            200,
                            "OK",
                            headers,
                            b"",
                        )
                    )
                )
 */
