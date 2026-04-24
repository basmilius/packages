import type { ComputedRef, InjectionKey, Ref, ShallowRef } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';
import type { ModalContext } from './internal/modalContext';

export const modalContextKey: InjectionKey<ModalContext> = Symbol('basmilius:routing:modal-context');
export const routeOverrideKey: InjectionKey<ComputedRef<RouteLocationNormalized>> = Symbol('basmilius:routing:route-override');
export const isInModalKey: InjectionKey<Ref<boolean>> = Symbol('basmilius:routing:in-modal');

// note: Consumed by `ModalRouterView` to hold its internal `VueRouterView`
//  back by one tick on a user-triggered modal open. See `RouterView.ts`
//  for the rationale — the same gate that defers the fallback slot's
//  `h(VueRouterView)` extends to consumer templates that swap `<slot/>`
//  for `<ModalRouterView v-slot>`.
export const innerReadyKey: InjectionKey<ShallowRef<boolean>> = Symbol('basmilius:routing:inner-ready');
