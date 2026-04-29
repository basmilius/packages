---
outline: deep
---

# Slot props

Modal wrappers receive a fixed set of runtime props from [`RouterView`](/routing/component/RouterView). This page documents what each prop is for and the recommended way to wire them up.

## Type

```ts
import type { ModalWrapperProps } from '@basmilius/routing';

type ModalWrapperProps = {
    readonly modalRoute: RouteLocationNormalized;
    readonly modalActive: boolean;
    readonly modalReady: boolean;
};
```

## modalRoute

The currently active modal route. Stable across the entire open-modal lifecycle. Useful when the wrapper needs to read params, query, meta, or matched records of the modal route specifically (rather than the background route the rest of the page sees).

```vue
<script
    setup
    lang="ts">
    import { computed } from 'vue';
    import type { ModalWrapperProps } from '@basmilius/routing';

    const props = defineProps<ModalWrapperProps>();

    const title = computed(() => props.modalRoute.meta.title as string | undefined);
</script>
```

## modalActive

`true` from the first render until the route stops being a modal. Drives the outer `<Transition>` — keep the wrapper mounted across the close animation by binding `v-if` (or `v-show`) to `modalActive`.

```vue
<Transition name="overlay">
    <div
        v-if="modalActive"
        class="overlay">
        <slot/>
    </div>
</Transition>
```

While `modalActive` is `true`, the wrapper should accept user interaction. While it is `false` (during the leave animation), inputs should be disabled — otherwise events from a half-faded UI mutate state for a route that is no longer present.

```vue
<script
    setup
    lang="ts">
    import type { ModalWrapperProps } from '@basmilius/routing';

    const props = defineProps<ModalWrapperProps>();
</script>

<template>
    <fieldset :disabled="!modalActive">
        <slot/>
    </fieldset>
</template>
```

## modalReady

Gate for the inner `<ModalRouterView>`. False at mount and during the close phase so the wrapper's inner `<Transition>` has an empty slot to animate from / to.

The package resets `modalReady` to `false` on close and ahead of any user-triggered open. On a hard refresh of a modal URL, `modalReady` becomes `true` synchronously so the modal arrives already-open without playing the enter animation.

```vue
<template>
    <Transition name="modal-inner">
        <ModalRouterView v-if="modalReady"/>
    </Transition>
</template>
```

::: warning
Do not bind the inner `v-if` to `modalActive`. `modalActive` is already `true` on mount, so the inner `<Transition>` would observe a "child -> child" change and skip its enter animation.
:::

## Closing the modal

`RouterView` installs a default `onClose` listener that calls `router.back()`. Wire it to user dismissals via `emit('close')`:

```vue
<script
    setup
    lang="ts">
    import type { ModalWrapperProps } from '@basmilius/routing';

    defineProps<ModalWrapperProps>();
    defineEmits<{
        (event: 'close'): void;
    }>();
</script>

<template>
    <div class="overlay" @click.self="$emit('close')">
        <slot/>
    </div>
</template>
```

If you need additional behaviour (an "are you sure?" confirmation, for example), intercept the emit and decide whether to call the parent listener.

## Inside the wrapper

Use [`useRoute`](/routing/composable/useRoute) to read the modal route — inside the modal subtree, `useRoute()` already returns the modal route and `.isModal` is `true`. Use [`useModalRoute`](/routing/composable/useModalRoute) when you specifically want the modal route from outside the modal subtree.

## See also

- [`ModalWrapperProps`](/routing/types#modalwrapperprops)
- [`ModalRouterView`](/routing/component/ModalRouterView)
- [Modal routing guide](/routing/guide/modal-routing)
