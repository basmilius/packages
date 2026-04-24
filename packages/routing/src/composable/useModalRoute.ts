import { computed, type ComputedRef, inject, unref } from 'vue';
import { type RouteLocationNormalized, useRoute as useVueRoute } from 'vue-router';
import { isInModalKey, modalContextKey, routeOverrideKey } from '../symbol';

// note: Surfaces the route driving the currently active modal.
//  - Inside a `ModalProvider` subtree (anywhere below the wrapper
//    component) `isInModalKey` is `true` and `routeOverrideKey` is the
//    modal route ref. `BackgroundProvider` also provides
//    `routeOverrideKey`, so `routeOverrideKey` alone is not enough to
//    distinguish the modal from the background — `isInModalKey` is the
//    discriminator.
//  - Outside the modal subtree we fall back to the router's live
//    currentRoute whenever a modal is active. That's the "top" route
//    (the one driving the modal); the background route is stashed on
//    the context. This lets higher-level layouts observe which modal
//    is showing without plumbing props.
//  - Returns `null` when no modal is active at all.
export default function (): ComputedRef<RouteLocationNormalized | null> {
    const override = inject(routeOverrideKey, null);
    const isInModal = inject(isInModalKey, null);
    const ctx = inject(modalContextKey, null);
    const rawRoute = useVueRoute();

    return computed(() => {
        // note: In a modal subtree — `override` IS the modal route.
        if (isInModal !== null && unref(isInModal) && override !== null) {
            return unref(override);
        }

        // note: Outside the modal subtree but a modal is active — the
        //  router's live currentRoute is the modal route, since the
        //  background is stored separately on the context.
        if (ctx !== null && unref(ctx.isModal)) {
            return rawRoute;
        }

        return null;
    });
}
