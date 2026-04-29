---
outline: deep
---

# useRouteMeta

Compute a single `RouteMeta` object by merging the meta of every matched record. Records are merged from innermost to outermost using `lodash-es`'s `merge`, so the deepest record wins for conflicting keys.

The `navigation` key is special-cased: when an inner record already provides one, the outer record's `navigation` is dropped before merging. This keeps the most specific navigation chrome from being overwritten by parent layouts.

## Importing

```ts
import { useRouteMeta } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useRouteMeta } from '@basmilius/common';

    const meta = useRouteMeta();
</script>

<template>
    <h1 v-if="meta.title">{{ meta.title }}</h1>
</template>
```

Augment the `RouteMeta` interface from `vue-router` to get type-safe access to your custom keys.

```ts
declare module 'vue-router' {
    interface RouteMeta {
        readonly title?: string;
        readonly navigation?: 'main' | 'minimal';
    }
}
```

## Type signature

```ts
declare function useRouteMeta(): ComputedRef<RouteMeta>;
```

## See also

- [`useRouteNames`](/common/router/useRouteNames)
- [`useRouteParam`](/common/router/useRouteParam)
