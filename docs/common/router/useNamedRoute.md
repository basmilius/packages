---
outline: deep
---

# useNamedRoute

Provide the `viewDepthKey` injection so a nested `<router-view>` resolves a named view at the right depth, and expose the matched record together with a `viewKey` for keyed transitions.

This composable is the canonical way to host a named view from inside a Vue component — both [`@basmilius/common`](/common/) and [`@basmilius/routing`](/routing/) build on top of it.

## Importing

```ts
import { useNamedRoute } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useNamedRoute } from '@basmilius/common';

    const {
        route,
        viewKey
    } = useNamedRoute('sidebar');
</script>

<template>
    <Transition mode="out-in">
        <RouterView name="sidebar" :key="viewKey"/>
    </Transition>
</template>
```

The first argument can be a static string or a `Ref<string>` for a dynamic view name. `viewKey` is the path of the matched record, which makes a great `:key` for transitions because it changes whenever the matched record changes.

## Returned bindings

| Property   | Type                                       | Description                              |
| ---------- | ------------------------------------------ | ---------------------------------------- |
| `route`    | `RouteLocationNormalizedLoadedGeneric`     | Active route from `useRoute()`           |
| `viewKey`  | `ComputedRef<string \| undefined>`         | Path of the matched record               |

## Type signature

```ts
declare function useNamedRoute(
    nameRef: Ref<string> | string
): {
    readonly route: RouteLocationNormalizedLoadedGeneric;
    readonly viewKey: ComputedRef<string | undefined>;
};
```

## See also

- [`useRouteView`](/common/router/useRouteView)
- [`useIsView`](/common/router/useIsView)
- [`@basmilius/routing`](/routing/)
