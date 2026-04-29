---
outline: deep
---

# useRouteNames

Return a `ComputedRef<string[]>` containing the names of every matched route record, from outermost to innermost. Records without a name are skipped.

## Importing

```ts
import { useRouteNames } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useRouteNames } from '@basmilius/common';

    const names = useRouteNames();
</script>

<template>
    <ol class="breadcrumbs">
        <li v-for="name in names" :key="name">{{ name }}</li>
    </ol>
</template>
```

This is the building block behind [`useIsView`](/common/router/useIsView). Reach for it directly when you need the full chain — for example to render breadcrumbs or to drive analytics page-views from a stable hierarchy.

## Type signature

```ts
declare function useRouteNames(): ComputedRef<string[]>;
```

## See also

- [`useIsView`](/common/router/useIsView)
- [`useRouteMeta`](/common/router/useRouteMeta)
