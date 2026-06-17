import { type NavigationGuard, type NavigationGuardNext, onBeforeRouteLeave as vueOnBeforeRouteLeave } from 'vue-router';
import { resolveToModal, stampModal } from '../internal/pendingModal';

// note: vue-router auto-resolves a guard from its return value only when the
//  guard's arity is < 3; a guard that declares `next` is expected to call it
//  and the navigation blocks until it does. We must therefore mirror the user
//  guard's arity — wrap as 2-arity for return-value guards (the common case)
//  and forward `next` for callback-style ones. A fixed 3-arity wrapper would
//  hang every return-value guard, stalling all navigation.
const noop = ((): void => undefined) as NavigationGuardNext;

// note: Drop-in replacement for `vue-router`'s `onBeforeRouteLeave` that stamps
//  `to.isModal` before the user's guard runs. Leave guards execute in
//  vue-router's first phase, ahead of the global `beforeEach` that stamps `to`
//  for every later guard, so without this wrapper `to.isModal` would be unset
//  here. `from` is already stamped by the previous navigation's `afterEach`.
export default function onBeforeRouteLeave(guard: NavigationGuard): void {
    if (guard.length >= 3) {
        vueOnBeforeRouteLeave((to, from, next) => {
            stampModal(to, resolveToModal());

            return guard(to, from, next);
        });

        return;
    }

    vueOnBeforeRouteLeave((to, from) => {
        stampModal(to, resolveToModal());

        return guard(to, from, noop);
    });
}
