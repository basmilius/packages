export default function <T extends Function>(before: () => void): T {
    return ((fn: T) => {
        return (...args: any[]) => {
            before();
            return fn(...args);
        };
    }) as unknown as T;
}
