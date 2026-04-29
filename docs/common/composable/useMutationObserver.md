---
outline: deep
---

# useMutationObserver

Attach a `MutationObserver` to an element ref. The observer is created when the ref resolves, disconnected when the ref changes or the component scope is disposed, and re-attached automatically when the ref points at a new element.

## Importing

```ts
import { useMutationObserver } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useTemplateRef } from 'vue';
    import { useMutationObserver } from '@basmilius/common';

    const target = useTemplateRef<HTMLDivElement>('target');

    useMutationObserver(target, mutations => {
        for (const mutation of mutations) {
            console.log('mutation', mutation);
        }
    }, {
        attributes: true,
        attributeFilter: ['data-state']
    });
</script>

<template>
    <div ref="target" data-state="idle">Watch me</div>
</template>
```

The string passed to `useTemplateRef` must match the `ref="…"` attribute on the template node. The returned `ShallowRef` is `null` until the component mounts.

When `options` is omitted, the observer is created with `{ attributes: true }`. Component refs are unwrapped via [`unwrapElement`](/common/util/unwrapElement), so passing a component instance ref works as well.

## Type signature

```ts
type EligibleElement = HTMLElement | ComponentPublicInstance;

declare function useMutationObserver<TElement extends EligibleElement>(
    elementRef: Ref<TElement | null>,
    callback: MutationCallback,
    options?: MutationObserverInit
): void;
```

## See also

- [`useResizeObserver`](/common/composable/useResizeObserver)
- [`useClickOutside`](/common/composable/useClickOutside)
- [`unwrapElement`](/common/util/unwrapElement)
