import type { RouteLocationNormalized } from 'vue-router';
import type { ModalConfig } from '../types';

// note: Walks matched records deepest-first so children override their
//  parent's `meta.modal`. Falls back to `defaultModal` from
//  `createRouter()` when no record declares one.
export default function resolveModal(
    route: RouteLocationNormalized,
    fallback: ModalConfig | null
): ModalConfig | null {
    for (let i = route.matched.length - 1; i >= 0; --i) {
        const modal = route.matched[i]?.meta?.modal;

        if (modal) {
            return modal;
        }
    }

    return fallback;
}
