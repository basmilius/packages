---
outline: deep
---

# useScrollPosition

Track the scroll position of an element ref, a raw `HTMLElement`, `window` or `document`. Returns two reactive refs — `x` and `y` — that update on every `scroll` event and re-read when the target changes.

## Demo

::: example
example=./examples/UseScrollPosition.vue
:::

## Importing

```ts
import { useScrollPosition } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useScrollPosition } from '@basmilius/common';

    const {x, y} = useScrollPosition(window);
</script>

<template>
    <div class="indicator">Scrolled to {{ x }} × {{ y }}</div>
</template>
```

Pass a template ref to track a scrollable container instead of the viewport:

```vue
<script setup lang="ts">
    import { useTemplateRef } from 'vue';
    import { useScrollPosition } from '@basmilius/common';

    const scroller = useTemplateRef<HTMLDivElement>('scroller');
    const {y} = useScrollPosition(scroller);
</script>

<template>
    <div ref="scroller" class="scroller">
        <p :class="{shadow: y > 0}">…</p>
    </div>
</template>
```

For `window` the position comes from `scrollX` / `scrollY`, for `document` from `documentElement.scrollLeft` / `scrollTop`, and for elements from `scrollLeft` / `scrollTop`. The `scroll` listener is registered through [`useEventListener`](/common/composable/useEventListener) with `{ passive: true }`; element and component refs are unwrapped via [`unwrapTarget`](/common/util/unwrapTarget).

## Type signature

```ts
type EligibleTarget = HTMLElement | ComponentPublicInstance | Window | Document;

declare function useScrollPosition(
    target: MaybeRefOrGetter<EligibleTarget | null | undefined>
): {
    readonly x: Ref<number>;
    readonly y: Ref<number>;
};
```

## See also

- [`useEventListener`](/common/composable/useEventListener)
- [`unwrapTarget`](/common/util/unwrapTarget)
- [`useResizeObserver`](/common/composable/useResizeObserver)
