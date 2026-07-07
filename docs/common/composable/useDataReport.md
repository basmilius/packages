---
outline: deep
---

# useDataReport

Wire up a single filtered data object — a *report* — backed by a `BaseResponse<T>` from [`@basmilius/http-client`](/http-client/). It is the sibling of [`useDataTable`](/common/composable/useDataTable), minus everything that only makes sense for a paginated collection (pagination and sorting). It bakes in search (debounced) and filters, combining [`useLoaded`](/common/composable/useLoaded) and [`useDebouncedRef`](/common/composable/useDebouncedRef). The fetcher re-runs whenever the search, filters or one of the supplied dependencies changes.

## Importing

```ts
import { useDataReport } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useDataReport, useService } from '@basmilius/common';
    import { SalesService, type SalesSummary } from '@/services/SalesService';

    type SalesFilters = {
        period: string;
    };

    const sales = useService(SalesService);

    const {
        data,
        displayEmpty,
        isLoading,
        search,
        filters
    } = useDataReport<SalesSummary, SalesFilters>({
        filters: {period: 'month'},
        isEmpty: summary => summary.rows.length === 0,
        fetcher: query => sales.summary(query)
    });
</script>

<template>
    <input v-model="search" placeholder="Search…">
    <select v-model="filters.period">
        <option value="week">This week</option>
        <option value="month">This month</option>
        <option value="year">This year</option>
    </select>

    <template v-if="data && !displayEmpty">
        <p>Total: {{ data.total }}</p>
    </template>
    <p v-else-if="displayEmpty">No data for this period.</p>
</template>
```

The fetcher receives a single `query` object with the debounced `search` and the current `filters`. Map those onto your API however you like — `useDataReport` stays agnostic about how filters are serialized. Returning `false` skips the update — useful when a request was cancelled or aborted upstream. Throwing an [`UnresolvedDependencyException`](/common/error/) silently swallows the call, which pairs nicely with [`unrefAll`](/common/util/unrefAll).

Rapid filter or search changes can resolve out of order; a slow, superseded response is dropped instead of overwriting a newer one, so `data` always reflects the latest query.

`data` holds the latest response body (or `null` before the first load). Pass `isEmpty` to derive `displayEmpty` from that body after every load — unlike `useDataTable` (whose table renders its own empty slot), a report has to reflect the current emptiness on each fetch, so filtering down to an empty result shows the empty state too.

When the fetcher throws, the error is captured in the `error` ref instead of being re-thrown, so you can react to it in the template without wrapping the fetcher yourself. It is reset to `null` at the start of every fetch. Control-flow exceptions are excluded: `UnresolvedDependencyException` is still swallowed, and `ForbiddenException`, `UnauthorizedException` and `HandledException` (thrown by [`guarded`](/common/util/guarded)) are re-thrown so your global error handler keeps catching them. Because `error` is typed as `unknown`, narrow it with a type guard such as [`isRequestError`](/http-client/) before reading its fields:

```ts
import { isRequestError } from '@basmilius/http-client';

const {error, data} = useDataReport({fetcher});

watch(error, err => {
    if (isRequestError(err)) {
        console.error(err.errorDescription);
    }
});
```

`search` and `filters` are plain refs you mutate directly. Changing either re-fetches. The `filters` ref is deep-watched, so both `filters.value.period = 'year'` and `filters.value = {...}` work.

Pass a `dependencies` array of additional reactive sources to trigger a re-fetch when they change.

```ts
const tenant = ref(1);
useDataReport({fetcher, dependencies: [tenant]});
```

## Preloading

Use `preload` to run asynchronous setup once before the very first fetch. While it is pending the report stays in its loading state and every fetch is held back, so seeding an initial filter through the provided `filters` ref results in a single load instead of a throwaway fetch followed by a filtered one. The callback may be synchronous or return a promise; both a synchronous throw and a rejected promise are swallowed, after which the first fetch runs regardless.

```ts
useDataReport<SalesSummary, SalesFilters>({
    fetcher: query => sales.summary(query),
    preload: async ({filters}) => {
        const {period} = await sales.defaultFilters();
        filters.value.period = period;
    }
});
```

Seed `filters` (deep-watched) rather than `search` here: mutating `search` is debounced, so it would still trigger an extra fetch shortly after the initial load.

## Options

| Option             | Type                                | Description                                                  |
| ------------------ | ----------------------------------- | ------------------------------------------------------------ |
| `fetcher`          | `DataReportFetcher<TData, TFilter>` | Required. Receives a `DataReportQuery` and returns the report |
| `filters`          | `TFilter`                           | Initial filter state                                        |
| `isEmpty`          | `(data: TData) => boolean`          | Derives `displayEmpty` from the response body after each load |
| `search`           | `string`                            | Initial search term                                         |
| `searchDebounceMs` | `number`                            | Debounce for the search ref (default `300`)                 |
| `preload`          | `DataReportPreload<TFilter>`        | Runs once before the first fetch; holds back fetching while pending |
| `dependencies`     | `MultiWatchSources`                 | Extra reactive sources that trigger a re-fetch              |

## Returned bindings

| Property       | Type                   | Description                                                  |
| -------------- | ---------------------- | ------------------------------------------------------------ |
| `data`         | `Ref<TData \| null>`   | Latest response body, or `null` before the first load        |
| `displayEmpty` | `Ref<boolean>`         | `true` when the last load was empty per `isEmpty`            |
| `error`        | `Ref<unknown>`         | Last fetch error (e.g. a `RequestError`), or `null`; control-flow exceptions are re-thrown |
| `isLoading`    | `ComputedRef<boolean>` | Loading flag; also `true` while `preload` is pending          |
| `filters`      | `Ref<TFilter>`         | Filter state; mutate directly (deep-watched)                 |
| `search`       | `Ref<string>`          | Search term; bind to an input, debounced internally          |
| `reload()`     | `() => Promise<void>`  | Re-runs the fetcher with the current query                   |

## Type signature

```ts
type DataReportQuery<TFilter> = {
    readonly filters: TFilter;
    readonly search: string;
};

type DataReportFetcher<TData, TFilter> = (query: DataReportQuery<TFilter>) => Promise<BaseResponse<TData> | false>;

type DataReportPreloadContext<TFilter> = {
    readonly filters: Ref<TFilter>;
    readonly search: Ref<string>;
};

type DataReportPreload<TFilter> = (context: DataReportPreloadContext<TFilter>) => void | Promise<void>;

declare function useDataReport<TData, TFilter = Record<string, unknown>>(
    options: UseDataReportOptions<TData, TFilter>
): UseDataReport<TData, TFilter>;
```

## See also

- [`useDataTable`](/common/composable/useDataTable)
- [`useLoaded`](/common/composable/useLoaded)
- [`useDebouncedRef`](/common/composable/useDebouncedRef)
- [`useService`](/common/composable/useService)
- [`UnresolvedDependencyException`](/common/error/)
