---
outline: deep
---

<script setup lang="ts">
    import UseComponentId from './examples/UseComponentId.vue';
</script>

# useComponentId

Return the unique identifier of the current component instance as a `ComputedRef<number>`. Handy when you need a stable id to wire up `aria-labelledby`, `for` / `id` pairs on form controls or any other DOM relationship that needs a unique value within a page.

## Demo

Each instance derives its own id from the Vue `uid`. Because that value differs between the server and the browser, the demo renders client-side only via `<ClientOnly>`:

<ClientOnly>
    <UseComponentId/>
</ClientOnly>

```vue
<script setup lang="ts">
    import { defineComponent, h, ref } from 'vue';
    import { useComponentId } from '@basmilius/common';

    const Row = defineComponent({
        setup() {
            const id = useComponentId();

            return () => h('div', null, `Component instance #${id.value}`);
        }
    });

    const rows = ref([0]);
    let next = 1;
</script>

<template>
    <button @click="rows.push(next++)">Add instance</button>
    <Row v-for="row in rows" :key="row"/>
</template>
```

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
