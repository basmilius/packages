import { type Component, defineComponent, Fragment, h, inject, type Ref, shallowRef, type VNodeChild } from 'vue';
import { RouterView as VueRouterView, useRoute, useRouter } from 'vue-router';
import { BackgroundProvider, ModalProvider } from '../internal/RoutedView';
import resolveModal from '../internal/resolveModal';
import { modalContextKey, routeOverrideKey } from '../symbol';
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
            //  Modal content is only rendered while a modal is active;
            //  when closed, the wrapper's default slot is `undefined` which
            //  lets `createDialogRenderer` (FluxOverlay/FluxSlideOver) see
            //  an empty slot and play its leave transition.
            const modalInner = modalActive
                ? h(VueRouterView)
                : undefined;

            const wrappedModalInner = wrapperConfig
                ? h(wrapperConfig.component, {
                    ...(wrapperConfig.props ?? {}),
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
