import { type Component, defineComponent, h, inject, type VNodeChild } from 'vue';
import { RouterView as VueRouterView } from 'vue-router';
import { innerReadyKey, modalViewNameKey } from '../symbol';

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
        const modalViewName = inject(modalViewNameKey, null);

        // note: Adopt the modal host's resolved view name so named-view
        //  layouts (e.g. `overlay`) render inside the wrapper. Skipped when
        //  the consumer set an explicit `name` or the host resolved none.
        function resolveAttrs(): Record<string, unknown> {
            const name = modalViewName?.value;

            if (name === undefined || attrs.name !== undefined) {
                return attrs;
            }

            return {...attrs, name};
        }

        return (): VNodeChild => {
            if (innerReady === null) {
                return h(VueRouterView, resolveAttrs(), slots);
            }

            // note: Gate closed -> render nothing so the wrapper's
            //  `<Transition>` observes an empty slot on mount, then
            //  picks up the child once the gate flips.
            if (!innerReady.value) {
                return undefined;
            }

            return h(VueRouterView, resolveAttrs(), slots);
        };
    }
});

export default ModalRouterView;
