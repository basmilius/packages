import { type Ref, ref, watch } from 'vue';

export default function (): UseLocalFile {
    const file = ref<File | null>(null);
    const url = ref<string | null>(null);

    const deleteFile = (): void => {
        file.value = null;
        url.value = null;
    };

    const uploadFile = (uploadedFile: File): void => {
        file.value = uploadedFile;
    };

    watch(file, (file, _, onCleanup) => {
        if (!file) {
            return;
        }

        url.value = URL.createObjectURL(file);

        onCleanup(() => {
            if (!url.value) {
                return;
            }

            URL.revokeObjectURL(url.value);
            url.value = null;
        });
    }, {immediate: true});

    return {
        file,
        url,

        delete: deleteFile,
        upload: uploadFile
    };
}

type UseLocalFile = {
    readonly file: Ref<File | null>;
    readonly url: Ref<string | null>;

    delete: () => void;
    upload: (uploadedFile: File) => void;
};
