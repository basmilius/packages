---
outline: deep
---

# Types

Public TypeScript types exported from `@basmilius/routing`.

## Importing

```ts
import type {
    ModalConfig,
    ModalWrapperProps,
    RouterOptions,
    RouterViewProps
} from '@basmilius/routing';
```

## ModalConfig

Describes a modal wrapper component plus optional static props. Used both on `RouteMeta.modal` (per-route wrapper) and on `RouterOptions.defaultModal` (fallback wrapper).

```ts
type ModalConfig = {
    readonly component: Component;
    readonly props?: Record<string, unknown>;
};
```

`props` are spread into the wrapper component first; runtime props ([`ModalWrapperProps`](#modalwrapperprops)) are spread after them, so consumers cannot accidentally shadow runtime values via `meta.modal.props`.

## ModalWrapperProps

The runtime props that [`RouterView`](/routing/component/RouterView) injects into every modal wrapper component. Declare them on your wrapper via `defineProps<ModalWrapperProps>()`.

```ts
type ModalWrapperProps = {
    readonly modalRoute: RouteLocationNormalized;
    readonly modalActive: boolean;
    readonly modalReady: boolean;
};
```

- **`modalRoute`** — the currently active modal route. Stable across the entire open-modal lifecycle.
- **`modalActive`** — open/close flag for script-level use (disable inputs while closing, schedule cleanup, etc.). True from the first render until the route stops being a modal.
- **`modalReady`** — `v-if` gate for the inner `<ModalRouterView>`. False at mount and during the close phase so the wrapper's `<Transition>` has an empty slot to animate from / to. Use this prop (not `modalActive`) when you need an enter animation.

The wrapper also receives an `onClose` listener that calls `router.back()` when invoked. Implement an `emit('close')` on your wrapper to wire it to user dismissals (clicking the backdrop, pressing escape, etc.).

## RouterOptions

Shadows `vue-router`'s `RouterOptions`. Adds `defaultModal` as the fallback wrapper for modal routes without their own `meta.modal`.

```ts
type RouterOptions = VueRouterOptions & {
    readonly defaultModal?: ModalConfig;
};
```

See [`createRouter`](/routing/createRouter) for usage.

## RouterViewProps

Props on the modal-aware [`RouterView`](/routing/component/RouterView).

```ts
type RouterViewProps = {
    readonly modals?: boolean;
};
```

- **`modals`** — opts the instance in as the host for the modal layer. Exactly one `<RouterView>` should set this. If multiple do, the first to mount wins; the others render as a vanilla `RouterView` and emit a console warning.

## vue-router augmentations

Importing `@basmilius/routing` registers the following module augmentations on `vue-router`:

```ts
declare module 'vue-router' {
    interface RouteLocationOptions {
        modal?: boolean | number;
    }

    interface RouteMeta {
        modal?: ModalConfig;
    }
}
```

- **`RouteLocationOptions.modal`** — passed to `router.push({ ..., modal })` (or `<RouterLink :modal>`):
  - `true` / `0` opens the modal rendering only the deepest matched record.
  - A positive number `N` includes `N` parent records above the deepest one (useful when a nested route's layout should also render inside the modal wrapper).
  - `false` navigates without a modal.
- **`RouteMeta.modal`** — declares the wrapper to render when this route is reached as a modal.

## See also

- [`createRouter`](/routing/createRouter)
- [`RouterView`](/routing/component/RouterView)
- [`RouterLink`](/routing/component/RouterLink)
- [`ModalRouterView`](/routing/component/ModalRouterView)
- [Slot props guide](/routing/guide/slot-props)
