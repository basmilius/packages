---
outline: deep
---

# useRouteView

Look up the component currently matched for a given named view. The composable walks the matched records from outermost to innermost, and returns the first record whose `components` map contains the requested name.

## Importing

```ts
import { useRouteView } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useRouteView } from '@basmilius/common';

    const sidebar = useRouteView('sidebar');
</script>

<template>
    <component v-if="sidebar" :is="sidebar"/>
</template>
```

The argument can be a static string or a `Ref<string>` to switch named views at runtime.

## Type signature

```ts
declare function useRouteView(
    nameRef: Ref<string> | string
): ComputedRef<RouteComponent | null>;
```

## See also

- [`useNamedRoute`](/common/router/useNamedRoute)
- [`useIsView`](/common/router/useIsView)
