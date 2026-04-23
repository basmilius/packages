import type { RouteLocationNormalized } from 'vue-router';
import type { ModalConfig } from '../types';

// note: Walks matched records from deepest to shallowest so nested child
//  routes can override the `meta.modal` of their parent. Falls back to the
//  `defaultModal` supplied to `createRouter()` when no matched record
//  declares one.
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
