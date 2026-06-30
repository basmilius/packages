import { BaseResponse, Paginated } from '@basmilius/http-client';
import { type ComputedRef, type MultiWatchSources, ref, type Ref, unref, watch } from 'vue';
import { ForbiddenException, HandledException, UnauthorizedException, UnresolvedDependencyException } from '../error';
import useDebouncedRef from './useDebouncedRef';
import useLoaded from './useLoaded';
import usePagination from './usePagination';

const DEFAULT_PAGE = 1;
const DEFAULT_SEARCH_DEBOUNCE_MS = 300;

export type DataTableSortDirection = 'asc' | 'desc';

export type DataTableSort = {
    readonly direction: DataTableSortDirection;
    readonly field: string;
};

export type DataTableQuery<TFilter> = {
    readonly filters: TFilter;
    readonly limit: number;
    readonly offset: number;
    readonly search: string;
    readonly sort: DataTableSort | null;
};

export type DataTableFetcher<TItem, TFilter> = (query: DataTableQuery<TFilter>) => Promise<BaseResponse<Paginated<TItem>> | false>;

export type UseDataTableOptions<TItem, TFilter> = {
    readonly dependencies?: MultiWatchSources;
    readonly fetcher: DataTableFetcher<TItem, TFilter>;
    readonly filters?: TFilter;
    readonly perPage?: number;
    readonly search?: string;
    readonly searchDebounceMs?: number;
    readonly sort?: DataTableSort | null;
};

export type UseDataTable<TItem, TFilter> = {
    readonly displayEmpty: Ref<boolean>;
    readonly error: Ref<unknown>;
    readonly filters: Ref<TFilter>;
    readonly isLoading: ComputedRef<boolean>;
    readonly items: Ref<TItem[]>;
    readonly limits: Ref<number[]>;
    readonly page: Ref<number>;
    readonly perPage: Ref<number>;
    readonly search: Ref<string>;
    readonly sort: Ref<DataTableSort | null>;
    readonly total: Ref<number>;

    reload(): Promise<void>;
    setPage(num: number): void;
    setPerPage(num: number): void;
    setSort(sort: DataTableSort | null): void;
    setTotal(num: number): void;
    toggleSort(field: string): void;
};

export default function <TItem, TFilter = Record<string, unknown>>(options: UseDataTableOptions<TItem, TFilter>): UseDataTable<TItem, TFilter> {
    const {
        fetcher,
        dependencies = []
    } = options;

    const defaults = options.filters ?? ({} as TFilter);

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

    if (options.perPage !== undefined) {
        setPerPage(options.perPage);
    }

    const displayEmpty = ref(false);
    const error = ref<unknown>(null);
    const isFirstLoad = ref(true);
    const items = ref<TItem[]>([]) as Ref<TItem[]>;

    const search = ref(options.search ?? '');
    const filters = ref({...defaults}) as Ref<TFilter>;
    const sort = ref(options.sort ?? null) as Ref<DataTableSort | null>;

    const debouncedSearch = useDebouncedRef(search, options.searchDebounceMs ?? DEFAULT_SEARCH_DEBOUNCE_MS);

    async function fetch(): Promise<void> {
        const _page = unref(page);
        const _perPage = unref(perPage);

        error.value = null;

        try {
            const response = await loaded(fetcher)({
                offset: (_page - 1) * _perPage,
                limit: _perPage,
                search: unref(debouncedSearch),
                filters: filters.value,
                sort: sort.value
            });

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

            if (err instanceof ForbiddenException || err instanceof UnauthorizedException || err instanceof HandledException) {
                throw err;
            }

            error.value = err;
        }
    }

    watch([page, perPage, ...dependencies], fetch, {immediate: true});

    watch([debouncedSearch, filters, sort], () => {
        if (page.value !== DEFAULT_PAGE) {
            setPage(DEFAULT_PAGE);
        } else {
            fetch();
        }
    }, {deep: true});

    function setSort(value: DataTableSort | null): void {
        sort.value = value;
    }

    function toggleSort(field: string): void {
        const current = sort.value;

        if (current === null || current.field !== field) {
            sort.value = {field, direction: 'asc'};
        } else if (current.direction === 'asc') {
            sort.value = {field, direction: 'desc'};
        } else {
            sort.value = null;
        }
    }

    return {
        displayEmpty,
        error,
        filters,
        isLoading,
        items,
        limits,
        page,
        perPage,
        search,
        sort,
        total,

        reload: fetch,
        setPage,
        setPerPage,
        setSort,
        setTotal,
        toggleSort
    };
}
