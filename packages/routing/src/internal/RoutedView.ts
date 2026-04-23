import { type Component, computed, defineComponent, type PropType, provide, type Ref, shallowRef, type VNodeChild } from 'vue';
import { type RouteLocationNormalized, routerViewLocationKey, viewDepthKey } from 'vue-router';
import { isInModalKey, routeOverrideKey } from '../symbol';

const TRUE_REF = shallowRef(true);
const FALSE_REF = shallowRef(false);

// note: Both providers override vue-router's internal `routerViewLocationKey`
//  so any descendant `<RouterView>` renders `route` instead of the router's
//  live currentRoute. `viewDepthKey` is reset to 0 so the first RouterView
//  below the provider starts at matched[0]; nested RouterViews inside
//  components increment depth as usual.

export const BackgroundProvider: Component = defineComponent({
    name: 'BackgroundProvider',
    props: {
        route: {
            type: Object as PropType<RouteLocationNormalized>,
            required: true
        }
    },
    setup(props, {slots}) {
        const routeRef = computed(() => props.route);

        provide(routerViewLocationKey, routeRef);
        provide(viewDepthKey, 0);
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
        // note: Accept `depthRef` as a Ref<number> rather than a plain
        //  number prop. Vue's runtime `h(...)` prop diffing can miss
        //  primitive prop updates when the same component patches in a
        //  tight cycle together with reactive route changes; passing a
        //  ref sidesteps that because the ref identity stays stable and
        //  `.value` changes propagate through normal reactivity.
        depthRef: {
            type: Object as PropType<Ref<number>>,
            required: true
        }
    },
    setup(props, {slots}) {
        const routeRef = computed(() => props.route);

        provide(routerViewLocationKey, routeRef);
        // note: `viewDepthKey` tells the first `<RouterView>` below this
        //  provider at which index of `matched[]` to start rendering. We
        //  compute this in `RouterView` (see `component/RouterView.ts`) so
        //  the modal content skips parent records that are already rendered
        //  by the background tree.
        provide(viewDepthKey, props.depthRef);
        provide(routeOverrideKey, routeRef);
        provide(isInModalKey, TRUE_REF);

        return (): VNodeChild => slots.default?.();
    }
});
