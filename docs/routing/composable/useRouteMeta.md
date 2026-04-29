---
outline: deep
---

# useRouteMeta

Returns the merged `RouteMeta` of every record in the matched chain. Walks the chain from deepest to root, merging `meta` objects with `lodash-es`'s `merge`, and skips a `navigation` key that appears on a deeper record so a leaf can opt out of an ancestor's navigation block.

## Importing

```ts
import { useRouteMeta } from '@basmilius/routing';
```

## Signature

```ts
declare function useRouteMeta(): ComputedRef<RouteMeta>;
```

## Behaviour

For a route like:

```ts
{
    path: '/admin/users/:id',
    meta: { title: 'User' },
    children: [/* deeper records can override */]
}
```

`useRouteMeta()` returns the deep-merged result of every matched record's `meta`. Keys at deeper records win. A special case applies to `navigation`: if a leaf record carries `navigation`, the merged accumulator drops the `navigation` key from any record higher in the chain so the leaf's value is the authoritative navigation block.

## Usage

```vue
<script
    setup
    lang="ts">
    import { computed } from 'vue';
    import { useRouteMeta } from '@basmilius/routing';

    const meta = useRouteMeta();

    const title = computed(() => meta.value.title as string | undefined);
</script>

<template>
    <h1>{{ title }}</h1>
</template>
```

## Notes

- The composable consumes [`useRoute`](/routing/composable/useRoute), so it sees the same route override applied inside background or modal subtrees.
- The merge is performed on every read, so heavy `meta` blocks are best memoised at the consumer if they are accessed inside a tight loop.

## See also

- [`useRoute`](/routing/composable/useRoute)
