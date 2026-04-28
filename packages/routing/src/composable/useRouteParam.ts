import { type Ref, ref, unref, watch } from 'vue';
import useRoute from './useRoute';

export default function (name: string, defaultValue: string | null = null): Ref<string | null> {
    const route = useRoute();
    const param = ref<string | null>(null);

    // note: `defaultValue` applies on every read of a missing/empty
    //  param, not just at mount. The `immediate: true` flush handles
    //  the initial value so we don't duplicate the fallback logic.
    watch(() => unref(route).params[name] as string | undefined, (value) => {
        param.value = value || defaultValue;
    }, {immediate: true});

    return param;
}
