export default function (obj: object, key: symbol | string, value: unknown): void {
    Object.defineProperty(obj, key, {value});
}
