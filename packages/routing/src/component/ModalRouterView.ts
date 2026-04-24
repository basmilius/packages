import { type Component, defineComponent, h, inject, type VNodeChild } from 'vue';
import { RouterView as VueRouterView } from 'vue-router';
import { innerReadyKey } from '../symbol';

// note: Thin wrapper around `VueRouterView` that honours the
//  `innerReadyKey` gate installed by our `RouterView`. Consumers
//  that need the `v-slot` API to animate push-navigations inside a
//  modal use this instead of vue-router's `RouterView` directly —
//  otherwise the consumer's own `RouterView` would mount in the same
//  tick as the modal wrapper and Vue's `<Transition>` would skip its
//  enter animation (see `RouterView.ts` for the full story).
//
//  Outside a modal context (no `innerReadyKey` provided) this behaves
//  as a vanilla pass-through `VueRouterView` so it can be used freely
//  inside wrapper components without branching.
const ModalRouterView: Component = defineComponent({
    name: 'ModalRouterView',
    inheritAttrs: false,
    setup(_props, {attrs, slots}) {
        const innerReady = inject(innerReadyKey, null);

        return (): VNodeChild => {
            // note: No gate installed -> passthrough. Makes the component
            //  safe to use anywhere a plain `<RouterView>` would do.
            if (innerReady === null) {
                return h(VueRouterView, attrs, slots);
            }

            // note: Gate closed -> render nothing. The wrapper's internal
            //  `<Transition>` observes an empty slot on mount and on the
            //  next tick — once our `RouterView` flips the gate — picks up
            //  the new child and animates in.
            if (!innerReady.value) {
                return undefined;
            }

            return h(VueRouterView, attrs, slots);
        };
    }
});

export default ModalRouterView;
