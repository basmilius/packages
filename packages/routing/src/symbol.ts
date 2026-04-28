import type { ComputedRef, InjectionKey, Ref, ShallowRef } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';
import type { ModalContext } from './internal/modalContext';

export const modalContextKey: InjectionKey<ModalContext> = Symbol('basmilius:routing:modal-context');
export const routeOverrideKey: InjectionKey<ComputedRef<RouteLocationNormalized>> = Symbol('basmilius:routing:route-override');
export const isInModalKey: InjectionKey<Ref<boolean>> = Symbol('basmilius:routing:in-modal');

// note: Gates the modal's inner `<VueRouterView>` for one tick on a
//  user-triggered open so the wrapper's `<Transition>` plays the enter
//  animation. See `RouterView.ts` for the full rationale.
export const innerReadyKey: InjectionKey<ShallowRef<boolean>> = Symbol('basmilius:routing:inner-ready');
