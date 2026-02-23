import guarded from './guarded';

export default function <T extends Function>(onError: (err: Error) => void): T {
    return ((fn: T) => guarded(fn, onError)) as unknown as T;
}
