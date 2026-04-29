---
outline: deep
---

# useModalRoute

Surfaces the route driving the currently active modal — or `null` when no modal is open. Use it when a component outside the modal subtree needs to read the modal route directly (a sticky header that displays "viewing user 42 in modal" while the user list stays interactive in the background, for example).

## Importing

```ts
import { useModalRoute } from '@basmilius/routing';
```

## Signature

```ts
declare function useModalRoute(): ComputedRef<RouteLocationNormalized | null>;
```

## Behaviour

The composable resolves to the modal route in two situations:

- **Inside a `ModalProvider` subtree** — the override IS the modal route, so the modal route is returned directly.
- **Outside any provider** — when the shared modal context is in modal mode, the router's live `currentRoute` is the modal route.

In every other case (no modal active, or rendered inside a `BackgroundProvider`) the composable resolves to `null`.

## Usage

```vue
<script
    setup
    lang="ts">
    import { computed } from 'vue';
    import { useModalRoute } from '@basmilius/routing';

    const modalRoute = useModalRoute();

    const title = computed(() => modalRoute.value?.meta.title as string | undefined);
</script>

<template>
    <header v-if="modalRoute">Viewing in modal: {{ title }}</header>
</template>
```

## See also

- [`useRoute`](/routing/composable/useRoute)
- [`RouterView`](/routing/component/RouterView)
- [Modal routing guide](/routing/guide/modal-routing)
