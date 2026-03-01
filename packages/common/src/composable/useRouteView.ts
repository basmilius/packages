import { computed, type ComputedRef, type Ref, unref } from 'vue';
import { type RouteComponent, useRoute } from 'vue-router';

export default function (nameRef: Ref<string> | string): ComputedRef<RouteComponent | null> {
    const route = useRoute();

    return computed(() => {
        const name = unref(nameRef);

        for (const match of route.matched) {
            if (!match.components) {
                continue;
            }

            if (name in match.components) {
                return match.components[name];
            }
        }

        return null;
    });
}
