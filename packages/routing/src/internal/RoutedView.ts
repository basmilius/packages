import { type Component, computed, defineComponent, type PropType, provide, type Ref, shallowRef, type VNodeChild } from 'vue';
import { type RouteLocationNormalized, routerViewLocationKey, viewDepthKey } from 'vue-router';
import { isInModalKey, routeOverrideKey } from '../symbol';

const TRUE_REF = shallowRef(true);
const FALSE_REF = shallowRef(false);

// note: Both providers override `routerViewLocationKey` so descendant
//  `<RouterView>`s render the supplied `route` instead of the router's
//  live currentRoute. `viewDepthKey` is set to the index at which the
//  inner `VueRouterView` should resume in `matched[]` — for
//  `BackgroundProvider`, the host's own depth (so a nested host doesn't
//  re-render its ancestors); for `ModalProvider`, the absolute matched
//  index computed by RouterView from `ctx.depth`.

export const BackgroundProvider: Component = defineComponent({
    name: 'BackgroundProvider',
    props: {
        route: {
            type: Object as PropType<RouteLocationNormalized>,
            required: true
        },
        viewDepth: {
            type: Number,
            default: 0
        }
    },
    setup(props, {slots}) {
        const routeRef = computed(() => props.route);

        provide(routerViewLocationKey, routeRef);
        provide(viewDepthKey, props.viewDepth);
        provide(routeOverrideKey, routeRef);
        provide(isInModalKey, FALSE_REF);

        return (): VNodeChild => slots.default?.();
    }
});

export const ModalProvider: Component = defineComponent({
    name: 'ModalProvider',
    props: {
        route: {
            type: Object as PropType<RouteLocationNormalized>,
            required: true
        },
        // note: Ref instead of a plain number — Vue's runtime `h()` prop
        //  diffing can miss primitive updates when patching in a tight
        //  cycle alongside reactive route changes. Ref identity stays
        //  stable; `.value` propagates through normal reactivity.
        depthRef: {
            type: Object as PropType<Ref<number>>,
            required: true
        }
    },
    setup(props, {slots}) {
        const routeRef = computed(() => props.route);

        provide(routerViewLocationKey, routeRef);
        provide(viewDepthKey, props.depthRef);
        provide(routeOverrideKey, routeRef);
        provide(isInModalKey, TRUE_REF);

        return (): VNodeChild => slots.default?.();
    }
});
