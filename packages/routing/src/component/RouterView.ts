import { type Component, defineComponent, Fragment, h, inject, nextTick, onBeforeUnmount, provide, type Ref, shallowRef, unref, type VNodeChild, watch } from 'vue';
import { RouterView as VueRouterView, useRoute, useRouter, viewDepthKey } from 'vue-router';
import { BackgroundProvider, ModalProvider } from '../internal/RoutedView';
import resolveModal from '../internal/resolveModal';
import { innerReadyKey, modalContextKey, routeOverrideKey } from '../symbol';
import type { ModalConfig } from '../types';

const RouterView: Component = defineComponent({
    name: 'RouterView',
    inheritAttrs: false,
    props: {
        // note: Opts this instance in as the host that renders the modal
        //  layer on top of the background route. Exactly one `<RouterView>`
        //  in the tree should set this; if multiple do, the first to mount
        //  wins (others render vanilla and emit a console warning).
        modals: {
            type: Boolean,
            default: false
        }
    },
    setup(props, {attrs, slots}) {
        const ctx = inject(modalContextKey, null);
        const override = inject(routeOverrideKey, null);
        const route = useRoute();
        const router = useRouter();

        // note: Vue-router injects `viewDepthKey` from the parent
        //  `VueRouterView` (or 0 at the top). It can be a number or a
        //  `Ref<number>`; `unref` collapses both. Passed to
        //  `BackgroundProvider` so the background tree resumes at the
        //  correct matched index when this RouterView is nested.
        const injectedViewDepth = inject(viewDepthKey, 0);

        // note: Identity used to claim/release the modal host role on the
        //  shared `modalContext`. The matching unmount release targets
        //  exactly our claim — never a successor's.
        const hostId = Symbol('basmilius:routing:router-view-host');

        let isModalHost = false;

        if (props.modals && override === null && ctx) {
            isModalHost = ctx.claimHost(hostId);

            if (!isModalHost) {
                // eslint-disable-next-line no-console
                console.warn(
                    '[routing] Multiple <RouterView modals> instances detected. ' +
                    'The first mounted instance owns the modal host role; this ' +
                    'instance will render as a vanilla RouterView.'
                );
            } else {
                onBeforeUnmount(() => ctx.releaseHost(hostId));
            }
        }

        // note: Wrapper component (e.g. FluxOverlay) stays mounted across
        //  modal close for its leave animation, and is reused when
        //  consecutive modals share the same wrapper.
        const lastModal = shallowRef<ModalConfig | null>(null);

        // note: Held as a ref because Vue's runtime `h()` can miss
        //  primitive prop updates on `ModalProvider` when route changes
        //  patch in the same tick. Ref identity stays stable.
        const modalDepthRef: Ref<number> = shallowRef(0);

        // note: Gates whether the modal's inner `<RouterView>` is attached.
        //  On a user-triggered open we hold it back one tick so the
        //  wrapper's `<Transition>` observes "no child -> child" and plays
        //  its enter animation. On hard refresh of a modal URL we skip the
        //  gate so the page arrives already-open without animating.
        const innerReady = shallowRef(false);

        // note: Snapshot at setup — `modalContext` flips `initiallyOpen`
        //  back to `false` once the background route resolves, which is
        //  too early to read from the watcher below.
        const wasInitiallyOpen = ctx?.initiallyOpen.value ?? false;

        let hasSeenActiveModal = false;

        // note: Exposed so `ModalRouterView` inside consumer wrapper
        //  templates honours the same one-tick delay as the fallback slot.
        provide(innerReadyKey, innerReady);

        if (ctx && isModalHost) {
            watch(() => ctx.backgroundRoute.value !== null, async (isOpen) => {
                if (!isOpen) {
                    innerReady.value = false;

                    return;
                }

                const isFirstActivation = !hasSeenActiveModal;
                hasSeenActiveModal = true;

                // note: Pageload of a modal URL — wrapper and inner mount
                //  together without a transition.
                if (isFirstActivation && wasInitiallyOpen) {
                    innerReady.value = true;

                    return;
                }

                // note: User-triggered open — wrapper renders first with
                //  an empty slot, inner attaches next tick to animate in.
                innerReady.value = false;
                await nextTick();
                innerReady.value = true;
            }, {immediate: true, flush: 'pre'});
        }

        return (): VNodeChild => {
            // note: Already inside a BackgroundProvider / ModalProvider
            //  subtree — render vanilla so we don't recurse into another
            //  background/modal split.
            if (override !== null) {
                return h(VueRouterView, attrs, slots);
            }

            if (!ctx) {
                return h(VueRouterView, attrs, slots);
            }

            // note: Only the instance that claimed the host role renders
            //  modals. All others fall through to vanilla.
            if (!isModalHost) {
                return h(VueRouterView, attrs, slots);
            }

            const backgroundRoute = ctx.backgroundRoute.value;
            const modalActive = ctx.isModal.value && backgroundRoute !== null;

            // note: Resolve inline (not via watcher) — at setup the route
            //  is `START_LOCATION` with empty `matched`, so a watcher with
            //  `immediate: true` would miss the per-route `meta.modal`.
            if (modalActive) {
                const resolved = resolveModal(route, ctx.defaultModal);

                if (resolved !== null && resolved !== lastModal.value) {
                    lastModal.value = resolved;
                }
            }

            const wrapperConfig = lastModal.value;

            // note: Never been a modal here -> plain RouterView.
            if (!modalActive && !wrapperConfig) {
                return h(VueRouterView, attrs, slots);
            }

            // note: Background renders the stored route while open; the
            //  current route while closed (wrapper lingering for leave
            //  animation). Keeps layout-level `useRoute()` stable.
            const bgRoute = modalActive ? backgroundRoute : route;

            // note: `ctx.depth` is the user-supplied parent count. Translate
            //  to an absolute `matched[]` index:
            //    depth 0 -> matched[length - 1] (deepest only)
            //    depth N -> matched[length - 1 - N]
            const parentCount = ctx.depth.value;
            const viewDepth = Math.max(0, route.matched.length - 1 - parentCount);

            modalDepthRef.value = viewDepth;

            // note: ModalProvider wraps the wrapper component so the
            //  wrapper's internal Teleport still inherits the provider
            //  context. Inner is `undefined` while closed or gated, so
            //  the wrapper's `<Transition>` observes an empty slot.
            const modalInner = modalActive && innerReady.value
                ? h(VueRouterView)
                : undefined;

            const wrappedModalInner = wrapperConfig
                ? h(wrapperConfig.component, {
                    ...(wrapperConfig.props ?? {}),
                    // note: Runtime props after the spread so consumers
                    //  can't shadow them via `meta.modal.props`. Use
                    //  `modalReady` (not `modalActive`) to v-if the
                    //  inner `<ModalRouterView>` — `modalActive` is true
                    //  at mount and would skip the enter animation.
                    modalRoute: route,
                    modalActive,
                    modalReady: modalActive && innerReady.value,
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

            const hostViewDepth = unref(injectedViewDepth);

            return h(Fragment, [
                h(BackgroundProvider, {route: bgRoute, viewDepth: hostViewDepth}, {
                    default: (): VNodeChild => h(VueRouterView, attrs, slots)
                }),
                modalLayer
            ]);
        };
    }
});

export default RouterView;
