---
outline: deep
---

# useInView

Track whether an element is in the viewport using an `IntersectionObserver`. Returns a `Ref<boolean>` that flips to `true` while the element intersects the root and back to `false` when it leaves. The observer is created when the ref resolves, disconnected when the ref changes or the component scope is disposed, and re-attached automatically when the ref points at a new element.

## Demo

::: example
example=./examples/UseInView.vue
:::

## Importing

```ts
import { useInView } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useTemplateRef } from 'vue';
    import { useInView } from '@basmilius/common';

    const target = useTemplateRef<HTMLDivElement>('target');
    const isInView = useInView(target, {
        threshold: 0.5
    });
</script>

<template>
    <div ref="target" :class="{visible: isInView}">
        {{ isInView ? 'In view' : 'Out of view' }}
    </div>
</template>
```

The target may be a template ref, a raw `HTMLElement` or a component ref; component refs are unwrapped via [`unwrapElement`](/common/util/unwrapElement).

Options mirror `IntersectionObserverInit` (`root`, `rootMargin`, `threshold`) with one addition: set `once` to `true` to stop observing as soon as the element has been in view once — handy for reveal-on-scroll animations and lazy loading.

```ts
const seen = useInView(target, {once: true});
```

## Type signature

```ts
type EligibleElement = HTMLElement | ComponentPublicInstance;

type UseInViewOptions = {
    readonly root?: Element | Document | null;
    readonly rootMargin?: string;
    readonly threshold?: number | number[];
    readonly once?: boolean;
};

declare function useInView<TElement extends EligibleElement>(
    target: MaybeRefOrGetter<TElement | null | undefined>,
    options?: UseInViewOptions
): Ref<boolean>;
```

## See also

- [`useResizeObserver`](/common/composable/useResizeObserver)
- [`unwrapElement`](/common/util/unwrapElement)
- [`useEventListener`](/common/composable/useEventListener)
