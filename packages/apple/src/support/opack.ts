class OPACKDecodeError extends Error {
}

class OPACKEncodeError extends Error {
}

class OPACKDecode {
    #data: Uint8Array;
    #pos: number;

    constructor(data: Uint8Array) {
        this.#data = data;
        this.#pos = 0;
    }

    #readBytes(n: number): Uint8Array {
        if (this.#pos + n > this.#data.length) {
            throw new OPACKDecodeError('Out of bounds read');
        }

        const slice = this.#data.subarray(this.#pos, this.#pos + n);
        this.#pos += n;

        return slice;
    }

    #readUIntBE(n: number): number {
        const bytes = this.#readBytes(n);
        let val = 0;

        for (let i = 0; i < n; i++) {
            val = (val << 8) | bytes[i];
        }

        return val;
    }

    #readUIntLE(n: number): number {
        const bytes = this.#readBytes(n);
        let val = 0;

        for (let i = 0; i < n; i++) {
            val |= bytes[i] << (8 * i);
        }

        return val;
    }

    #parseFloat32(): number {
        const bytes = this.#readBytes(4);
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

        return view.getFloat32(0, false); // big-endian
    }

    #parseFloat64(): number {
        const bytes = this.#readBytes(8);
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

        return view.getFloat64(0, false);
    }

    parse(): any {
        if (this.#pos >= this.#data.length) {
            throw new OPACKDecodeError('No more data to parse');
        }

        const type = this.#readBytes(1)[0];

        // Booleans
        if (type === 0x01) return true;
        if (type === 0x02) return false;

        // Small integer 0..39
        if (type >= 0x08 && type <= 0x2F) {
            return type - 0x08;
        }

        // Int with 1 to 4 bytes (0x30..0x33)
        if (type >= 0x30 && type <= 0x33) {
            const len = type - 0x30 + 1;
            return this.#readUIntBE(len);
        }

        // Short strings length embedded (0x40..0x60)
        if (type >= 0x40 && type <= 0x60) {
            const length = type - 0x40;
            const bytes = this.#readBytes(length);
            return new TextDecoder().decode(bytes);
        }

        // Long string with length encoded (0x61..0x64)
        if (type >= 0x61 && type <= 0x64) {
            const lenBytes = type - 0x60;
            const length = this.#readUIntBE(lenBytes);
            const bytes = this.#readBytes(length);
            return new TextDecoder().decode(bytes);
        }

        // Data with short length embedded (0x70..0x90)
        if (type >= 0x70 && type <= 0x90) {
            const length = type - 0x70;
            return this.#readBytes(length);
        }

        // Data with length encoded (0x91..0x94)
        if (type >= 0x91 && type <= 0x94) {
            const lenBytes = type - 0x90;
            const length = this.#readUIntLE(lenBytes);
            return this.#readBytes(length);
        }

        // Float32 / Float64
        if (type === 0x35) return this.#parseFloat32();
        if (type === 0x36) return this.#parseFloat64();

        // UUID (16 bytes)
        if (type === 0x05) {
            return this.#readBytes(16);
        }

        // Date (4 bytes, placeholder)
        if (type === 0x06) {
            return this.#readBytes(4);
        }

        // Fixed length arrays (0xD0..0xDE)
        if (type >= 0xD0 && type <= 0xDE) {
            const count = type - 0xD0 + 1;
            const arr = [];

            for (let i = 0; i < count; i++) {
                arr.push(this.parse());
            }

            return arr;
        }

        // Endless array (0xDF, ends with 0x03)
        if (type === 0xDF) {
            const arr = [];

            while (true) {
                if (this.#pos >= this.#data.length) {
                    throw new OPACKDecodeError('Unexpected end in endless array');
                }

                if (this.#data[this.#pos] === 0x03) {
                    this.#pos++;
                    break;
                }

                arr.push(this.parse());
            }

            return arr;
        }

        // Fixed length dictionary (0xE0..0xEE)
        if (type >= 0xE0 && type <= 0xEE) {
            const count = type - 0xE0 + 1;
            const obj: Record<string, any> = {};

            for (let i = 0; i < count; i++) {
                if (this.#pos >= this.#data.length) {
                    break;
                }

                const key = this.parse();
                const val = this.parse();
                obj[key] = val;
            }

            return obj;
        }

        // Endless dictionary (0xEF, ends with 0x03)
        if (type === 0xEF) {
            const obj: Record<string, any> = {};
            while (true) {
                if (this.#pos >= this.#data.length) {
                    throw new OPACKDecodeError('Unexpected end in endless dict');
                }

                if (this.#data[this.#pos] === 0x03) {
                    this.#pos++;
                    break;
                }

                const key = this.parse();
                const val = this.parse();
                obj[key] = val;
            }
            return obj;
        }

        // End marker 0x03 (used for endless arrays/dicts)
        if (type === 0x03) {
            throw new OPACKDecodeError('Unexpected end marker outside array/dict');
        }

        throw new OPACKDecodeError(`Unknown type 0x${type.toString(16)}`);
    }
}

