import type { App } from 'vue';
import { createRouter as createVueRouter, type Router } from 'vue-router';
import createModalContext from './internal/modalContext';
import { readModalState } from './internal/modalState';
import patchRouter from './internal/patchRouter';
import { clearPendingModal, resolveToModal, stampModal } from './internal/pendingModal';
import { modalContextKey } from './symbol';
import type { RouterOptions } from './types';

export default function createRouter(options: RouterOptions): Router {
    const {defaultModal, ...routerOptions} = options;

    const router = createVueRouter(routerOptions);
    const original = patchRouter(router);
    const ctx = createModalContext(router, original, defaultModal ?? null);

    // note: Stamp `to.isModal` before user guards run. Registered first, so it
    //  precedes consumer `beforeEach` guards and the entering/update/resolve
    //  phases. `onBeforeRouteLeave` runs earlier still (vue-router phase 1) and
    //  is handled by our `onBeforeRouteLeave` wrapper.
    router.beforeEach((to, from) => {
        stampModal(to, resolveToModal());

        // note: Every committed route is stamped by `afterEach`; the only
        //  location that reaches a guard unstamped is `START_LOCATION` on the
        //  first navigation, which is never a modal background.
        if ((from as { isModal?: boolean }).isModal === undefined) {
            stampModal(from, false);
        }
    });

    // note: Definitive stamp once the navigation has committed — `history.state`
    //  now describes `to`, so `readModalState()` is authoritative. This makes
    //  `currentRoute.isModal` (and thereby the next navigation's `from`) correct.
    router.afterEach(to => {
        stampModal(to, readModalState() !== null);
        clearPendingModal();
    });

    const originalInstall = router.install.bind(router);

    router.install = (app: App): void => {
        originalInstall(app);
        app.provide(modalContextKey, ctx);
    };

    return router;
}
