---
outline: deep
---

# useDataTable

Wire up a paginated data table backed by a `BaseResponse<Paginated<T>>` from [`@basmilius/http-client`](/http-client/). It bakes in pagination, search (debounced), filters and single-column sorting, combining [`useLoaded`](/common/composable/useLoaded), [`usePagination`](/common/composable/usePagination) and [`useDebouncedRef`](/common/composable/useDebouncedRef). The fetcher re-runs whenever the page, page size, search, filters, sorting or one of the supplied dependencies changes.

## Importing

```ts
import { useDataTable } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useDataTable, useService } from '@basmilius/common';
    import { OrderService, type Order } from '@/services/OrderService';

    type OrderFilters = {
        status: string | null;
    };

    const orders = useService(OrderService);

    const {
        displayEmpty,
        isLoading,
        items,
        page,
        perPage,
        total,
        search,
        filters,
        sort,
        setPage,
        setPerPage,
        toggleSort
    } = useDataTable<Order, OrderFilters>({
        filters: {status: null},
        sort: {field: 'createdAt', direction: 'desc'},
        fetcher: query => orders.list(query)
    });
</script>

<template>
    <input v-model="search" placeholder="Search…">
    <select v-model="filters.status">
        <option :value="null">All</option>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
    </select>

    <table v-if="!displayEmpty">
        <thead>
            <th @click="toggleSort('reference')">Reference</th>
        </thead>
        <tr v-for="order in items" :key="order.id">
            <td>{{ order.reference }}</td>
        </tr>
    </table>
    <p v-else>No orders found.</p>
</template>
```

The fetcher receives a single `query` object with the calculated `offset`, the active `limit`, the debounced `search`, the current `filters` and the active `sort`. Map those onto your API however you like — `useDataTable` stays agnostic about how filters or sorting are serialized. Returning `false` skips the update — useful when a request was cancelled or aborted upstream. Throwing an [`UnresolvedDependencyException`](/common/error/) silently swallows the call, which pairs nicely with [`unrefAll`](/common/util/unrefAll).

When the fetcher throws, the error is captured in the `error` ref instead of being re-thrown, so you can react to it in the template without wrapping the fetcher yourself. It is reset to `null` at the start of every fetch. Control-flow exceptions are excluded: `UnresolvedDependencyException` is still swallowed, and `ForbiddenException`, `UnauthorizedException` and `HandledException` (thrown by [`guarded`](/common/util/guarded)) are re-thrown so your global error handler keeps catching them. Because `error` is typed as `unknown`, narrow it with a type guard such as [`isRequestError`](/http-client/) before reading its fields:

```ts
import { isRequestError } from '@basmilius/http-client';

const {error, items} = useDataTable({fetcher});

watch(error, err => {
    if (isRequestError(err)) {
        console.error(err.errorDescription);
    }
});
```

`search`, `filters` and `sort` are plain refs you mutate directly. Changing any of them resets the page back to one and re-fetches. The `filters` ref is deep-watched, so both `filters.value.status = 'open'` and `filters.value = {...}` work. For column headers, `toggleSort(field)` cycles that column through `asc → desc → none`, while `setSort` sets it imperatively.

Pass a `dependencies` array of additional reactive sources to trigger a re-fetch when they change.

```ts
const tenant = ref(1);
useDataTable({fetcher, dependencies: [tenant]});
```

## Options

| Option             | Type                              | Description                                                  |
| ------------------ | --------------------------------- | ------------------------------------------------------------ |
| `fetcher`          | `DataTableFetcher<TItem, TFilter>` | Required. Receives a `DataTableQuery` and returns the page   |
| `filters`          | `TFilter`                         | Initial filter state                                         |
| `sort`             | `DataTableSort \| null`           | Initial sorting                                              |
| `search`           | `string`                          | Initial search term                                          |
| `searchDebounceMs` | `number`                          | Debounce for the search ref (default `300`)                  |
| `perPage`          | `number`                          | Initial page size (default `25` from `usePagination`)        |
| `dependencies`     | `MultiWatchSources`               | Extra reactive sources that trigger a re-fetch               |

## Returned bindings

| Property          | Type                            | Description                                          |
| ----------------- | ------------------------------- | ---------------------------------------------------- |
| `displayEmpty`    | `Ref<boolean>`                  | `true` when the first load returned no items         |
| `error`           | `Ref<unknown>`                  | Last fetch error (e.g. a `RequestError`), or `null`; control-flow exceptions are re-thrown |
| `isLoading`       | `ComputedRef<boolean>`          | Loading flag from [`useLoaded`](/common/composable/useLoaded) |
| `items`           | `Ref<TItem[]>`                  | Latest page of items                                 |
| `limits`          | `Ref<number[]>`                 | Available page-size options (5, 10, 25, 50, 100)     |
| `page`            | `Ref<number>`                   | One-based current page                               |
| `perPage`         | `Ref<number>`                   | Active page size                                     |
| `total`           | `Ref<number>`                   | Total item count from the latest response            |
| `search`          | `Ref<string>`                   | Search term; bind to an input, debounced internally  |
| `filters`         | `Ref<TFilter>`                  | Filter state; mutate directly (deep-watched)         |
| `sort`            | `Ref<DataTableSort \| null>`    | Active sorting                                       |
| `reload()`        | `() => Promise<void>`           | Re-runs the fetcher with the current query           |
| `setPage(num)`    | `(num: number) => void`         | Imperatively change the page                         |
| `setPerPage(num)` | `(num: number) => void`         | Imperatively change the page size                    |
| `setTotal(num)`   | `(num: number) => void`         | Override the total (rarely needed)                   |
| `setSort(sort)`   | `(sort: DataTableSort \| null) => void` | Imperatively change the sorting              |
| `toggleSort(field)` | `(field: string) => void`     | Cycle a column through `asc → desc → none`           |

## Type signature

```ts
type DataTableSortDirection = 'asc' | 'desc';

type DataTableSort = {
    readonly field: string;
    readonly direction: DataTableSortDirection;
};

type DataTableQuery<TFilter> = {
    readonly offset: number;
    readonly limit: number;
    readonly search: string;
    readonly filters: TFilter;
    readonly sort: DataTableSort | null;
};

type DataTableFetcher<TItem, TFilter> = (query: DataTableQuery<TFilter>) => Promise<BaseResponse<Paginated<TItem>> | false>;

declare function useDataTable<TItem, TFilter = Record<string, unknown>>(
    options: UseDataTableOptions<TItem, TFilter>
): UseDataTable<TItem, TFilter>;
```

## See also

- [`useLoaded`](/common/composable/useLoaded)
- [`usePagination`](/common/composable/usePagination)
- [`useDebouncedRef`](/common/composable/useDebouncedRef)
- [`useService`](/common/composable/useService)
- [`UnresolvedDependencyException`](/common/error/)
