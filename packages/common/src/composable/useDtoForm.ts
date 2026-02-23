import { cloneDto, markDtoClean } from '@basmilius/http-client';
import { ref, type Ref, watch } from 'vue';

export default function <T>(dtoRef: Ref<T | null>) {
    const form = ref<T>();

    watch(dtoRef, dto => {
        if (!dto) {
            return;
        }

        form.value = cloneDto(dto);
        markDtoClean(form.value);
    }, {immediate: true});

    return form;
}
