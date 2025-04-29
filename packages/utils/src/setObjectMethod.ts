export default function (obj: Function, key: string, fn: Function): void {
    obj.prototype[key] = fn;
}
