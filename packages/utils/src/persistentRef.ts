import type { Ref } from 'vue';
import { ref, watch } from 'vue';

type Deserializer<T> = (value: string) => T;
type Serializer<T> = (value: T) => string;

export default function <T>(key: string, defaultValue: T, serialize: Serializer<T> = JSON.stringify, deserialize: Deserializer<T> = JSON.parse): Ref<T | null> {
    const storedValue = localStorage.getItem(key);
    const initialValue = storedValue ? deserialize(storedValue) : defaultValue;

    const persistentRef: Ref<T | null> = ref<T>(initialValue) as Ref<T | null>;

    watch(persistentRef, value => {
        if (value === null || value === undefined) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, serialize(value));
        }
    }, {deep: true, immediate: true});

    return persistentRef;
}
