---
outline: deep
---

# useDebounced

Wrap a function so that consecutive calls within `delay` milliseconds collapse into a single invocation, using the [`debounce`](/utils/function/debounce) helper from [`@basmilius/utils`](/utils/). The composable preserves the original function signature.

## Importing

```ts
import { useDebounced } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { ref } from 'vue';
    import { useDebounced } from '@basmilius/common';

    const query = ref('');

    const onSearch = useDebounced((value: string) => {
        console.log('searching for', value);
    }, 250);
</script>

<template>
    <input v-model="query" @input="onSearch(query)"/>
</template>
```

For debouncing a reactive value rather than a function, reach for [`useDebouncedRef`](/common/composable/useDebouncedRef) instead.

## Type signature

```ts
declare function useDebounced<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
): T;
```

## See also

- [`useDebouncedRef`](/common/composable/useDebouncedRef)
- [`debounce`](/utils/function/debounce)
