---
outline: deep
---

# useLoaded

Track the loading state of one or more async operations. The composable returns a `loaded(fn)` decorator that increments an internal task counter while a promise is in flight, and exposes a debounced `isLoading` flag suitable for binding to spinners and skeleton states.

## Importing

```ts
import { useLoaded } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useLoaded, useService } from '@basmilius/common';
    import { OrderService } from '@/services/OrderService';

    const orders = useService(OrderService);

    const {
        isLoading,
        loaded
    } = useLoaded(150);

    const fetchOrders = loaded(async () => {
        return await orders.list(0, 25);
    });

    fetchOrders();
</script>

<template>
    <progress v-if="isLoading"/>
</template>
```

The `debounce` argument controls how long `isLoading` stays `true` after the last task settles, smoothing out rapid in-flight transitions. Pass `initial = true` to start in a loading state — the first task to settle flips it off.

The same `loaded` function can be used multiple times. Calls run concurrently and the counter is decremented in `finally`, so even rejected promises clean up correctly.

## Returned bindings

| Property      | Type                                  | Description                                |
| ------------- | ------------------------------------- | ------------------------------------------ |
| `isLoading`   | `ComputedRef<boolean>`                | Debounced loading flag                     |
| `loaded(fn)`  | `<T extends Function>(fn: T) => T`    | Decorator that tracks the wrapped function |

## Type signature

```ts
declare function useLoaded(
    debounce?: number,
    initial?: boolean
): {
    readonly isLoading: ComputedRef<boolean>;
    loaded<T extends Function>(fn: T): T;
};
```

## See also

- [`useLoadedAction`](/common/composable/useLoadedAction)
- [`useDataTable`](/common/composable/useDataTable)
- [`useDebouncedRef`](/common/composable/useDebouncedRef)
