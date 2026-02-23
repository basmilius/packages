import { computed, unref } from 'vue';
import useRouteNames from './useRouteNames';

export default function (name: string, loose: boolean = false) {
    const names = useRouteNames();

    if (loose) {
        return computed(() => unref(names).some(n => n.startsWith(name)));
    }

    return computed(() => unref(names).some(n => n === name));
}
