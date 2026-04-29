---
outline: deep
---

# Installation

`@basmilius/common` ships as ESM and expects to live next to a Vue 3 application. It declares Vue, Vue Router and Pinia as peer dependencies, so you install them alongside the package itself.

::: code-group

```shell [Bun]
bun add @basmilius/common vue vue-router pinia
```

```shell [npm]
npm install @basmilius/common vue vue-router pinia
```

```shell [pnpm]
pnpm add @basmilius/common vue vue-router pinia
```

```shell [yarn]
yarn add @basmilius/common vue vue-router pinia
```

:::

## Peer dependencies

The package will not install Vue, Vue Router or Pinia for you — they are listed as peers so the host application stays in control of the exact versions.

- [`vue`](https://vuejs.org/) (3.x) — every composable depends on Vue's reactivity APIs
- [`vue-router`](https://router.vuejs.org/) (4.x) — required for everything in [`/common/router/`](/common/router/)
- [`pinia`](https://pinia.vuejs.org/) (3.x) — required for [`defineStore`](/common/store/)

### Optional: `@basmilius/http-client`

A few composables are tightly coupled to [`@basmilius/http-client`](/http-client/). Add it when you plan to use them.

- [`useDataTable`](/common/composable/useDataTable) — paginated data tables backed by a `BaseResponse<Paginated<T>>`
- [`useDtoForm`](/common/composable/useDtoForm) — DTO-aware form refs that clone and mark clean
- [`useService`](/common/composable/useService) — service-class proxy that wraps every method with [`guarded`](/common/util/guarded)

```shell
bun add @basmilius/http-client
```

## Importing

All exports are named exports from the package root. The package is fully tree-shakeable, so unused composables and utilities are dropped from your bundle.

```ts
import { useClickOutside, persistentRef } from '@basmilius/common';
```

## Requirements

- Node.js 20+ or Bun 1.x
- A bundler with native ESM support (Vite, Rollup, esbuild, ...)
- A browser environment for any composable that touches the DOM, such as [`useClickOutside`](/common/composable/useClickOutside), [`useMutationObserver`](/common/composable/useMutationObserver), [`useResizeObserver`](/common/composable/useResizeObserver) and [`useLocalFile`](/common/composable/useLocalFile)
