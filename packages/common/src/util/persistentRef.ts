import { ref, type Ref, watch } from 'vue';

type Deserializer<T> = (value: string) => T;
type Serializer<T> = (value: T) => string;

export default function <T>(key: string, defaultValue: T, serialize: Serializer<T> = JSON.stringify, deserialize: Deserializer<T> = JSON.parse): Ref<T | null> {
    const storedValue = localStorage.getItem(key);
    let initialValue: T | null = defaultValue;

    if (storedValue) {
        try {
            initialValue = deserialize(storedValue);
        } catch {
            localStorage.removeItem(key);
        }
    }

    const persistentRef: Ref<T | null> = ref<T>(initialValue) as Ref<T | null>;

    watch(persistentRef, value => {
        if (value === null || value === undefined) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, serialize(value));
        }
    }, {deep: true});

    return persistentRef;
}
