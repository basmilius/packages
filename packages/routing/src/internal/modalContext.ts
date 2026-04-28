import { computed, type ComputedRef, shallowRef, type ShallowRef, unref, watch } from 'vue';
import { loadRouteLocation, type RouteLocationNormalized, type Router } from 'vue-router';
import type { ModalConfig } from '../types';
import { readModalState, writeModalState } from './modalState';
import type { OriginalNav } from './patchRouter';

// note: True when all matched-record components are already materialised
//  (not still `() => import(...)` functions). Decides whether to assign
//  the background route synchronously or await `loadRouteLocation` first.
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
    // note: Symbol of the `<RouterView modals>` instance that owns the
    //  host role. `null` when no host is mounted — modals don't render.
    readonly host: ShallowRef<symbol | null>;

    promote(): Promise<void>;

    // note: Reserves the host role. Returns `true` when the role was free
    //  and is now ours; `false` when another instance got there first.
    claimHost(id: symbol): boolean;

    // note: Releases the host role only if `id` matches the current
    //  holder, so a late "loser" unmount can't reset the actual host.
    releaseHost(id: symbol): void;
};

export default function createModalContext(
    router: Router,
    original: OriginalNav,
    defaultModal: ModalConfig | null
): ModalContext {
    const initial = readModalState();

    // note: On hard refresh of a modal URL, the background route's lazy
    //  chunks aren't loaded yet — `components` are still import functions
    //  that Vue would render as promise vnodes inside `<Transition>`. We
    //  keep `backgroundRoute` null until `loadRouteLocation` materialises
    //  them, then assign once.
    const backgroundRoute = shallowRef<RouteLocationNormalized | null>(null);

    // note: Number of parent matched records (above the deepest) that
    //  render inside the modal wrapper. `0` renders only the deepest;
    //  higher values include ancestors as in-modal layout.
    const depth = shallowRef(initial?.depth ?? 0);

    // note: True between the first render (history.state already shows
    //  an open modal) and the moment the background route's async load
    //  settles. Wrappers can consume this to skip the opening transition.
    const initiallyOpen = shallowRef(initial !== null);

    const isModal = computed(() => unref(backgroundRoute) !== null);

    let loadToken = 0;

    // note: On refresh, await the background chunks before surfacing the
    //  background route. Already-cached chunks assign synchronously so
    //  the first render sees the open-modal state.
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

    // note: React to subsequent navigations. `flush: 'pre'` runs before
    //  render so RouterView picks up the new background the same tick.
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

        // note: Fast path — chunks already loaded (typical navigation),
        //  assign synchronously to avoid a flash of modal-as-fullpage.
        //  Slow path — hard refresh, await load to avoid promise vnodes.
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

        // note: Turns the modal's URL into the "real" page. `replace`
        //  avoids a duplicate history entry; `force: true` because
        //  vue-router otherwise skips a same-URL replace.
        await original.replace({
            path: current.fullPath,
            force: true,
            state: writeModalState(null, null)
        });
    }

    const host = shallowRef<symbol | null>(null);

    function claimHost(id: symbol): boolean {
        if (host.value !== null) {
            return false;
        }

        host.value = id;

        return true;
    }

    function releaseHost(id: symbol): void {
        if (host.value !== id) {
            return;
        }

        host.value = null;
    }

    return {
        isModal,
        backgroundRoute,
        depth,
        initiallyOpen,
        defaultModal,
        host,
        promote,
        claimHost,
        releaseHost
    };
}
