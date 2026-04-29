---
outline: deep
---

# Installation

`@basmilius/routing` is published as ESM only. It targets Vue 3.6+ and `vue-router` 5.

::: code-group

```shell [Bun]
bun add @basmilius/routing vue vue-router
```

```shell [npm]
npm install @basmilius/routing vue vue-router
```

```shell [pnpm]
pnpm add @basmilius/routing vue vue-router
```

```shell [yarn]
yarn add @basmilius/routing vue vue-router
```

:::

## Peer dependencies

- `vue` ^3.6
- `vue-router` ^5

## Importing

`@basmilius/routing` re-exports every public symbol from `vue-router`, so you can import everything from a single place:

```ts
import {
    createRouter,
    RouterLink,
    RouterView,
    ModalRouterView,
    useRoute,
    useRouter,
    useNavigate,
    useModalRoute,
    useNamedRoute,
    useRouteMeta,
    useRouteNames,
    useRouteParam,
    useRouteView,
    useIsView
} from '@basmilius/routing';
```

The shadowed symbols (`createRouter`, `RouterView`, `RouterLink`, `useRoute`) win the named export shootout — ES module spec resolves direct exports over star re-exports — so consumers receive the modal-aware variants.

Type-only imports for the public types:

```ts
import type {
    ModalConfig,
    ModalWrapperProps,
    RouterOptions,
    RouterViewProps
} from '@basmilius/routing';
```

## Module augmentation

Importing the package as a side effect registers the `vue-router` augmentations that this package relies on. Specifically:

- `RouteLocationOptions.modal` — used by `router.push({ ..., modal: true })` to open a route as a modal.
- `RouteMeta.modal` — used by `meta: { modal: { component } }` to define a per-route wrapper.

The augmentations are activated automatically the first time you `import` anything from `@basmilius/routing`.

## TypeScript

The package ships its own declarations. No additional `@types/*` package is required.

## Requirements

- Node.js 20+ or Bun 1.x for build pipelines.
- A modern browser environment when the modal layer is active (the package reads `history.state` to survive refreshes).
- A bundler that understands native ESM (Vite, Rollup, esbuild, oxc).
