import type { Component } from 'vue';
import type { RouteLocationNormalized, RouterOptions as VueRouterOptions } from 'vue-router';

export type ModalConfig = {
    readonly component: Component;
    readonly props?: Record<string, unknown>;
};

// note: Props our `RouterView` passes to every modal wrapper component
//  at runtime. Declare on your wrapper via `defineProps<ModalWrapperProps>()`.
//  - `modalActive`: open/close flag for script-level use (disable inputs
//    while closing, etc.).
//  - `modalReady`: v-if gate for the inner `<ModalRouterView>`. False at
//    mount and during the close phase so the wrapper's `<Transition>` has
//    an empty slot to animate from / to.
export type ModalWrapperProps = {
    readonly modalRoute: RouteLocationNormalized;
    readonly modalActive: boolean;
    readonly modalReady: boolean;
};

// note: Shadows vue-router's `RouterOptions` via `index.ts`. Adds
//  `defaultModal` as the fallback wrapper for modal routes without
//  their own `meta.modal`.
export type RouterOptions = VueRouterOptions & {
    readonly defaultModal?: ModalConfig;
};

// note: Props on our `<RouterView>`. `modals` opts the instance in as
//  the host for the modal layer. Exactly one `<RouterView>` should set
//  it; multiple → first mount wins, others warn and render vanilla.
export type RouterViewProps = {
    readonly modals?: boolean;
};
