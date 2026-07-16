---
outline: deep
---

# useMutationObserver

Attach a `MutationObserver` to an element ref. Consumers that observe the same element with the same options share a single `MutationObserver` instance under the hood. The element is observed when the ref resolves, unobserved when the ref changes or the component scope is disposed, and re-attached automatically when the ref points at a new element. A shared observer is disconnected once its last consumer is gone.

## Demo

::: example
example=./examples/UseMutationObserver.vue
:::

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

When `options` is omitted, the observer is created with `{ attributes: true }`. Options are compared structurally (order of keys and of `attributeFilter` entries does not matter) to decide whether an existing observer can be shared. Component refs are unwrapped via [`unwrapElement`](/common/util/unwrapElement), so passing a component instance ref works as well.

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
