---
outline: deep

props:
    -   name: modals
        description: Opt this RouterView in as the host for the modal layer. Exactly one RouterView in the tree should set this.
        type: boolean
        default: 'false'
        optional: true
---

# RouterView

Modal-aware drop-in replacement for `vue-router`'s `RouterView`. When `modals` is enabled, the view splits the active route into a background tree and a modal tree based on the current modal state.

## Importing

```ts
import { RouterView } from '@basmilius/routing';
```

## Usage

```vue
<template>
    <header>...</header>
    <main>
        <RouterView modals/>
    </main>
</template>

<script
    setup
    lang="ts">
    import { RouterView } from '@basmilius/routing';
</script>
```

<FrontmatterDocs/>

## Behaviour

Without `modals` the component is identical to vue-router's `RouterView`. With `modals` enabled the component:

- Claims the modal host role on the shared modal context. The first `<RouterView modals>` to mount wins; later instances render as vanilla and emit a console warning.
- Subscribes to the modal context and, when a modal is active, renders two trees in a `<Fragment>`:
  1. A background tree wrapped in `BackgroundProvider`. Descendant `useRoute()` / `useNamedRoute()` / `useRouteView()` etc. resolve to the *background* route, so layout-level keys stay stable across opens / closes.
  2. A modal tree wrapped in `ModalProvider`. The modal renders at the appropriate `viewDepthKey` so nested layouts behave the same as on a full page.
- Handles the wrapper component lifecycle. The wrapper stays mounted across the leave animation; consecutive modals that share the same wrapper reuse the existing instance.

## Choosing the host

Mount the host RouterView at the level where the modal layer should appear. Typically this is just outside the page content, so a modal can render on top of the layout but does not displace global headers or navigation.

```vue
<template>
    <AppHeader/>
    <main>
        <RouterView modals/>
    </main>
    <AppFooter/>
</template>
```

Nested `<RouterView>` instances (for example, sub-views inside a multi-pane layout) must not set `modals` — they participate in the background tree and render as vanilla.

## See also

- [`RouterLink`](/routing/component/RouterLink)
- [`ModalRouterView`](/routing/component/ModalRouterView)
- [`createRouter`](/routing/createRouter)
- [`useRoute`](/routing/composable/useRoute)
- [`useModalRoute`](/routing/composable/useModalRoute)
- [Modal routing guide](/routing/guide/modal-routing)
