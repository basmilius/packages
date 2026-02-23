import { type Ref, unref } from 'vue';

type UnrefAll<T extends readonly unknown[]> = {
    [K in keyof T]: T[K] extends Ref<infer U> ? NonNullable<U> : T[K];
};

export default function <T extends readonly unknown[]>(...deps: T): UnrefAll<T> {
    return deps
        .map(unref)
        .map(ensure) as UnrefAll<T>;
}

function ensure<T>(dep: T): T {
    if (!dep) {
        throw new Error('Dep is null or undefined.');
    }

    return dep;
}
