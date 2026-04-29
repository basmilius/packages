---
outline: deep
---

# useIsView

Return a `ComputedRef<boolean>` reflecting whether the active route matches a given name. The match is strict by default; pass `loose = true` to also match descendants whose names start with the supplied prefix.

## Importing

```ts
import { useIsView } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useIsView } from '@basmilius/common';

    const isOrders = useIsView('orders');
    const isOrdersSection = useIsView('orders.', true);
</script>

<template>
    <nav>
        <a :class="{active: isOrders}" href="/orders">Orders</a>
        <a :class="{active: isOrdersSection}" href="/orders">Orders section</a>
    </nav>
</template>
```

The composable is built on top of [`useRouteNames`](/common/router/useRouteNames). Strict matching uses an `===` comparison against every matched record name; loose matching switches to `String.prototype.startsWith`.

## Type signature

```ts
declare function useIsView(
    name: string,
    loose?: boolean
): ComputedRef<boolean>;
```

## See also

- [`useRouteNames`](/common/router/useRouteNames)
- [`useRouteView`](/common/router/useRouteView)
