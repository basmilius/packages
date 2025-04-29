import { defineStore, StoreGeneric, storeToRefs } from 'pinia';

export default function <Id extends string, Setup extends (...args: any[]) => any, Context = ReturnType<Setup>>(id: Id, setup: Setup): UseStore<Context> {
    const storeFn = defineStore(id, setup);

    return () => {
        const store = storeFn();
        const keys = Object.getOwnPropertyNames(store);
        const refs = storeToRefs(store as StoreGeneric);
        const result: Record<string, unknown> = {};

        for (const key of keys) {
            if (key.startsWith('$') || key.startsWith('_')) {
                continue;
            }

            if (key in refs) {
                result[key] = refs[key];
                continue;
            }

            result[key] = store[key];
        }

        return result as Context;
    };
}

type UseStore<R> = {
    (): R;
}
