import { useDebouncedRef } from '@flux-ui/internals';
import { computed, type ComputedRef, ref, unref, watch } from 'vue';

export default function (debounce: number = 0, initial: boolean = false): UseLoaded {
    const first = ref(initial);
    const tasks = ref(0);

    const isLoading = computed(() => unref(first) || unref(tasks) > 0);

    function loaded<T extends Function>(fn: T): T {
        return (async (...args: any[]) => {
            tasks.value++;

            return await fn(...args)
                .finally(() => tasks.value--);
        }) as unknown as T;
    }

    const isLoadingDebounced = useDebouncedRef(isLoading, debounce) as unknown as ComputedRef<boolean>;

    watch(tasks, () => {
        if (!unref(first)) {
            return;
        }

        first.value = false;
    });

    return {
        isLoading: isLoadingDebounced,
        loaded
    };
}

type UseLoaded = {
    readonly isLoading: ComputedRef<boolean>;
    loaded<T extends Function>(fn: T): T;
};
