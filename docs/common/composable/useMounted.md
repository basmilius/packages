---
outline: deep
---

# useMounted

A trivial helper that returns a `Ref<boolean>` flipping to `true` on `onMounted`. Useful for SSR-safe rendering that needs the component to have hit the DOM before performing client-only work.

## Importing

```ts
import { useMounted } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useMounted } from '@basmilius/common';

    const isMounted = useMounted();
</script>

<template>
    <Teleport v-if="isMounted" to="body">
        <div class="overlay">Client-only overlay</div>
    </Teleport>
</template>
```

## Type signature

```ts
declare function useMounted(): Ref<boolean>;
```
