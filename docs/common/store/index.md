---
outline: deep
---

# Store

A thin layer on top of [Pinia](https://pinia.vuejs.org/) that returns refs by default. The package re-exports the pieces of Pinia you need to bootstrap an app, and adds a `defineStore` helper that wraps Pinia's setup-style stores so callers automatically receive `Ref` bindings instead of having to call `storeToRefs` themselves.

## Exports

| Export            | Origin                | Description                                                       |
| ----------------- | --------------------- | ----------------------------------------------------------------- |
| `defineStore`     | `@basmilius/common`   | Setup-style store that returns refs for state and direct values for actions and getters |
| `createPinia`     | `pinia` (re-export)   | Create the Pinia instance to install on your Vue app              |
| `getActivePinia`  | `pinia` (re-export)   | Retrieve the currently active Pinia instance                      |
| `setActivePinia`  | `pinia` (re-export)   | Set the active Pinia instance (useful in tests)                   |

## Defining a store

Use `defineStore(id, setup)` exactly like Pinia's setup syntax. The composable returned by `defineStore` does the bookkeeping: it instantiates the Pinia store, calls `storeToRefs` for state/getters, and copies actions through unchanged.

```ts
import { ref } from 'vue';
import { defineStore } from '@basmilius/common';

export const useCounterStore = defineStore('counter', () => {
    const count = ref(0);

    function increment(): void {
        count.value += 1;
    }

    return {
        count,
        increment
    };
});
```

```vue
<script setup lang="ts">
    import { useCounterStore } from '@/stores/counter';

    const {
        count,
        increment
    } = useCounterStore();
</script>

<template>
    <button @click="increment">{{ count }}</button>
</template>
```

Properties prefixed with `$` or `_` (Pinia internals such as `$state`, `$patch`, `_p`) are filtered out of the returned object.

## Bootstrapping Pinia

```ts
import { createApp } from 'vue';
import { createPinia } from '@basmilius/common';
import App from './App.vue';

const app = createApp(App);
app.use(createPinia());
app.mount('#app');
```

## Type signature

```ts
declare function defineStore<
    Id extends string,
    Setup extends (...args: any[]) => any,
    Context = ReturnType<Setup>
>(
    id: Id,
    setup: Setup
): () => Context;
```
