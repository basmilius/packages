import type { RouteLocationNormalized } from 'vue-router';
import { readModalState } from './modalState';

type Stampable = { isModal: boolean };

// note: The intended modal status of the in-flight programmatic navigation,
//  captured by `patchRouter` before vue-router's guard pipeline runs. `null`
//  for browser back/forward (popstate) and the initial load, where the
//  destination's modal status is instead read from `history.state` — already
//  the target entry at guard time. Module singleton, like `modalState`: there
//  is one global history and one navigation in flight at a time.
let pendingModal: boolean | null = null;

export function setPendingModal(value: boolean): void {
    pendingModal = value;
}

export function clearPendingModal(): void {
    pendingModal = null;
}

// note: Modal status of the navigation target while it is still pending (read
//  inside a guard, before the navigation commits). Programmatic navigations
//  carry an explicit decision via `pendingModal`; popstate/initial loads have
//  none, so fall back to `history.state`, which the browser already points at
//  the destination during those guards.
export function resolveToModal(): boolean {
    if (pendingModal !== null) {
        return pendingModal;
    }

    return readModalState() !== null;
}

// note: Writes the read-only `isModal` flag onto a route location. The cast
//  drops `readonly` for this single trusted assignment.
export function stampModal(route: RouteLocationNormalized, value: boolean): void {
    (route as Stampable).isModal = value;
}
