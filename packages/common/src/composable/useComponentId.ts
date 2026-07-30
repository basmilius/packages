import { computed, type ComputedRef, getCurrentInstance } from 'vue';

/**
 * @deprecated Use Vue's own `useId()` instead. This returns the internal
 * instance uid, which is not stable between a server render and its hydration.
 */
export default function (): ComputedRef<number> {
    const instance = getCurrentInstance();

    return computed(() => instance?.uid ?? (instance?.proxy as any)._uid ?? 0);
}
