import { type Component, defineComponent, h, inject, type VNodeChild } from 'vue';
import { RouterView as VueRouterView } from 'vue-router';
import { innerReadyKey } from '../symbol';

// note: Thin wrapper around `VueRouterView` that honours the
//  `innerReadyKey` gate from our `RouterView`. Use this in wrapper
//  templates that need `v-slot` to animate push-navigations inside a
//  modal — vue-router's plain `RouterView` would mount in the same tick
//  as the wrapper and skip its enter animation. Outside a modal context
//  (no gate provided) it's a passthrough.
const ModalRouterView: Component = defineComponent({
    name: 'ModalRouterView',
    inheritAttrs: false,
    setup(_props, {attrs, slots}) {
        const innerReady = inject(innerReadyKey, null);

        return (): VNodeChild => {
            if (innerReady === null) {
                return h(VueRouterView, attrs, slots);
            }

            // note: Gate closed -> render nothing so the wrapper's
            //  `<Transition>` observes an empty slot on mount, then
            //  picks up the child once the gate flips.
            if (!innerReady.value) {
                return undefined;
            }

            return h(VueRouterView, attrs, slots);
        };
    }
});

export default ModalRouterView;
