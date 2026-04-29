---
outline: deep
---

# useRoute

Modal-aware drop-in replacement for `vue-router`'s `useRoute`. Returns a proxy that exposes every property of the active `RouteLocationNormalizedLoaded` plus two extras: a reactive `isModal` flag and a `promote()` method that turns the modal route into the real page.

## Importing

```ts
import { useRoute, type UseRoute } from '@basmilius/routing';
```

## Signature

```ts
declare function useRoute(): UseRoute;

type UseRoute = RouteLocationNormalizedLoaded & {
    readonly isModal: boolean;
    promote(): Promise<void>;
};
```

## Behaviour

The composable resolves to the right route depending on where it is consumed:

- **Inside a Background or Modal provider subtree** — uses the explicit override the provider installed. Background-tree components see the background route, modal-wrapper components see the modal route, independent of the router's live `currentRoute`.
- **Outside any provider while a modal is open** — surfaces the *background* route so layout-level keys stay stable across opens and closes.
- **Otherwise** — returns the router's live `currentRoute`.

Because `UseRoute` is a Proxy (not a Ref), it can be used directly in templates without `.value` and without auto-unwrapping stripping `isModal` or `promote`.

## Usage

```vue
<script
    setup
    lang="ts">
    import { useRoute } from '@basmilius/routing';

    const route = useRoute();

    async function permalink(): Promise<void> {
        await route.promote();
    }
</script>

<template>
    <h1>{{ route.meta.title }}</h1>
    <p v-if="route.isModal">Currently viewing in a modal.</p>
</template>
```

## isModal

Reactive boolean. `true` when the consuming component is inside a `ModalProvider` subtree. Used by modal wrappers and shared components that need to behave differently when rendered as a modal.

## promote()

Replaces the current history entry with the modal URL while clearing the modal state. The modal vanishes, the background route is forgotten and the URL becomes a real page.

```ts
await route.promote();
```

Outside of a modal context `promote()` is a no-op.

## See also

- [`useNavigate`](/routing/composable/useNavigate)
- [`useModalRoute`](/routing/composable/useModalRoute)
- [`RouterView`](/routing/component/RouterView)
- [Modal routing guide](/routing/guide/modal-routing)
