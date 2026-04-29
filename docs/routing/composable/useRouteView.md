---
outline: deep
---

# useRouteView

Looks up the component registered under a named view in the route's matched chain. Returns the first match (by walking from root to leaf) or `null` when none of the matched records carry the requested view.

## Importing

```ts
import { useRouteView } from '@basmilius/routing';
```

## Signature

```ts
declare function useRouteView(nameRef: Ref<string> | string): ComputedRef<RouteComponent | null>;
```

| Argument  | Type                    | Description                                                                  |
| --------- | ----------------------- | ---------------------------------------------------------------------------- |
| `nameRef` | `Ref<string>`/`string`  | Name of the view (key inside `matched[i].components`) to look up.             |

## Usage

```vue
<script
    setup
    lang="ts">
    import { useRouteView } from '@basmilius/routing';

    const sidebar = useRouteView('sidebar');
</script>

<template>
    <aside>
        <component
            v-if="sidebar"
            :is="sidebar"/>
    </aside>
</template>
```

## Notes

- Useful when the consumer needs to decide whether a named view exists for the current route before rendering a slot or layout.
- Pair with [`useNamedRoute`](/routing/composable/useNamedRoute) when you also need a stable `:key` for a `<RouterView name="...">`.
- The composable consumes [`useRoute`](/routing/composable/useRoute), so it follows the route override inside background or modal subtrees.

## See also

- [`useNamedRoute`](/routing/composable/useNamedRoute)
- [`useRoute`](/routing/composable/useRoute)
- [`RouterView`](/routing/component/RouterView)
