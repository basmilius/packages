import { type Ref, ref, unref, watch } from 'vue';
import { useRoute } from 'vue-router';

export default function (name: string, defaultValue: string | null = null): Ref<string | null> {
    const route = useRoute();
    const param = ref<string | null>((unref(route).params[name] as string | undefined) ?? defaultValue);

    watch(() => unref(route).params[name], (value) => {
        param.value = (value || null) as string | null;
    }, {immediate: true});

    return param;
}
