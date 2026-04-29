---
outline: deep
---

# Common

A set of Vue 3 composables, router helpers, Pinia store helpers, error classes and small utilities shared across the `@basmilius` ecosystem. The package is opinionated about its peer dependencies — it expects a Vue 3 application with Vue Router and Pinia available — but is otherwise unobtrusive.

## Categories

- [Composables](/common/composable/useClickOutside) — Vue 3 composables for clipboard, debouncing, observers, pagination and more
- [Router helpers](/common/router/) — small wrappers around `vue-router` for typed parameters, navigation and named views
- [Store](/common/store/) — a Pinia [`defineStore`](/common/store/) variant that returns refs by default
- [Errors](/common/error/) — domain exceptions used by [`guarded`](/common/util/guarded) and consumed by [`useService`](/common/composable/useService)
- [Utilities](/common/util/) — small helpers such as [`persistentRef`](/common/util/persistentRef), [`generateColorPalette`](/common/util/generateColorPalette) and [`unwrapElement`](/common/util/unwrapElement)

## Peer dependencies

The package leans on three peers that you almost certainly already have in any Vue 3 application.

- [`vue`](https://vuejs.org/) — composables and lifecycle hooks
- [`vue-router`](https://router.vuejs.org/) — required by everything in [`/common/router/`](/common/router/)
- [`pinia`](https://pinia.vuejs.org/) — required by [`defineStore`](/common/store/)

`@basmilius/http-client` is an optional peer that unlocks the data-oriented composables [`useDataTable`](/common/composable/useDataTable), [`useDtoForm`](/common/composable/useDtoForm) and [`useService`](/common/composable/useService).

## Quick example

```ts
import { ref } from 'vue';
import { useDebouncedRef, persistentStringRef } from '@basmilius/common';

const query = persistentStringRef('search:query', null);
const debounced = useDebouncedRef(query, 250);
```

Continue with [installation](/common/installation) or jump straight to a category from the sidebar.
