---
outline: deep
---

# useRouteNames

Returns the names of every record in the matched chain, in route-tree order. Records without a `name` are skipped.

## Importing

```ts
import { useRouteNames } from '@basmilius/routing';
```

## Signature

```ts
declare function useRouteNames(): ComputedRef<string[]>;
```

## Usage

```vue
<script
    setup
    lang="ts">
    import { useRouteNames } from '@basmilius/routing';

    const names = useRouteNames();
</script>

<template>
    <ul>
        <li v-for="name in names" :key="name">{{ name }}</li>
    </ul>
</template>
```

## Notes

- The composable consumes [`useRoute`](/routing/composable/useRoute), so it picks up the route override applied inside background or modal subtrees.
- Names are returned in the order they appear in `matched`, i.e. from root to leaf.

## See also

- [`useIsView`](/routing/composable/useIsView)
- [`useRoute`](/routing/composable/useRoute)
