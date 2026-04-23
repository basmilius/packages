import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';
import type { ModalContext } from './internal/modalContext';

export const modalContextKey: InjectionKey<ModalContext> = Symbol('basmilius:routing:modal-context');
export const routeOverrideKey: InjectionKey<ComputedRef<RouteLocationNormalized>> = Symbol('basmilius:routing:route-override');
export const isInModalKey: InjectionKey<Ref<boolean>> = Symbol('basmilius:routing:in-modal');
