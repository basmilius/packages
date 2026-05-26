import { markDtoDirty, trackDto, triggerDto } from './helper';
import { PARENT, PARENT_KEY, PROXY } from './symbols';
import type { ProxiedArray, ProxiedDto } from './types';

export default {
    /**
     * Trap for when a property is deleted from the target. This
     * will mark the parent dto as dirty and trigger an update.
     */
    deleteProperty(target: ProxiedArray, key: string | symbol): boolean {
        Reflect.deleteProperty(target, key);

        if (ignored(target, key)) {
            return true;
        }

        const dto = target[PARENT] as ProxiedDto;
        dto && triggerDto(dto, target[PARENT_KEY]!, dto[target[PARENT_KEY]!]);
        dto && markDtoDirty(dto, target[PARENT_KEY]);

        return true;
    },

    /**
     * Trap for when a property of the target is being accessed. The
     * property access is being tracked for further updates.
     */
    get(target: ProxiedArray, key: string | symbol, receiver: any): unknown {
        if (key === PROXY) {
            return true;
        }

        if (ignored(target, key)) {
            return Reflect.get(target, key, receiver);
        }

        const dto = target[PARENT] as ProxiedDto;
        dto && trackDto(dto, target[PARENT_KEY]!);

        return Reflect.get(target, key);
    },

    /**
     * Trap for when a property of the target is being updated. This
     * will mark the parent dto as dirty and trigger an update.
     */
    set(target: ProxiedArray, key: string | symbol, value: unknown, receiver: any) {
        if (ignored(target, key)) {
            return Reflect.set(target, key, value, receiver);
        }

        const dto = target[PARENT] as ProxiedDto;
        dto && triggerDto(dto, target[PARENT_KEY]!, dto[target[PARENT_KEY]!]);
        dto && markDtoDirty(dto, target[PARENT_KEY]);

        return Reflect.set(target, key, value);
    }
} satisfies ProxyHandler<unknown[]> as ProxyHandler<unknown[]>;

/**
 * Checks if the proxy should ignore the given key.
 */
function ignored(target: unknown[], key: string | symbol): key is symbol {
    return typeof key === 'symbol' || typeof target[key as any] === 'function' || key === 'length';
}
