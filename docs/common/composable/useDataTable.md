---
outline: deep
---

# useDataTable

Wire up a paginated data table backed by a `BaseResponse<Paginated<T>>` from [`@basmilius/http-client`](/http-client/). Combines [`useLoaded`](/common/composable/useLoaded) and [`usePagination`](/common/composable/usePagination) and re-fetches whenever the page, page size or one of the supplied dependencies changes.

## Importing

```ts
import { useDataTable } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useDataTable, useService } from '@basmilius/common';
    import { OrderService, type Order } from '@/services/OrderService';

    const orders = useService(OrderService);

    const {
        displayEmpty,
        isLoading,
        items,
        page,
        perPage,
        total,
        reload,
        setPage,
        setPerPage
    } = useDataTable<Order>((offset, limit) => orders.list(offset, limit));
</script>

<template>
    <table v-if="!displayEmpty">
        <tr v-for="order in items" :key="order.id">
            <td>{{ order.reference }}</td>
        </tr>
    </table>
    <p v-else>No orders found.</p>
</template>
```

The fetcher receives the calculated `offset` and the active `limit`. Returning `false` skips the update — useful when a request was cancelled or aborted upstream. Throwing an [`UnresolvedDependencyException`](/common/error/) silently swallows the call, which pairs nicely with [`unrefAll`](/common/util/unrefAll).

Pass a `dependencies` array of additional reactive sources (filter refs, search queries, selected tags) to trigger a re-fetch when they change.

```ts
const search = ref('');
useDataTable(fetcher, [search]);
```

## Returned bindings

| Property        | Type                       | Description                                          |
| --------------- | -------------------------- | ---------------------------------------------------- |
| `displayEmpty`  | `Ref<boolean>`             | `true` when the first load returned no items         |
| `isLoading`     | `ComputedRef<boolean>`     | Loading flag from [`useLoaded`](/common/composable/useLoaded) |
| `items`         | `Ref<T[]>`                 | Latest page of items                                 |
| `limits`        | `Ref<number[]>`            | Available page-size options (5, 10, 25, 50, 100)     |
| `page`          | `Ref<number>`              | One-based current page                               |
| `perPage`       | `Ref<number>`              | Active page size                                     |
| `total`         | `Ref<number>`              | Total item count from the latest response            |
| `reload()`      | `() => Promise<void>`      | Re-runs the fetcher with the current page and size   |
| `setPage(num)`  | `(num: number) => void`    | Imperatively change the page                         |
| `setPerPage(num)` | `(num: number) => void`  | Imperatively change the page size                    |
| `setTotal(num)` | `(num: number) => void`    | Override the total (rarely needed)                   |

## Type signature

```ts
declare function useDataTable<T>(
    fetcher: (offset: number, limit: number) => Promise<BaseResponse<Paginated<T>> | false>,
    dependencies?: MultiWatchSources
): UseDataTable<T>;
```

## See also

- [`useLoaded`](/common/composable/useLoaded)
- [`usePagination`](/common/composable/usePagination)
- [`useService`](/common/composable/useService)
- [`UnresolvedDependencyException`](/common/error/)
