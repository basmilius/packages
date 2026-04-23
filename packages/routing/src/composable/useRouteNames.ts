import { computed, type ComputedRef, unref } from 'vue';
import useRoute from './useRoute';

export default function (): ComputedRef<string[]> {
    const route = useRoute();

    return computed(() => {
        const names: string[] = [];

        unref(route).matched.forEach(m => m.name && names.push(m.name as string));

        return names;
    });
}
