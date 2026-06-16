---
outline: deep
---

<script setup lang="ts">
    import UseEventListenerGlobal from './examples/UseEventListenerGlobal.vue';
</script>

# useEventListener

Attach an event listener to an element ref, a raw `HTMLElement`, `window` or `document`. The listener is bound when the target resolves, detached when the target changes or the component scope is disposed, and re-attached automatically when the target points at something new. A `stop` function is returned to detach manually.

## Demo

::: example
example=./examples/UseEventListener.vue
:::

### Global targets

`window` and `document` are valid targets too. Because reading `window.innerWidth` during component setup touches a browser global, the demo component is wrapped in VitePress' built-in `<ClientOnly>` so it only renders in the browser:

<ClientOnly>
    <UseEventListenerGlobal/>
</ClientOnly>

```vue
<script setup lang="ts">
    import { ref } from 'vue';
    import { useEventListener } from '@basmilius/common';

    const width = ref(window.innerWidth);
    const height = ref(window.innerHeight);
    const lastKey = ref('—');

    useEventListener(window, 'resize', () => {
        width.value = window.innerWidth;
        height.value = window.innerHeight;
    });

    useEventListener(document, 'keydown', evt => {
        lastKey.value = evt.key;
    });
</script>
```

## Importing

```ts
import { useEventListener } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import { useEventListener } from '@basmilius/common';

    const button = useTemplateRef<HTMLButtonElement>('button');
    const clicks = ref(0);

    useEventListener(button, 'click', () => {
        clicks.value++;
    });

    useEventListener(window, ['resize', 'orientationchange'], () => {
        console.log('viewport changed');
    });
</script>

<template>
    <button ref="button">Clicked {{ clicks }} times</button>
</template>
```

The target may be a template ref, a raw `HTMLElement`, `window` or `document`. Element and component refs are unwrapped via [`unwrapTarget`](/common/util/unwrapTarget), so passing a component instance works as well.

Pass a single event name or an array of names. The third argument is the listener; the event object is typed against the combined DOM event maps, so `evt` is inferred from the event name. The optional fourth argument accepts the standard `addEventListener` options (`{ passive: true }`, `{ capture: true }`, …).

```ts
const stop = useEventListener(document, 'keydown', evt => {
    if (evt.key === 'Escape') {
        stop();
    }
});
```

Cleanup happens automatically on scope dispose; call the returned `stop` only when you want to detach earlier.

## Type signature

```ts
type EligibleTarget = HTMLElement | ComponentPublicInstance | Window | Document;
type EventMap = HTMLElementEventMap & WindowEventMap & DocumentEventMap;

declare function useEventListener<TType extends keyof EventMap>(
    target: MaybeRefOrGetter<EligibleTarget | null | undefined>,
    type: TType | TType[],
    listener: (evt: EventMap[TType]) => void,
    options?: boolean | AddEventListenerOptions
): () => void;
```

## See also

- [`useScrollPosition`](/common/composable/useScrollPosition)
- [`unwrapTarget`](/common/util/unwrapTarget)
- [`useClickOutside`](/common/composable/useClickOutside)
