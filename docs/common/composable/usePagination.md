---
outline: deep
---

# usePagination

A small reactive container for pagination state. Returns refs for the current page, page size, total item count and a list of available page-size options, plus imperative setters.

The defaults are conservative — page `1`, `25` items per page and `[5, 10, 25, 50, 100]` as options. [`useDataTable`](/common/composable/useDataTable) builds on top of this composable.

## Importing

```ts
import { usePagination } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { usePagination } from '@basmilius/common';

    const {
        limits,
        page,
        perPage,
        total,
        setPage,
        setPerPage,
        setTotal
    } = usePagination();
</script>

<template>
    <select :value="perPage" @change="setPerPage(Number(($event.target as HTMLSelectElement).value))">
        <option v-for="limit in limits" :key="limit" :value="limit">
            {{ limit }}
        </option>
    </select>

    <button :disabled="page === 1" @click="setPage(page - 1)">Previous</button>
    <button :disabled="page * perPage >= total" @click="setPage(page + 1)">Next</button>
</template>
```

## Returned bindings

| Property        | Type                    | Description                                |
| --------------- | ----------------------- | ------------------------------------------ |
| `limits`        | `Ref<number[]>`         | Available page-size options                |
| `page`          | `Ref<number>`           | One-based current page (default `1`)       |
| `perPage`       | `Ref<number>`           | Active page size (default `25`)            |
| `total`         | `Ref<number>`           | Total number of items                      |
| `setPage(num)`  | `(num: number) => void` | Set the current page                       |
| `setPerPage(num)` | `(num: number) => void` | Set the page size                        |
| `setTotal(num)` | `(num: number) => void` | Set the total count                        |

## Type signature

```ts
declare function usePagination(): {
    readonly limits: Ref<number[]>;
    readonly page: Ref<number>;
    readonly perPage: Ref<number>;
    readonly total: Ref<number>;
    setPage(num: number): void;
    setPerPage(num: number): void;
    setTotal(num: number): void;
};
```

## See also

- [`useDataTable`](/common/composable/useDataTable)
