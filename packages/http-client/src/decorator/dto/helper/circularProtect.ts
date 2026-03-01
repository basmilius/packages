import { ENABLE_CIRCULAR_LOGGING } from '../const';
import type DtoInstance from '../instance';

type CircularMap = WeakMap<DtoInstance<unknown>, (string | symbol)[]>;
const CIRCULAR_MAP = Symbol();

export default function <T extends (...args: any[]) => unknown>(fn: T, arg1: number = 0, arg2?: number): T {
    return function (...args: any[]): unknown {
        const map: CircularMap = fn[CIRCULAR_MAP] ??= new WeakMap();
        const primary = args[arg1];
        const secondary = arg2 !== undefined ? args[arg2] : 'self';

        if (typeof primary !== 'object' || primary === null) {
            return fn.call(this, ...args);
        }

        if (!map.has(primary)) {
            map.set(primary, []);
        }

        const visited = map.get(primary)!;

        if (visited.includes(secondary)) {
            ENABLE_CIRCULAR_LOGGING && console.log('%c@dto %ccircular protect %cdetected a circular reference', 'color: #0891b2', 'color: #059669', 'color: #1d4ed8', {fn, primary, secondary});
            return;
        }

        visited.push(secondary);

        try {
            return fn.call(this, ...args);
        } finally {
            const index = visited.lastIndexOf(secondary);

            if (index !== -1) {
                visited.splice(index, 1);
            }

            if (visited.length === 0) {
                map.delete(primary);
            }
        }
    } as T;
}
