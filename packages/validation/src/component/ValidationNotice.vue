<template>
    <FluxPaneBody v-if="paneBody && invalid">
        <FluxNotice
            v-if="GLOBAL_ERROR_KEY in errors"
            color="danger"
            icon="circle-exclamation"
            is-closeable
            :message="errors[GLOBAL_ERROR_KEY]"
            @close="reset()"/>

        <FluxNotice
            v-else
            color="danger"
            icon="circle-exclamation"
            is-closeable
            :message="message ?? notice"
            @close="reset()"/>
    </FluxPaneBody>

    <FluxNotice
        v-else-if="GLOBAL_ERROR_KEY in errors"
        color="danger"
        icon="circle-exclamation"
        is-closeable
        :message="errors[GLOBAL_ERROR_KEY]"
        @close="reset()"/>

    <FluxNotice
        v-else-if="invalid"
        color="danger"
        icon="circle-exclamation"
        is-closeable
        :message="message ?? notice"
        @close="reset()"/>

    <slot v-else/>
</template>

<script
    lang="ts"
    setup>
    import { FluxNotice, FluxPaneBody } from '@flux-ui/components';
    import { computed, inject } from 'vue';
    import { createValidationContext, GLOBAL_ERROR_KEY } from '../composable/useValidation';
    import { translate } from '../config';
    import { CONTEXT } from '../core/context';

    defineProps<{
        readonly message?: string;
        readonly paneBody?: boolean;
    }>();

    const context = inject(CONTEXT, null) ?? createValidationContext();
    const {errors, invalid, reset} = context;

    const notice = computed(() => translate('validator.notice'));
</script>
