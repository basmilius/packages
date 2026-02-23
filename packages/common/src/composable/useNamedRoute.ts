import { computed, type ComputedRef, provide, type Ref, unref } from 'vue';
import { type RouteLocationNormalizedLoadedGeneric, useRoute, viewDepthKey } from 'vue-router';

export default function (nameRef: Ref<string> | string): UseNamedRoute {
    const route = useRoute();

    const depth = computed(() => route.matched.findIndex(m => !!m.components && unref(nameRef) in m.components));
    const matched = computed(() => route.matched[unref(depth)]);
    const viewKey = computed(() => unref(matched)?.path);

    provide(viewDepthKey, depth);

    return {
        route,
        viewKey
    };
}

type UseNamedRoute = {
    readonly route: RouteLocationNormalizedLoadedGeneric;
    readonly viewKey: ComputedRef<string | undefined>;
};
