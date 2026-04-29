---
outline: deep
---

# useClickOutside

Run a handler whenever a `pointerdown` happens outside one or more elements. Useful for closing dropdowns, popovers and modal-like UI without binding `click` listeners on every other element on the page.

## Importing

```ts
import { useClickOutside } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import { useClickOutside } from '@basmilius/common';

    const trigger = useTemplateRef<HTMLButtonElement>('trigger');
    const popover = useTemplateRef<HTMLDivElement>('popover');
    const open = ref(false);

    useClickOutside([trigger, popover], open, () => {
        open.value = false;
    });
</script>

<template>
    <button ref="trigger" @click="open = !open">Toggle</button>
    <div v-if="open" ref="popover">Popover content</div>
</template>
```

`useTemplateRef('name')` returns a `ShallowRef` whose `.value` is the element matching `ref="name"` once the component mounts. It is the recommended way to wire template refs since Vue 3.5.

The handler only runs while `enabled` is truthy. Pass a `Ref<boolean>` to react to changes (for example a "popover is open" flag) or `true` for an always-on listener.

A single ref or an array of refs is accepted. Component refs are unwrapped with [`unwrapElement`](/common/util/unwrapElement), so passing component instances works out of the box.

## Type signature

```ts
type EligibleElement = HTMLElement | ComponentPublicInstance;
type Handler = ((evt: PointerEvent) => void) | ((evt: PointerEvent) => Promise<void>);

declare function useClickOutside<TElement extends EligibleElement>(
    elementRefs: Ref<TElement | null> | Ref<TElement | null>[],
    enabled: boolean | Ref<boolean>,
    onOutsideClick: Handler
): void;
```

## See also

- [`unwrapElement`](/common/util/unwrapElement)
- [`useMutationObserver`](/common/composable/useMutationObserver)
- [`useResizeObserver`](/common/composable/useResizeObserver)
