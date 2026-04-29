---
outline: deep
---

# Modal routing

This guide walks through enabling modal routing end-to-end. The general idea: the URL always describes a single route, but `<RouterView modals>` can split the active route into a *background* and a *modal* layer based on the navigation that produced it.

## Mental model

A modal navigation is a regular `router.push` (or `router.replace`) with a `modal` flag on `RouteLocationOptions`:

```ts
router.push({ path: '/users/42', modal: true });
```

The patched router converts this into history state that records:

- The `backgroundPath` — the route that was active when the modal opened.
- The `depth` — how many parent records of the current route render inside the modal wrapper.

That state travels with the navigation, so a refresh while the modal is open re-opens it on top of the same background.

A `<RouterView modals>` reads this state and renders two trees in parallel:

1. The background tree — uses `BackgroundProvider` to override `useRoute()` to the stored background route.
2. The modal tree — uses `ModalProvider` and `viewDepthKey` to render the modal route at the right depth, wrapped in the configured wrapper component.

## 1. Configure routes

Decide which routes can appear as modals and either declare a per-route wrapper via `meta.modal` or rely on `defaultModal`:

```ts
import { createRouter } from '@basmilius/routing';
import { createWebHistory } from 'vue-router';
import OverlayWrapper from './layout/OverlayWrapper.vue';
import LightboxWrapper from './layout/LightboxWrapper.vue';

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
        },
        {
            path: '/photos/:id',
            component: () => import('./pages/Photo.vue'),
            meta: {
                modal: { component: LightboxWrapper, props: { backdrop: 'dark' } }
            }
        }
    ],
    defaultModal: { component: OverlayWrapper }
});
```

## 2. Mount a host RouterView

Exactly one `<RouterView>` needs `modals`. Place it where the modal layer should mount — typically just outside your top-level layout container.

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

The host runs the background route as a vanilla `<RouterView>` and renders the modal layer in a `Fragment` next to it. Other `<RouterView>` instances in the tree (e.g. nested layouts) render as vanilla.

## 3. Build a wrapper

A wrapper is a plain Vue component that consumes [`ModalWrapperProps`](/routing/types#modalwrapperprops) and exposes a default slot for the modal's inner view. Use `<ModalRouterView>` when you need an animated child view inside the wrapper.

```vue
<!-- OverlayWrapper.vue -->
<template>
    <Teleport to="body">
        <Transition name="overlay">
            <div
                v-if="modalActive"
                class="overlay"
                @click.self="$emit('close')">
                <div class="overlay__content">
                    <Transition name="overlay-inner">
                        <ModalRouterView v-if="modalReady"/>
                    </Transition>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script
    setup
    lang="ts">
    import { ModalRouterView, type ModalWrapperProps } from '@basmilius/routing';

    defineProps<ModalWrapperProps>();
    defineEmits<{
        (event: 'close'): void;
    }>();
</script>
```

Notes:

- `modalActive` controls the outer `<Transition>` — keeps the wrapper mounted across the close animation.
- `modalReady` is the gate the package flips one tick after `modalActive` becomes `true`. Use it to `v-if` the inner `<ModalRouterView>` so the inner `<Transition>` plays its enter animation.
- The wrapper receives an automatic `onClose` listener that calls `router.back()`. Bind it via `@close="..."` or rely on the default emit-driven flow.

## 4. Open modals from the UI

`<RouterLink>` accepts a `modal` prop:

```vue
<RouterLink :to="{ path: '/users/42' }" modal>Open user</RouterLink>
<RouterLink :to="{ path: '/users/42' }" :modal="1">Open user with parent layout</RouterLink>
```

Or push imperatively:

```ts
router.push({ path: '/users/42', modal: true });
```

Modifier-clicks (cmd, ctrl, middle-click) still open the URL in a new tab — the link only opts into modal navigation for primary clicks. Modal routes must therefore be valid stand-alone URLs.

## 5. Close modals

The wrapper emits `close` when the user dismisses the modal. The default listener installed by `RouterView` calls `router.back()`. To close imperatively from anywhere:

```ts
router.back();
```

## Promoting a modal

Sometimes a modal should become a real page — for example, when the user requests a permalink. [`useRoute`](/routing/composable/useRoute) exposes a `promote()` method that replaces the current history entry with the modal URL and clears the modal state:

```ts
import { useRoute } from '@basmilius/routing';

const route = useRoute();

async function permalink(): Promise<void> {
    await route.promote();
}
```

## See also

- [Slot props guide](/routing/guide/slot-props)
- [`createRouter`](/routing/createRouter)
- [`RouterView`](/routing/component/RouterView)
- [`RouterLink`](/routing/component/RouterLink)
- [`ModalRouterView`](/routing/component/ModalRouterView)
- [`useModalRoute`](/routing/composable/useModalRoute)
