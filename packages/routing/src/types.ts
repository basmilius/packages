import type { Component } from 'vue';
import type { RouteLocationNormalized, RouterOptions as VueRouterOptions } from 'vue-router';

export type ModalConfig = {
    readonly component: Component;
    readonly props?: Record<string, unknown>;
};

// note: Props our `RouterView` passes to every modal wrapper component at
//  runtime. Declare them on your custom wrapper via
//  `defineProps<ModalWrapperProps>()` so the values reach the template
//  and the runtime props don't leak onto the wrapped component via
//  `$attrs` fallthrough.
//
//  `modalActive` — logical open/close flag. `true` while the modal is
//    opening or open, `false` during the close phase. Script-level use
//    (e.g. disabling inputs while closing).
//  `modalReady` — v-if gate for the inner `<ModalRouterView>`. Stays
//    `false` for the first render where the wrapper mounts so the
//    wrapper's internal `<Transition>` sees an empty slot at mount
//    time, then flips to `true` one tick later for the enter animation
//    to play. Also `false` during the close phase so the leave
//    animation has an empty slot to transition to.
export type ModalWrapperProps = {
    readonly modalRoute: RouteLocationNormalized;
    readonly modalActive: boolean;
    readonly modalReady: boolean;
};

// note: Our `RouterOptions` shadows the one from `vue-router` via `index.ts`.
//  It extends the original shape with a single optional `defaultModal` used
//  as the fallback wrapper for modal-rendered routes that don't define their
//  own `meta.modal`.
export type RouterOptions = VueRouterOptions & {
    readonly defaultModal?: ModalConfig;
};
