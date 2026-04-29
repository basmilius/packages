---
outline: deep
---

# useLoadedAction

Convenience wrapper around [`useLoaded`](/common/composable/useLoaded) for the common case of a single async action with its own loading flag. Returns a tuple of `[wrappedAction, isLoading]`.

## Importing

```ts
import { useLoadedAction } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useLoadedAction, useService } from '@basmilius/common';
    import { OrderService } from '@/services/OrderService';

    const orders = useService(OrderService);

    const [submit, isSubmitting] = useLoadedAction(async (id: number) => {
        await orders.submit(id);
    });
</script>

<template>
    <button :disabled="isSubmitting" @click="submit(123)">
        {{ isSubmitting ? 'Submitting...' : 'Submit' }}
    </button>
</template>
```

Use [`useLoaded`](/common/composable/useLoaded) directly when you need to track multiple actions under a single loading flag.

## Type signature

```ts
declare function useLoadedAction<T extends (...args: any[]) => Promise<any>>(
    fn: T
): [T, ComputedRef<boolean>];
```

## See also

- [`useLoaded`](/common/composable/useLoaded)
