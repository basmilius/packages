import { type Ref, unref } from 'vue';

export default function (contents: Ref<string>, onSuccess?: Function): UseCopy {
    return async () => {
        await navigator.clipboard.writeText(unref(contents));
        onSuccess?.();
    };
}

type UseCopy = () => Promise<void>;
