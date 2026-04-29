---
outline: deep
---

# useRouteParam

Read a single route parameter as a `Ref<string | null>`. The ref tracks `route.params[name]` reactively and emits `null` when the parameter is absent. Pass `defaultValue` to seed the ref before the first watcher fires.

## Importing

```ts
import { useRouteParam } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { computed } from 'vue';
    import { useRouteParam } from '@basmilius/common';

    const id = useRouteParam('id');
    const numericId = computed(() => id.value ? Number(id.value) : null);
</script>

<template>
    <p v-if="numericId !== null">Loading order #{{ numericId }}</p>
</template>
```

Empty strings are coerced to `null` to keep the ref's type tight.

## Type signature

```ts
declare function useRouteParam(
    name: string,
    defaultValue?: string | null
): Ref<string | null>;
```

## See also

- [`useRouteMeta`](/common/router/useRouteMeta)
- [`useRouteNames`](/common/router/useRouteNames)
