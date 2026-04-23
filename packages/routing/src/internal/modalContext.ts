import { computed, type ComputedRef, shallowRef, type ShallowRef, unref, watch } from 'vue';
import { loadRouteLocation, type RouteLocationNormalized, type Router } from 'vue-router';
import type { ModalConfig } from '../types';
import { readModalState, writeModalState } from './modalState';
import type { OriginalNav } from './patchRouter';

// note: Returns true when every component on every matched record is
//  already materialised (i.e. not a `() => import(...)` function). Used to
//  decide whether we can assign a background route synchronously (no
//  flicker) or need to await `loadRouteLocation` first (refresh path).
function isFullyLoaded(route: RouteLocationNormalized): boolean {
    for (const record of route.matched) {
        if (!record.components) {
            continue;
        }

        for (const name in record.components) {
            const component = record.components[name];

            if (typeof component === 'function' && !('displayName' in component)) {
                return false;
            }
        }
    }

    return true;
}

export type ModalContext = {
    readonly isModal: ComputedRef<boolean>;
    readonly backgroundRoute: ShallowRef<RouteLocationNormalized | null>;
    readonly depth: ShallowRef<number>;
    readonly initiallyOpen: ShallowRef<boolean>;
    readonly defaultModal: ModalConfig | null;

    promote(): Promise<void>;
};

export default function createModalContext(
    router: Router,
    original: OriginalNav,
    defaultModal: ModalConfig | null
): ModalContext {
    const initial = readModalState();

    // note: On a hard refresh of a modal URL the background route's lazy
    //  chunks aren't loaded yet (the HTML only knows about the modal's
    //  URL). If we assigned a synchronously-resolved snapshot to
    //  `backgroundRoute`, its records' `components` would still be
    //  `() => import(...)` functions on first render — and VueRouter
    //  renders those as the component type directly, producing a promise
    //  vnode that Vue's <Transition> chokes on. We instead keep
    //  `backgroundRoute` null until `loadRouteLocation` has materialised
    //  the components, then assign once.
    const backgroundRoute = shallowRef<RouteLocationNormalized | null>(null);

    // note: Number of parent matched records (above the deepest) that render
    //  inside the modal wrapper. `0` (default) renders only the deepest
    //  matched record; higher values include more ancestors — useful for
    //  routes whose parent provides a layout that should live inside the
    //  modal too.
    const depth = shallowRef(initial?.depth ?? 0);

    // note: True between the very first render (where history.state already
    //  shows an open modal) and the moment the async load of the background
    //  route settles. Wrapper components can consume this to suppress the
    //  opening transition on a hard refresh.
    const initiallyOpen = shallowRef(initial !== null);

    const isModal = computed(() => unref(backgroundRoute) !== null);

    let loadToken = 0;

    // note: On refresh, kick off the async load of the background route's
    //  lazy chunks. Only once it resolves do we surface the background route
    //  to consumers — keeping the modal-on-top-of-background illusion
    //  without the jank of rendering an unresolved function-component.
    //
    //  If the chunks happen to already be available (edge case; e.g. cached
    //  modules on a remount) we assign synchronously so the first render
    //  already sees the open-modal state.
    if (initial !== null) {
        const token = ++loadToken;
        const snapshot = router.resolve(initial.backgroundPath) as RouteLocationNormalized;

        if (isFullyLoaded(snapshot)) {
            backgroundRoute.value = snapshot;
            initiallyOpen.value = false;
        } else {
            loadRouteLocation(snapshot)
                .then(() => {
                    if (token !== loadToken) {
                        return;
                    }

                    backgroundRoute.value = router.resolve(initial.backgroundPath) as RouteLocationNormalized;
                    initiallyOpen.value = false;
                })
                .catch(() => {
                    if (token !== loadToken) {
                        return;
                    }

                    backgroundRoute.value = null;
                    initiallyOpen.value = false;
                });
        }
    }

    // note: React to subsequent navigations only — the initial state was
    //  applied synchronously above. `flush: 'pre'` runs before render, so
    //  the RouterView picks up the new background on the same tick.
    watch(router.currentRoute, () => {
        if (typeof history === 'undefined') {
            backgroundRoute.value = null;
            depth.value = 0;

            return;
        }

        const state = readModalState();

        if (state === null) {
            loadToken++;
            backgroundRoute.value = null;
            depth.value = 0;
            initiallyOpen.value = false;

            return;
        }

        depth.value = state.depth;

        const token = ++loadToken;
        const backgroundPath = state.backgroundPath;
        const snapshot = router.resolve(backgroundPath) as RouteLocationNormalized;

        // note: Fast path — when the background route's chunks are already
        //  loaded (typical navigation: user just came from that route) we
        //  assign synchronously so the modal appears on top of a stable
        //  background without a flash of the modal route rendered as a
        //  full page between navigation and background assignment.
        //
        //  Slow path — on a hard refresh the background chunks aren't
        //  loaded yet, so we wait for `loadRouteLocation` before assigning
        //  to avoid rendering an unresolved function-component (which Vue
        //  surfaces as a promise vnode inside `<Transition>`).
        if (isFullyLoaded(snapshot)) {
            backgroundRoute.value = snapshot;

            return;
        }

        loadRouteLocation(snapshot)
            .then(() => {
                if (token !== loadToken) {
                    return;
                }

                backgroundRoute.value = router.resolve(backgroundPath) as RouteLocationNormalized;
            })
            .catch(() => {
                if (token !== loadToken) {
                    return;
                }

                backgroundRoute.value = null;
            });
    }, {flush: 'pre'});

    async function promote(): Promise<void> {
        const current = unref(router.currentRoute);

        // note: Turns the modal's URL into the "real" page. We use `replace`
        //  to avoid a duplicate history entry, and `force: true` because
        //  vue-router otherwise treats a replace to the same URL as a
        //  duplicate navigation and skips it.
        await original.replace({
            path: current.fullPath,
            force: true,
            state: writeModalState(null, null)
        });
    }

    return {
        isModal,
        backgroundRoute,
        depth,
        initiallyOpen,
        defaultModal,
        promote
    };
}
