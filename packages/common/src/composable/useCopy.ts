import { type Ref, unref } from 'vue';

export default function (contents: Ref<string>, onSuccess?: Function) {
    return async () => {
        await navigator.clipboard.writeText(unref(contents));
        onSuccess?.();
    };
}
