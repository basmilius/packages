import { ref, type Ref, watch } from 'vue';

export type UseRememberedOptions<T> = {
    readonly prefix?: string;
    deserialize?(value: string): T;
    serialize?(value: T): string;
};

export default function <T>(key: string, initialValue: T, options: UseRememberedOptions<T> = {}): Ref<T> {
    if (typeof localStorage === 'undefined') {
        return ref(initialValue) as Ref<T>;
    }

    const {prefix = '', deserialize = JSON.parse, serialize = JSON.stringify} = options;
    const storageKey = `${prefix}${key}`;

    function read(): T | null {
        try {
            const storedValue = localStorage.getItem(storageKey);

            return storedValue === null ? null : deserialize(storedValue);
        } catch {
            return null;
        }
    }

    const value = ref<T>(read() ?? initialValue) as Ref<T>;

    watch(value, value => {
        try {
            localStorage.setItem(storageKey, serialize(value));
        } catch {
            // Storage can be unavailable or full (e.g. private browsing); remembering is best-effort.
        }
    });

    return value;
}
