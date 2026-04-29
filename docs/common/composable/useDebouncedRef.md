---
outline: deep
---

# useDebouncedRef

Create a `Ref<T>` whose writes are debounced. Reads are immediate, writes are deferred to a `setTimeout` followed by a `requestAnimationFrame`, so consumers always see the most recent committed value while frequent writers (text inputs, scroll handlers, ...) settle without thrashing reactivity.

## Importing

```ts
import { useDebouncedRef } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useDebouncedRef } from '@basmilius/common';

    const search = useDebouncedRef('', 250);

    // Use in a template:
    // <input v-model="search"/>
    //
    // The bound value updates immediately on each keystroke,
    // but `search.value` only reflects the latest write after 250 ms.
</script>
```

You can also bind it to an existing ref so the debounced ref tracks the source.

```ts
import { ref } from 'vue';
import { useDebouncedRef } from '@basmilius/common';

const source = ref('');
const debounced = useDebouncedRef(source, 200);
```

Passing `immediate = true` runs the underlying setter once on the leading edge before debouncing the trailing calls.

## Type signature

```ts
declare function useDebouncedRef<T>(
    initialValue: Ref<T> | T,
    delay: number,
    immediate?: boolean
): Ref<T>;
```

## See also

- [`useDebounced`](/common/composable/useDebounced)
- [`useLoaded`](/common/composable/useLoaded) — uses `useDebouncedRef` internally to debounce the loading flag
