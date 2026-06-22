---
outline: deep

cards:
    next:
        -   title: Modal routing
            details: 'A complete walkthrough of background + modal routing.'
            link: /routing/guide/modal-routing
        -   title: Slot props
            details: 'The ModalWrapperProps passed into modal wrappers.'
            link: /routing/guide/slot-props
        -   title: createRouter
            code: true
            details: 'The patched router factory with modal awareness.'
            link: /routing/createRouter
        -   title: RouterView
            code: true
            details: 'Modal-aware router view that hosts the modal layer.'
            link: /routing/component/RouterView
        -   title: RouterLink
            code: true
            details: 'Links that open routes as modals via the modal prop.'
            link: /routing/component/RouterLink
        -   title: useModalRoute
            code: true
            details: 'Read and control the active modal route.'
            link: /routing/composable/useModalRoute
---

# Routing

`@basmilius/routing` extends `vue-router` with first-class modal routing. It re-exports every `vue-router` symbol and replaces the small surface that needs modal awareness — `createRouter`, `RouterView`, `RouterLink` — plus a handful of composables that smooth over the differences between background and modal routes.

## Why a wrapper

Modal routing usually means routing twice in parallel: a background page that stays visible while a modal sits on top, plus a modal route the URL points at. `@basmilius/routing` keeps both in sync with `history.state` so refreshes survive, deep links work, and `<Transition>` plays.

Concretely, the package adds:

- A patched [`createRouter`](/routing/createRouter) that injects modal state into navigations and exposes a shared modal context.
- A modal-aware [`RouterView`](/routing/component/RouterView). Add `modals` to the instance that should host the modal layer and render the rest of the tree as background.
- A [`RouterLink`](/routing/component/RouterLink) that supports `modal` (`true` or a depth number) so links can open as modals without bespoke handlers.
- A [`ModalRouterView`](/routing/component/ModalRouterView) for use inside wrapper components that need their own animated child view.
- Composables ([`useRoute`](/routing/composable/useRoute), [`useNavigate`](/routing/composable/useNavigate), [`useModalRoute`](/routing/composable/useModalRoute), [`useNamedRoute`](/routing/composable/useNamedRoute) and friends) that always do the right thing inside background, modal and provider subtrees.

## Quick example

```ts
// router.ts
import { createRouter } from '@basmilius/routing';
import { createWebHistory } from 'vue-router';
import OverlayWrapper from './layout/OverlayWrapper.vue';

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('./pages/Home.vue')
        },
        {
            path: '/users/:id',
            component: () => import('./pages/User.vue'),
            meta: {
                modal: { component: OverlayWrapper }
            }
        }
    ],
    defaultModal: { component: OverlayWrapper }
});
```

```vue
<!-- App.vue -->
<template>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink :to="{ path: '/users/42' }" modal>Open user</RouterLink>

    <RouterView modals/>
</template>

<script
    setup
    lang="ts">
    import { RouterLink, RouterView } from '@basmilius/routing';
</script>
```

## Where to next

<LinkCards group="next"/>

Browse the [components](/routing/component/RouterView), [composables](/routing/composable/useRoute) and [types](/routing/types) for the full API reference.

## Related packages

- [`@basmilius/common`](/common/) ships [`useDtoForm`](/common/composable/useDtoForm) plus a small router helper module. `@basmilius/routing` is the main package — `common` only carries thin helpers that depend on the routing primitives documented here.
