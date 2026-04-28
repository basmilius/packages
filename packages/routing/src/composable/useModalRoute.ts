import { computed, type ComputedRef, inject, unref } from 'vue';
import { type RouteLocationNormalized, useRoute as useVueRoute } from 'vue-router';
import { isInModalKey, modalContextKey, routeOverrideKey } from '../symbol';

// note: Surfaces the route driving the currently active modal, or `null`
//  when no modal is active. Inside a ModalProvider subtree the override
//  IS the modal route; outside, the router's live currentRoute is the
//  modal route (background is stashed on the context).
//  `BackgroundProvider` also sets `routeOverrideKey`, so `isInModalKey`
//  is the discriminator between background and modal subtrees.
export default function (): ComputedRef<RouteLocationNormalized | null> {
    const override = inject(routeOverrideKey, null);
    const isInModal = inject(isInModalKey, null);
    const ctx = inject(modalContextKey, null);
    const rawRoute = useVueRoute();

    return computed(() => {
        if (isInModal !== null && unref(isInModal) && override !== null) {
            return unref(override);
        }

        if (ctx !== null && unref(ctx.isModal)) {
            return rawRoute;
        }

        return null;
    });
}
