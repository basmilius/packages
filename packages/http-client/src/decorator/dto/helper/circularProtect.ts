import { ENABLE_CIRCULAR_LOGGING } from '../constant';
import type DtoInstance from '../instance';

type CircularMap = WeakMap<DtoInstance<unknown>, (string | symbol)[]>;

/**
 * Symbol used as a property key on protected functions to store their circular reference tracking maps.
 * Each function decorated with circularProtect gets its own WeakMap stored at this symbol key.
 */
const CIRCULAR_MAP = Symbol('circularProtectMap');

/**
 * Protects a function from circular reference issues by tracking visited objects.
 * Properly cleans up the visited tracking after function execution to prevent memory leaks.
 * 
 * @param fn - The function to protect
 * @param arg1 - Index of the primary argument to track (default: 0)
 * @param arg2 - Optional index of secondary argument to track
 * @returns Protected version of the function
 */
export default function <T extends (...args: any[]) => unknown>(fn: T, arg1: number = 0, arg2?: number): T {
    return function (...args: any[]): unknown {
        const map: CircularMap = fn[CIRCULAR_MAP] ??= new WeakMap();
        const primary = args[arg1];
        const secondary = arg2 !== undefined ? args[arg2] : 'self';

        // Fast path: non-object primary argument
        if (typeof primary !== 'object' || primary === null) {
            return fn.call(this, ...args);
        }

        // Initialize tracking for this primary object
        if (!map.has(primary)) {
            map.set(primary, []);
        }

        const visited = map.get(primary)!;

        // Check for circular reference
        if (visited.includes(secondary)) {
            ENABLE_CIRCULAR_LOGGING && console.log(
                '%c@dto %ccircular protect %cdetected a circular reference',
                'color: #0891b2',
                'color: #059669',
                'color: #1d4ed8',
                { fn, primary, secondary }
            );
            return;
        }

        // Mark as visited
        visited.push(secondary);

        try {
            // Execute the protected function
            return fn.call(this, ...args);
        } finally {
            // Always clean up: remove from visited list after execution
            // This prevents memory leaks by allowing the visited array to be garbage collected
            const index = visited.lastIndexOf(secondary);
            if (index !== -1) {
                visited.splice(index, 1);
            }
            
            // If no more items being tracked for this primary, remove the entry entirely
            if (visited.length === 0) {
                map.delete(primary);
            }
        }
    } as T;
}