class OPACKEncode {
    encode(obj: any): number[] {
        if (obj === true) return [0x01];
        if (obj === false) return [0x02];

        if (typeof obj === 'number') {
            if (!Number.isInteger(obj) || obj < 0) {
                throw new OPACKEncodeError('Only non-negative integers supported');
            }

            // small int 0..39
            if (obj <= 0x27) return [0x08 + obj];

            // int 1..4 bytes
            if (obj < 2 ** 8) return [0x30, obj];

            if (obj < 2 ** 16) return [0x31, (obj >> 8) & 0xff, obj & 0xff];

            if (obj < 2 ** 24)
                return [0x32, (obj >> 16) & 0xff, (obj >> 8) & 0xff, obj & 0xff];

            if (obj < 2 ** 32)
                return [
                    0x33,
                    (obj >> 24) & 0xff,
                    (obj >> 16) & 0xff,
                    (obj >> 8) & 0xff,
                    obj & 0xff
                ];

            throw new OPACKEncodeError('Integer too large (max 32-bit supported)');
        }

        if (typeof obj === 'string') {
            const utf8 = new TextEncoder().encode(obj);
            const len = utf8.length;

            if (len <= 0x20) return [0x40 + len, ...utf8];

            if (len < 2 ** 8) return [0x61, len, ...utf8];

            if (len < 2 ** 16)
                return [0x62, (len >> 8) & 0xff, len & 0xff, ...utf8];

            if (len < 2 ** 24)
                return [
                    0x63,
                    (len >> 16) & 0xff,
                    (len >> 8) & 0xff,
                    len & 0xff,
                    ...utf8
                ];

            if (len < 2 ** 32)
                return [
                    0x64,
                    (len >> 24) & 0xff,
                    (len >> 16) & 0xff,
                    (len >> 8) & 0xff,
                    len & 0xff,
                    ...utf8
                ];

            throw new OPACKEncodeError('String too long');
        }

        if (obj instanceof Uint8Array) {
            const len = obj.length;

            if (len <= 0x20) return [0x70 + len, ...obj];

            if (len < 2 ** 8) return [0x91, len, ...obj];

            if (len < 2 ** 16)
                return [0x92, len & 0xff, (len >> 8) & 0xff, ...obj]; // <-- swapped

            if (len < 2 ** 24)
                return [
                    0x93,
                    len & 0xff,
                    (len >> 8) & 0xff,
                    (len >> 16) & 0xff,
                    ...obj
                ]; // <-- swapped

            if (len < 2 ** 32)
                return [
                    0x94,
                    len & 0xff,
                    (len >> 8) & 0xff,
                    (len >> 16) & 0xff,
                    (len >> 24) & 0xff,
                    ...obj
                ]; // <-- swapped

            throw new OPACKEncodeError('Data too long');
        }

        if (Array.isArray(obj)) {
            const len = obj.length;

            if (len <= 0x0F) {
                // fixed array count
                const out = [0xd0 + len - 1];

                for (const el of obj) {
                    out.push(...this.encode(el));
                }

                return out;
            }

            // endless array
            const out = [0xdf];

            for (const el of obj) {
                out.push(...this.encode(el));
            }

            out.push(0x03);

            return out;
        }

        if (typeof obj === 'object' && obj !== null) {
            const keys = Object.keys(obj);
            const len = keys.length;

            if (len <= 0x0F) {
                // fixed dict count
                const out = [0xe0 + len - 1];

                for (const key of keys) {
                    out.push(...this.encode(key));
                    out.push(...this.encode(obj[key]));
                }

                return out;
            }

            // endless dict
            const out = [0xef];

            for (const key of keys) {
                out.push(...this.encode(key));
                out.push(...this.encode(obj[key]));
            }

            out.push(0x03);

            return out;
        }

        if (obj instanceof Float32Array) {
            throw new OPACKEncodeError('Use number for float encoding');
        }

        if (typeof obj === 'number' && !Number.isInteger(obj)) {
            // float64 (double)
            const buf = new ArrayBuffer(8);

            new DataView(buf).setFloat64(0, obj, false);

            return [0x36, ...new Uint8Array(buf)];
        }

        if (obj instanceof Date) {
            // encode as 4 bytes UNIX timestamp
            const ts = Math.floor(obj.getTime() / 1000);

            return [
                0x06,
                (ts >> 24) & 0xff,
                (ts >> 16) & 0xff,
                (ts >> 8) & 0xff,
                ts & 0xff
            ];
        }

        if (obj instanceof Uint8Array && obj.length === 16) {
            // encode as UUID
            return [0x05, ...obj];
        }

        throw new OPACKEncodeError(`Unsupported type ${typeof obj}`);
    }
}

export function encode(data: any): Uint8Array {
    const encoder = new OPACKEncode();
    return new Uint8Array(encoder.encode(data));
}

export function decode(data: Uint8Array): any {
    const decoder = new OPACKDecode(data);
    return decoder.parse();
}
