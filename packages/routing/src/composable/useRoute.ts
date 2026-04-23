import { computed, inject, shallowRef, unref } from 'vue';
import { type RouteLocationNormalizedLoaded, useRoute as useVueRoute } from 'vue-router';
import { isInModalKey, modalContextKey, routeOverrideKey } from '../symbol';

export type UseRoute = RouteLocationNormalizedLoaded & {
    readonly isModal: boolean;

    promote(): Promise<void>;
};

const FALSE_REF = shallowRef(false);
const NOOP = async (): Promise<void> => undefined;

export default function (): UseRoute {
    const override = inject(routeOverrideKey, null);
    const ctx = inject(modalContextKey, null);
    const isModalRef = inject(isInModalKey, FALSE_REF);
    const raw = useVueRoute();

    const routeRef = computed<RouteLocationNormalizedLoaded>(() => {
        // note: Inside a BackgroundProvider / ModalProvider subtree, use the
        //  explicit route override provided by the parent. This is what lets
        //  components rendered in the background tree see the background
        //  route, and components inside the modal wrapper see the modal
        //  route — independent of the router's live currentRoute.
        if (override !== null) {
            return unref(override) as RouteLocationNormalizedLoaded;
        }

        // note: Outside any provider (e.g. top-level layouts), surface the
        //  background route while a modal is open. This keeps layout-level
        //  `:key`s and state stable when a modal opens / closes.
        if (ctx !== null && unref(ctx.isModal)) {
            const bg = unref(ctx.backgroundRoute);

            if (bg !== null) {
                return bg as RouteLocationNormalizedLoaded;
            }
        }

        return raw;
    });

    const promote = ctx !== null ? ctx.promote : NOOP;

    // note: A Proxy (not a Ref) so the object can be used directly in
    //  templates without auto-unwrapping stripping our extras. All route
    //  properties flow through `routeRef.value`, which keeps reactivity
    //  tracking intact inside effects (templates, computeds, watchers).
    return new Proxy({} as UseRoute, {
        get(_target, key) {
            if (key === 'isModal') {
                return isModalRef.value;
            }

            if (key === 'promote') {
                return promote;
            }

            return (routeRef.value as unknown as Record<PropertyKey, unknown>)[key];
        },
        has(_target, key) {
            if (key === 'isModal' || key === 'promote') {
                return true;
            }

            return key in routeRef.value;
        },
        ownKeys(_target) {
            return [...Reflect.ownKeys(routeRef.value), 'isModal', 'promote'];
        },
        getOwnPropertyDescriptor(_target, key) {
            if (key === 'isModal') {
                return {configurable: true, enumerable: true, value: isModalRef.value};
            }

            if (key === 'promote') {
                return {configurable: true, enumerable: true, value: promote};
            }

            return Object.getOwnPropertyDescriptor(routeRef.value, key);
        }
    });
}
