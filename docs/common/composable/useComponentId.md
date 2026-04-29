---
outline: deep
---

# useComponentId

Return the unique identifier of the current component instance as a `ComputedRef<number>`. Handy when you need a stable id to wire up `aria-labelledby`, `for` / `id` pairs on form controls or any other DOM relationship that needs a unique value within a page.

## Importing

```ts
import { useComponentId } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { computed } from 'vue';
    import { useComponentId } from '@basmilius/common';

    const componentId = useComponentId();
    const inputId = computed(() => `input-${componentId.value}`);
</script>

<template>
    <label :for="inputId">Email</label>
    <input :id="inputId" type="email"/>
</template>
```

The composable falls back to the legacy `_uid` of the proxy when `getCurrentInstance().uid` is unavailable, and returns `0` if neither can be resolved. The computed is reactive, but in practice the underlying value never changes during a component's lifetime.

## Type signature

```ts
declare function useComponentId(): ComputedRef<number>;
```
