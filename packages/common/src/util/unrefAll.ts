import { type Ref, unref } from 'vue';
import { UnresolvedDependencyException } from '../error';

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
        throw new UnresolvedDependencyException();
    }

    return dep;
}
