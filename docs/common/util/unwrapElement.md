---
outline: deep
---

# unwrapElement

Resolve a `MaybeRef` to either an `HTMLElement` or `null`. The helper unwraps refs and follows component-instance proxies via `instance.$el`, so a ref pointing at a Vue component or an HTML element behaves the same way.

This is the building block behind [`useClickOutside`](/common/composable/useClickOutside), [`useMutationObserver`](/common/composable/useMutationObserver) and [`useResizeObserver`](/common/composable/useResizeObserver). Reach for it whenever you author your own DOM-bound composable.

## Importing

```ts
import { unwrapElement } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { onMounted, useTemplateRef } from 'vue';
    import { unwrapElement } from '@basmilius/common';

    const target = useTemplateRef<HTMLInputElement>('target');

    onMounted(() => {
        const element = unwrapElement(target);
        if (element) {
            element.focus();
        }
    });
</script>

<template>
    <input ref="target"/>
</template>
```

`useTemplateRef` was added in Vue 3.5 — pair it with `unwrapElement` whenever a composable expects an element (since component refs need to be flattened to their underlying DOM node).

The check leans on `isHtmlElement` from [`@basmilius/utils`](/utils/dom/) — values that are already plain `HTMLElement` instances pass through unchanged.

## Type signature

```ts
type EligibleElement = HTMLElement | ComponentPublicInstance;

declare function unwrapElement<TElement extends EligibleElement>(
    elementRef: MaybeRef<TElement | null | undefined>
): HTMLElement | null;
```

## See also

- [`useClickOutside`](/common/composable/useClickOutside)
- [`useMutationObserver`](/common/composable/useMutationObserver)
- [`useResizeObserver`](/common/composable/useResizeObserver)
