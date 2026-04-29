---
outline: deep
---

# createRouter

Modal-aware drop-in replacement for `vue-router`'s `createRouter`. Accepts every option from [`vue-router`](https://router.vuejs.org/api/interfaces/RouterOptions.html) plus a `defaultModal` configuration used as the fallback wrapper for modal routes that do not declare their own `meta.modal`.

## Importing

```ts
import { createRouter } from '@basmilius/routing';
```

## Signature

```ts
declare function createRouter(options: RouterOptions): Router;

type RouterOptions = VueRouterOptions & {
    readonly defaultModal?: ModalConfig;
};

type ModalConfig = {
    readonly component: Component;
    readonly props?: Record<string, unknown>;
};
```

| Option         | Type           | Description                                                                                                                                                                       |
| -------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultModal` | `ModalConfig`  | Optional. Fallback wrapper rendered for any modal route that does not define `meta.modal`. Use this to apply a single overlay component across the whole application.            |

Every other option (`history`, `routes`, `scrollBehavior`, ...) is forwarded to `vue-router` unchanged.

## What the wrapper adds

- Patches `router.push` and `router.replace` to translate the `modal` option on `RouteLocationOptions` into a `history.state` payload (see [`patchRouter`](https://github.com/basmilius/packages/blob/main/packages/routing/src/internal/patchRouter.ts)).
- Captures the original (unpatched) push / replace as `OriginalNav` for internal use (for example, [`promote`](/routing/composable/useRoute#promote)).
- Provides a shared `ModalContext` via `app.provide` so [`RouterView`](/routing/component/RouterView), [`RouterLink`](/routing/component/RouterLink), [`ModalRouterView`](/routing/component/ModalRouterView) and the composables can coordinate.

## Example

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
                // Per-route override
                modal: { component: OverlayWrapper, props: { size: 'large' } }
            }
        },
        {
            path: '/login',
            component: () => import('./pages/Login.vue'),
            meta: {
                // Will use defaultModal if none of the matched routes carry meta.modal
            }
        }
    ],
    defaultModal: { component: OverlayWrapper }
});
```

## Behaviour notes

- A modal route is only opened as a modal when the navigation declares `modal: true | <number>` on `RouteLocationOptions`. Visiting the same URL directly (a hard refresh of `/users/42`) renders the route as a full page unless its `meta.modal` (or `defaultModal`) is configured and a `<RouterView modals>` is mounted somewhere in the tree.
- `modal: <number>` controls the modal's depth — `0` renders only the deepest matched record, higher values include `N` parent records as in-modal layout. See [`RouterLink`](/routing/component/RouterLink) and [`patchRouter`](https://github.com/basmilius/packages/blob/main/packages/routing/src/internal/patchRouter.ts).
- Subsequent navigations inside an open modal stay in the modal as long as they share the root-matched record. Navigating to a sibling at the root closes the modal.

## See also

- [`RouterView`](/routing/component/RouterView)
- [`RouterLink`](/routing/component/RouterLink)
- [`ModalRouterView`](/routing/component/ModalRouterView)
- [Modal routing guide](/routing/guide/modal-routing)
- [Types](/routing/types)
