import type { ComputedRef } from 'vue';
import useLoaded from './useLoaded';

export default function <T extends ((...args: any[]) => Promise<any>)>(fn: T): [T, ComputedRef<boolean>] {
    const {isLoading, loaded} = useLoaded();

    const action = loaded(fn);

    return [
        action,
        isLoading
    ];
};
