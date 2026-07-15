<template>
    <template v-if="validationKey in errors">
        <FluxNotice
            color="danger"
            icon="circle-exclamation"
            :message="errors[validationKey]"/>
    </template>
</template>

<script
    lang="ts"
    setup>
    import { FluxNotice } from '@flux-ui/components';
    import { inject } from 'vue';
    import { createValidationContext } from '../composable/useValidation';
    import { CONTEXT } from '../core/context';

    defineProps<{
        readonly validationKey: string;
    }>();

    const context = inject(CONTEXT, null) ?? createValidationContext();
    const {errors} = context;
</script>
