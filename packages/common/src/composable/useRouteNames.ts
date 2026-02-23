import { computed, type ComputedRef } from 'vue';
import { useRoute } from 'vue-router';

export default function (): ComputedRef<string[]> {
    const route = useRoute();

    return computed(() => {
        const names: string[] = [];

        route.matched.forEach(m => m.name && names.push(m.name as string));

        return names;
    });
};
