import type { ModalConfig } from './types';

declare module 'vue-router' {
    interface RouteLocationOptions {
        /**
         * Open this navigation as a modal on top of the current route.
         *  - `true` / `0` open the modal rendering only the deepest matched record.
         *  - A positive number N includes N parent records above the deepest one
         *    (useful when a nested route's layout should also render inside the
         *    modal wrapper).
         *  - `false` navigates without a modal.
         */
        modal?: boolean | number;
    }

    interface RouteMeta {
        /** Modal wrapper configuration used when this route is rendered as a modal. */
        modal?: ModalConfig;
    }
}

export {};
