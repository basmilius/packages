import { type Component, defineComponent, Fragment, h, inject, nextTick, provide, type Ref, shallowRef, type VNodeChild, watch } from 'vue';
import { RouterView as VueRouterView, useRoute, useRouter } from 'vue-router';
import { BackgroundProvider, ModalProvider } from '../internal/RoutedView';
import resolveModal from '../internal/resolveModal';
import { innerReadyKey, modalContextKey, routeOverrideKey } from '../symbol';
import type { ModalConfig } from '../types';

const RouterView: Component = defineComponent({
    name: 'RouterView',
    inheritAttrs: false,
    setup(_props, {attrs, slots}) {
        const ctx = inject(modalContextKey, null);
        const override = inject(routeOverrideKey, null);
        const route = useRoute();
        const router = useRouter();

        // note: Remember the most-recently-resolved modal config. The wrapper
        //  component (FluxOverlay / FluxSlideOver / …) stays mounted across
        //  closes so its internal `<Transition>` can play the leave
        //  animation; the same wrapper is reused when consecutive modals
        //  share the same component (no remount, no animation glitch).
        const lastModal = shallowRef<ModalConfig | null>(null);

        // note: Owning the modal viewDepth as a ref in our setup sidesteps
        //  a subtle Vue runtime-`h()` quirk: when the render creates a new
        //  ModalProvider VNode in the same tick as a reactive route change,
        //  a plain numeric prop update can be missed. The ref identity is
        //  stable and its `.value` propagates through normal reactivity,
        //  so consumers of `viewDepthKey` always see the current value.
        const modalDepthRef: Ref<number> = shallowRef(0);

        // note: Controls whether the modal's inner `<RouterView>` is attached
        //  to the wrapper's default slot. When a user triggers an open,
        //  wrapper and inner would otherwise mount in the same tick — the
        //  wrapper's internal `<Transition>` then sees content on mount and
        //  skips the enter animation (Vue's default `appear: false`). By
        //  holding the inner back for one tick after the wrapper is in the
        //  tree, `<Transition>` observes "no child -> child" and plays the
        //  enter animation.
        //
        //  On a hard refresh of a modal URL we intentionally keep this `true`
        //  so both layers render together without an opening animation —
        //  the page is arriving already-open, a transition would look wrong.
        const innerReady = shallowRef(false);

        // note: Snapshot `initiallyOpen` at setup time. `modalContext` flips
        //  it back to `false` the moment the background route resolves, so
        //  reading it from the watcher below is already too late. The
        //  snapshot stays stable for the component's lifetime and tells us
        //  "this mount started from a modal URL", regardless of whether the
        //  background chunks loaded synchronously or asynchronously.
        const wasInitiallyOpen = ctx?.initiallyOpen.value ?? false;

        // note: Tracks whether we've ever observed an active modal. Combined
        //  with `wasInitiallyOpen`, this lets us distinguish the pageload
        //  path (first activation, arrived open) from the user-triggered
        //  path (first activation, opened mid-session) and from repeated
        //  opens (N-th activation, always animates).
        let hasSeenActiveModal = false;

        // note: Expose `innerReady` to descendants so `ModalRouterView`
        //  instances inside consumer wrapper templates honour the same
        //  one-tick delay as the fallback slot. Without this a consumer
        //  that swaps `<slot/>` for `<ModalRouterView v-slot>` would
        //  mount their own `VueRouterView` in the same tick as the
        //  wrapper, defeating the enter animation fix.
        provide(innerReadyKey, innerReady);

        if (ctx) {
            watch(() => ctx.backgroundRoute.value !== null, async (isOpen) => {
                if (!isOpen) {
                    // note: Modal closed (or never opened). Drop the inner so
                    //  a subsequent open is observed as "no child -> child"
                    //  by the wrapper's `<Transition>`.
                    innerReady.value = false;

                    return;
                }

                const isFirstActivation = !hasSeenActiveModal;
                hasSeenActiveModal = true;

                if (isFirstActivation && wasInitiallyOpen) {
                    // note: Pageload path — wrapper and inner mount together,
                    //  no transition. Matches user expectation that a direct
                    //  URL load of a modal shouldn't animate open.
                    innerReady.value = true;

                    return;
                }

                // note: User-triggered open. Let the wrapper render first
                //  with an empty slot so its `<Transition>` registers the
                //  "no child" state, then attach the inner on the next tick
                //  so the transition observes the change and animates in.
                innerReady.value = false;
                await nextTick();
                innerReady.value = true;
            }, {immediate: true, flush: 'pre'});
        }

        return (): VNodeChild => {
            // note: Inside a BackgroundProvider / ModalProvider subtree, a
            //  parent `<RouterView>` already injected the override. Behave
            //  as a vanilla RouterView so we don't recurse into another
            //  background/modal split.
            if (override !== null) {
                return h(VueRouterView, attrs, slots);
            }

            // note: No modal context installed -> vanilla. Library consumers
            //  that install the router via `app.use(router)` always get a
            //  context, so this branch mostly guards against misuse.
            if (!ctx) {
                return h(VueRouterView, attrs, slots);
            }

            const isOpen = ctx.isModal.value;
            const backgroundRoute = ctx.backgroundRoute.value;
            const modalActive = isOpen && backgroundRoute !== null;

            // note: Resolve the wrapper inline instead of via a watcher.
            //  A watcher with `immediate: true` fires during setup when
            //  `route` is still `START_LOCATION` (matched is empty), and
            //  `resolveModal` can't find the per-route `meta.modal` yet.
            //  Resolving here guarantees the current render already sees
            //  the correct wrapper once the async initial navigation
            //  completes and `route.matched` populates.
            if (modalActive) {
                const resolved = resolveModal(route, ctx.defaultModal);

                if (resolved !== null && resolved !== lastModal.value) {
                    lastModal.value = resolved;
                }
            }

            const wrapperConfig = lastModal.value;

            // note: Modal has never been active AND there's no wrapper to
            //  keep mounted -> vanilla RouterView. This is the normal path
            //  for routes that aren't part of any modal flow.
            if (!modalActive && !wrapperConfig) {
                return h(VueRouterView, attrs, slots);
            }

            // note: Background tree renders either the stored background
            //  route (modal currently open) or the actual current route
            //  (modal closed, wrapper lingering for its leave animation).
            //  Routing this way keeps layout-level `useRoute()` stable when
            //  a modal opens/closes.
            const bgRoute = modalActive ? backgroundRoute : route;

            // note: `ctx.depth` is the user-supplied parent count (how
            //  many matched records above the deepest should render
            //  inside the modal wrapper). Translate to `viewDepthKey`:
            //    depth 0 -> start at matched[length - 1] (deepest only)
            //    depth 1 -> start at matched[length - 2] (one parent)
            //    depth N -> start at matched[length - 1 - N]
            const parentCount = ctx.depth.value;
            const viewDepth = Math.max(0, route.matched.length - 1 - parentCount);

            modalDepthRef.value = viewDepth;

            // eslint-disable-next-line no-console
            console.log('[routing] RouterView render', {
                routePath: route.fullPath,
                routeMatched: route.matched.map(m => ({name: m.name, path: m.path})),
                routeMatchedLength: route.matched.length,
                parentCount,
                viewDepth,
                modalDepthRefValue: modalDepthRef.value,
                modalActive,
                bgPath: backgroundRoute?.fullPath
            });

            // note: `ModalProvider` wraps the wrapper component (not the
            //  other way around) so the provide/inject chain goes:
            //    ModalProvider -> Wrapper (FluxOverlay/FluxSlideOver) -> VueRouterView
            //  The wrapper itself uses Teleport internally; putting the
            //  provider outside means the teleported content still inherits
            //  the provider's context.
            //
            //  Modal content is only rendered while a modal is active AND
            //  `innerReady` has been flipped on. The `innerReady` gate
            //  defers the first attachment by one tick on user-triggered
            //  opens so the wrapper's `<Transition>` sees "no child ->
            //  child" and plays the enter animation. When closed, the
            //  slot is `undefined` which lets `createDialogRenderer`
            //  (FluxOverlay/FluxSlideOver) see an empty slot and play its
            //  leave transition.
            const modalInner = modalActive && innerReady.value
                ? h(VueRouterView)
                : undefined;

            const wrappedModalInner = wrapperConfig
                ? h(wrapperConfig.component, {
                    ...(wrapperConfig.props ?? {}),
                    // note: Runtime-supplied props are written after the
                    //  user-configured spread so consumers cannot
                    //  accidentally shadow them via `meta.modal.props`.
                    //
                    //  `modalRoute` gives the wrapper direct access to
                    //  the route driving the modal (handy for script
                    //  logic, transition keys, headings, etc.).
                    //
                    //  `modalActive` is the logical open/close flag —
                    //  true from the start of opening through the
                    //  beginning of closing. Useful for script-level
                    //  state (disable inputs on close, etc.) but NOT
                    //  for gating the inner `<ModalRouterView>` on a
                    //  user-triggered open: the first render has
                    //  `modalActive: true` in the same tick as the
                    //  wrapper mount, which would make the wrapper's
                    //  `<Transition>` see content at mount time and
                    //  skip the enter animation.
                    //
                    //  `modalReady` is the v-if flag consumers should
                    //  use. It's the AND of `modalActive` and the
                    //  internal one-tick gate, so it stays `false` for
                    //  exactly the render where the wrapper mounts —
                    //  giving the wrapper's `<Transition>` an empty
                    //  slot on mount and then the content one tick
                    //  later, which is what makes the enter animation
                    //  play.
                    modalRoute: route,
                    modalActive,
                    modalReady: modalActive && innerReady.value,
                    // note: FluxOverlay / FluxSlideOver and dialog-like
                    //  wrappers emit `close`. We hook into it so their
                    //  own close affordance (backdrop click, escape,
                    //  close button) navigates back automatically.
                    onClose: (): void => {
                        router.back();
                    }
                }, {
                    default: (): VNodeChild => modalInner
                })
                : modalInner;

            const modalLayer = h(ModalProvider, {route, depthRef: modalDepthRef}, {
                default: (): VNodeChild => wrappedModalInner
            });

            return h(Fragment, [
                h(BackgroundProvider, {route: bgRoute}, {
                    default: (): VNodeChild => h(VueRouterView, attrs, slots)
                }),
                modalLayer
            ]);
        };
    }
});

export default RouterView;
