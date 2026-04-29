---
outline: deep
---

# unrefAll

Unref a tuple of dependencies and assert each one is truthy. If any unwrapped dependency is falsy, the helper throws [`UnresolvedDependencyException`](/common/error/) and returns nothing.

This is the canonical way to bail out of a fetcher in [`useDataTable`](/common/composable/useDataTable) until every reactive dependency has resolved — `useDataTable` catches `UnresolvedDependencyException` silently and skips the call.

## Importing

```ts
import { unrefAll } from '@basmilius/common';
```

## Usage

```ts
import { ref } from 'vue';
import { unrefAll, useDataTable } from '@basmilius/common';

const customerId = ref<number | null>(null);
const status = ref<string | null>(null);

useDataTable(async (offset, limit) => {
    const [customer, currentStatus] = unrefAll(customerId, status);
    return await orders.list(offset, limit, {customer, status: currentStatus});
}, [customerId, status]);
```

The return type narrows nullable refs to `NonNullable<T>` for each dependency, so downstream code does not need extra null checks.

## Type signature

```ts
type UnrefAll<T extends readonly unknown[]> = {
    [K in keyof T]: T[K] extends Ref<infer U> ? NonNullable<U> : T[K];
};

declare function unrefAll<T extends readonly unknown[]>(
    ...deps: T
): UnrefAll<T>;
```

## See also

- [`useDataTable`](/common/composable/useDataTable)
- [Errors](/common/error/) — `UnresolvedDependencyException`
