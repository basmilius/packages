import type { Ref } from 'vue';
import persistentRef from './persistentRef';

export default function (key: string, defaultValue: string | null): Ref<string | null> {
    return persistentRef(key, defaultValue, value => value ?? '', value => value === '' ? null : value);
}
