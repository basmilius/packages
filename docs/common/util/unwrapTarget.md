---
outline: deep
---

# unwrapTarget

Resolve a `MaybeRefOrGetter` to an `HTMLElement`, `Window`, `Document` or `null`. Like [`unwrapElement`](/common/util/unwrapElement), it unwraps refs and follows component-instance proxies via `instance.$el`, but it additionally passes `Window` and `Document` through unchanged. Because it uses `toValue`, a raw value, a ref and a getter are all accepted.

This is the building block behind [`useEventListener`](/common/composable/useEventListener) and [`useScrollPosition`](/common/composable/useScrollPosition). Reach for it whenever you author a composable that may bind to the viewport as well as to an element.

## Demo

::: example
example=./examples/UnwrapTarget.vue
:::

## Importing

```ts
import { unwrapTarget } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { onMounted, useTemplateRef } from 'vue';
    import { unwrapTarget } from '@basmilius/common';

    const target = useTemplateRef<HTMLDivElement>('target');

    onMounted(() => {
        const element = unwrapTarget(target);
        element?.scrollTo({top: 0});
    });
</script>

<template>
    <div ref="target">…</div>
</template>
```

Passing `window` or `document` returns the value as-is, while element and component refs are flattened to their underlying DOM node. The element check leans on `isHtmlElement` from [`@basmilius/utils`](/utils/dom/).

## Type signature

```ts
type EligibleTarget = HTMLElement | ComponentPublicInstance | Window | Document;

declare function unwrapTarget(
    target: MaybeRefOrGetter<EligibleTarget | null | undefined>
): HTMLElement | Window | Document | null;
```

## See also

- [`unwrapElement`](/common/util/unwrapElement)
- [`useEventListener`](/common/composable/useEventListener)
- [`useScrollPosition`](/common/composable/useScrollPosition)
