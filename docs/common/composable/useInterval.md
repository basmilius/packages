---
outline: deep
---

# useInterval

Run a function on a recurring interval that lives only as long as the component does. The composable schedules the next tick with `setTimeout` and runs the callback inside `requestAnimationFrame`, so no work happens while the tab is in the background.

## Importing

```ts
import { useInterval } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { ref } from 'vue';
    import { useInterval } from '@basmilius/common';

    const now = ref(Date.now());

    useInterval(1000, () => {
        now.value = Date.now();
    });
</script>

<template>
    <span>{{ new Date(now).toLocaleTimeString() }}</span>
</template>
```

The interval can be reactive — pass a `Ref<number>` to throttle or accelerate the cadence at runtime. The first invocation happens after the initial timeout, not immediately on mount.

## Type signature

```ts
declare function useInterval(
    interval: Ref<number> | number,
    fn: Function
): void;
```

## See also

- [`useDebounced`](/common/composable/useDebounced)
- [`useDebouncedRef`](/common/composable/useDebouncedRef)
