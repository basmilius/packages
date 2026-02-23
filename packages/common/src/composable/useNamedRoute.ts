import { computed, provide, type Ref, unref } from 'vue';
import { useRoute, viewDepthKey } from 'vue-router';

export default function (nameRef: Ref<string> | string) {
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
