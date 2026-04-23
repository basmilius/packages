import type { Component } from 'vue';
import type { RouterOptions as VueRouterOptions } from 'vue-router';

export type ModalConfig = {
    readonly component: Component;
    readonly props?: Record<string, unknown>;
};

// note: Our `RouterOptions` shadows the one from `vue-router` via `index.ts`.
//  It extends the original shape with a single optional `defaultModal` used
//  as the fallback wrapper for modal-rendered routes that don't define their
//  own `meta.modal`.
export type RouterOptions = VueRouterOptions & {
    readonly defaultModal?: ModalConfig;
};
