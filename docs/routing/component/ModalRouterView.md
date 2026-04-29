---
outline: deep
---

# ModalRouterView

Thin wrapper around `vue-router`'s `RouterView` that respects the modal host's `innerReady` gate. Use it inside wrapper components to host an animated child view.

## Importing

```ts
import { ModalRouterView } from '@basmilius/routing';
```

## Usage

```vue
<template>
    <Teleport to="body">
        <Transition name="overlay">
            <div
                v-if="modalActive"
                class="overlay">
                <Transition name="overlay-inner">
                    <ModalRouterView v-if="modalReady"/>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script
    setup
    lang="ts">
    import { ModalRouterView, type ModalWrapperProps } from '@basmilius/routing';

    defineProps<ModalWrapperProps>();
</script>
```

## Why ModalRouterView

`<RouterView>` from `vue-router` mounts in the same tick as its parent. When that parent is a modal wrapper using a `<Transition>`, the inner view never fires its enter animation — there is no "no child -> child" transition for `<Transition>` to observe.

`ModalRouterView` honours the host's one-tick gate (`innerReadyKey`):

- On user-triggered open the wrapper renders first with an empty slot; one tick later the gate flips and the inner view attaches, giving `<Transition>` a chance to play its enter animation.
- On hard refresh of a modal URL the gate is already `true` at mount, so the page arrives already-open without animating.
- When closing, the gate flips to `false` so the inner view leaves before the wrapper does.

Outside a modal context (no gate provided) `ModalRouterView` is a passthrough — it behaves like the vanilla `RouterView`.

## Props and slots

`ModalRouterView` forwards all attributes and slots to the underlying `<RouterView>`. Pair it with [`ModalWrapperProps.modalReady`](/routing/types#modalwrapperprops) for the right `v-if` semantics.

## See also

- [`RouterView`](/routing/component/RouterView)
- [`ModalWrapperProps`](/routing/types#modalwrapperprops)
- [Slot props guide](/routing/guide/slot-props)
- [Modal routing guide](/routing/guide/modal-routing)
