import { BaseResponse } from '@basmilius/http-client';
import { computed, type ComputedRef, type MultiWatchSources, ref, type Ref, unref, watch } from 'vue';
import { ForbiddenException, HandledException, UnauthorizedException, UnresolvedDependencyException } from '../error';
import useDebouncedRef from './useDebouncedRef';
import useLoaded from './useLoaded';

const DEFAULT_SEARCH_DEBOUNCE_MS = 300;

export type DataReportQuery<TFilter> = {
    readonly filters: TFilter;
    readonly search: string;
};

export type DataReportFetcher<TData, TFilter> = (query: DataReportQuery<TFilter>) => Promise<BaseResponse<TData> | false>;

export type DataReportPreloadContext<TFilter> = {
    readonly filters: Ref<TFilter>;
    readonly search: Ref<string>;
};

export type DataReportPreload<TFilter> = (context: DataReportPreloadContext<TFilter>) => void | Promise<void>;

export type UseDataReportOptions<TData, TFilter> = {
    readonly dependencies?: MultiWatchSources;
    readonly fetcher: DataReportFetcher<TData, TFilter>;
    readonly filters?: TFilter;
    readonly isEmpty?: (data: TData) => boolean;

    /**
     * Runs once before the very first fetch. While it is pending the report stays in
     * its loading state and every fetch is held back, so setting up an initial filter
     * (through the provided `filters` ref) results in a single load instead of a
     * throwaway fetch followed by a filtered one.
     */
    readonly preload?: DataReportPreload<TFilter>;
    readonly search?: string;
    readonly searchDebounceMs?: number;
};

export type UseDataReport<TData, TFilter> = {
    readonly data: Ref<TData | null>;
    readonly displayEmpty: Ref<boolean>;
    readonly error: Ref<unknown>;
    readonly filters: Ref<TFilter>;
    readonly isLoading: ComputedRef<boolean>;
    readonly search: Ref<string>;

    reload(): Promise<void>;
};

/**
 * Fetches a single filtered data object (a report) and refetches whenever the
 * filters, search or dependencies change. Mirrors {@link useDataTable}, minus
 * everything that only makes sense for a paginated collection (pagination and
 * sorting). Loading is tracked through {@link useLoaded} and errors follow the
 * same global-handler conventions as `useDataTable`.
 */
export default function <TData, TFilter = Record<string, unknown>>(options: UseDataReportOptions<TData, TFilter>): UseDataReport<TData, TFilter> {
    const {
        fetcher,
        isEmpty,
        dependencies = [],
        preload
    } = options;

    const defaults = options.filters ?? ({} as TFilter);

    const {
        isLoading: loadedIsLoading,
        loaded
    } = useLoaded();

    const isPreloading = ref(preload !== undefined);
    const isLoading = computed(() => unref(isPreloading) || unref(loadedIsLoading));

    const data = ref<TData | null>(null) as Ref<TData | null>;
    const displayEmpty = ref(false);
    const error = ref<unknown>(null);

    const search = ref(options.search ?? '');
    const filters = ref({...defaults}) as Ref<TFilter>;

    const debouncedSearch = useDebouncedRef(search, options.searchDebounceMs ?? DEFAULT_SEARCH_DEBOUNCE_MS);

    // note(Bas): monotonic request id so a slow, superseded response can't
    //  overwrite the result of a newer fetch after rapid filter changes.
    let latestRequest = 0;

    async function fetch(): Promise<void> {
        if (unref(isPreloading)) {
            return;
        }

        const request = ++latestRequest;

        error.value = null;

        try {
            const response = await loaded(fetcher)({
                filters: filters.value,
                search: unref(debouncedSearch)
            });

            if (request !== latestRequest || response === false) {
                return;
            }

            data.value = response.data;

            // note(Bas): unlike useDataTable (whose DataTable renders its own empty
            //  slot), a report has to reflect the current emptiness after every load,
            //  so filtering to an empty result shows the empty state too.
            displayEmpty.value = isEmpty?.(response.data) ?? false;
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

    watch([filters, debouncedSearch, ...dependencies], fetch, {deep: true, immediate: true});

    if (preload !== undefined) {
        void Promise.resolve()
            .then(() => preload({filters, search}))
            .catch(() => {})
            .finally(() => {
                isPreloading.value = false;
                void fetch();
            });
    }

    return {
        data,
        displayEmpty,
        error,
        filters,
        isLoading,
        search,

        reload: fetch
    };
}
