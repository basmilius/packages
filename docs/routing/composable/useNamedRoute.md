---
outline: deep
---

# useNamedRoute

Looks up a named view in the route's matched chain, provides the appropriate `viewDepthKey` to descendant `<RouterView>`s and returns a stable view key suitable for `<RouterView v-slot>` keying.

## Importing

```ts
import { useNamedRoute } from '@basmilius/routing';
```

## Signature

```ts
declare function useNamedRoute(name: Ref<string> | string): {
    readonly route: UseRoute;
    readonly viewKey: ComputedRef<string | undefined>;
};
```

| Argument | Type                  | Description                                                            |
| -------- | --------------------- | ---------------------------------------------------------------------- |
| `name`   | `Ref<string>`/`string` | Name of the view (key inside `matched[i].components`) to look up.       |

## Returns

- **`route`** — the [`UseRoute`](/routing/composable/useRoute) proxy.
- **`viewKey`** — a `ComputedRef<string | undefined>` of the matched record's `path`. Use it as `:key` on a `<RouterView>` to force a remount when the named view changes records.

## What it does

The composable walks the matched chain of [`useRoute`](/routing/composable/useRoute), finds the first record whose `components` map carries the given `name` and `provide`s the matching depth via `viewDepthKey`. Descendant `<RouterView>` instances pick up the depth and resume rendering at the correct matched index.

## Usage

```vue
<script
    setup
    lang="ts">
    import { useNamedRoute } from '@basmilius/routing';

    const { viewKey } = useNamedRoute('sidebar');
</script>

<template>
    <RouterView
        :key="viewKey"
        name="sidebar"/>
</template>
```

## See also

- [`useRoute`](/routing/composable/useRoute)
- [`useRouteView`](/routing/composable/useRouteView) — returns the `RouteComponent` for a named view.
- [`RouterView`](/routing/component/RouterView)
