import { BaseResponse, Paginated } from '@basmilius/http-client';
import { type ComputedRef, type MultiWatchSources, ref, type Ref, unref, watch } from 'vue';
import { UnresolvedDependencyException } from '../error';
import useLoaded from './useLoaded';
import usePagination from './usePagination';

export default function <T>(fetcher: (offset: number, limit: number) => Promise<BaseResponse<Paginated<T>> | false>, dependencies: MultiWatchSources = []): UseDataTable<T> {
    const {
        isLoading,
        loaded
    } = useLoaded();

    const {
        limits,
        page,
        perPage,
        total,
        setPage,
        setPerPage,
        setTotal
    } = usePagination();

    const displayEmpty = ref(false);
    const isFirstLoad = ref(true);
    const items = ref<T[]>([]) as Ref<T[]>;

    async function fetch(): Promise<void> {
        const _page = unref(page);
        const _perPage = unref(perPage);

        try {
            const response = await loaded(fetcher)((_page - 1) * _perPage, _perPage);

            if (response === false) {
                return;
            }

            if (isFirstLoad.value) {
                isFirstLoad.value = false;

                if (response.data.items.length === 0) {
                    displayEmpty.value = true;
                }
            } else if (response.data.items.length > 0) {
                displayEmpty.value = false;
            }

            items.value = response.data.items;
            setTotal(response.data.total);
        } catch (err) {
            if (err instanceof UnresolvedDependencyException) {
                return;
            }

            throw err;
        }
    }

    watch([page, perPage, ...dependencies], fetch, {immediate: true});

    return {
        displayEmpty,
        isLoading,
        items,
        limits,
        page,
        perPage,
        total,

        reload: fetch,
        setPage,
        setPerPage,
        setTotal
    };
}

type UseDataTable<T> = {
    readonly displayEmpty: Ref<boolean>;
    readonly isLoading: ComputedRef<boolean>;
    readonly items: Ref<T[]>;
    readonly limits: Ref<number[]>;
    readonly page: Ref<number>;
    readonly perPage: Ref<number>;
    readonly total: Ref<number>;

    reload(): Promise<void>;
    setPage(num: number): void;
    setPerPage(num: number): void;
    setTotal(num: number): void;
};
