import type { App } from 'vue';
import { createRouter as createVueRouter, type Router } from 'vue-router';
import createModalContext from './internal/modalContext';
import patchRouter from './internal/patchRouter';
import { modalContextKey } from './symbol';
import type { RouterOptions } from './types';

export default function createRouter(options: RouterOptions): Router {
    const {defaultModal, ...routerOptions} = options;

    const router = createVueRouter(routerOptions);
    const original = patchRouter(router);
    const ctx = createModalContext(router, original, defaultModal ?? null);

    const originalInstall = router.install.bind(router);

    router.install = (app: App): void => {
        originalInstall(app);
        app.provide(modalContextKey, ctx);
    };

    return router;
}
