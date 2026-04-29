---
outline: deep
---

# useResizeObserver

Attach a `ResizeObserver` to an element ref. The observer is created when the ref resolves, disconnected when the ref changes or the component scope is disposed, and re-attached automatically when the ref points at a new element.

## Importing

```ts
import { useResizeObserver } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import { useResizeObserver } from '@basmilius/common';

    const target = useTemplateRef<HTMLDivElement>('target');
    const size = ref({width: 0, height: 0});

    useResizeObserver(target, entries => {
        for (const entry of entries) {
            const rect = entry.contentRect;
            size.value = {
                width: rect.width,
                height: rect.height
            };
        }
    });
</script>

<template>
    <div ref="target" class="container">
        Size: {{ size.width }} x {{ size.height }}
    </div>
</template>
```

`useTemplateRef('target')` is Vue 3.5's preferred way to obtain a template ref — it binds to the element that has `ref="target"` and returns a `ShallowRef` so the observer reattaches automatically when the underlying element changes.

Pass `ResizeObserverOptions` (e.g. `{ box: 'border-box' }`) when you need to opt into a different box model. Component refs are unwrapped via [`unwrapElement`](/common/util/unwrapElement).

## Type signature

```ts
type EligibleElement = HTMLElement | ComponentPublicInstance;

declare function useResizeObserver<TElement extends EligibleElement>(
    elementRef: Ref<TElement | null>,
    callback: ResizeObserverCallback,
    options?: ResizeObserverOptions
): void;
```

## See also

- [`useMutationObserver`](/common/composable/useMutationObserver)
- [`useClickOutside`](/common/composable/useClickOutside)
- [`unwrapElement`](/common/util/unwrapElement)
