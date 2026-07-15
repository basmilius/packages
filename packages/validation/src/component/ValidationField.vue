<template>
    <FluxFormField
        :current-length="currentLength"
        :hint="hint"
        :is-optional="isOptional"
        :label="label"
        :max-length="maxLength">
        <slot/>

        <template
            v-if="validationKey && validationKey in errors"
            #addition>
            <FluxFormFieldAddition
                icon="circle-exclamation"
                mode="error"
                :message="errors[validationKey]"/>
        </template>
    </FluxFormField>
</template>

<script
    lang="ts"
    setup>
    import { FluxFormField, FluxFormFieldAddition } from '@flux-ui/components';
    import { computed, inject, onMounted, toRef, unref, watch } from 'vue';
    import { createValidationContext } from '../composable/useValidation';
    import { CONTEXT } from '../core/context';
    import { asFieldValue } from '../core/fieldValue';
    import { toNamedRules } from '../core/namedRules';
    import { useScopedRegle } from '../core/scope';
    import type { ValidationRuleSet } from '../rules';

    const {
        rules,
        validationKey,
        value
    } = defineProps<{
        readonly currentLength?: number;
        readonly hint?: string;
        readonly isOptional?: boolean;
        readonly label: string;
        readonly maxLength?: number;
        readonly rules: ValidationRuleSet;
        readonly validationKey: string;
        readonly value?: unknown;
    }>();

    const context = inject(CONTEXT, null) ?? createValidationContext();
    const {errors} = context;

    useScopedRegle(
        {[validationKey]: toRef(() => asFieldValue(value))},
        computed(() => ({[validationKey]: toNamedRules(rules)})),
        {
            autoDirty: unref(context.live),
            namespace: context.namespace
        }
    );

    watch(toRef(() => value), () => context.clearServerError(validationKey));

    onMounted(() => {
        if (Object.entries(rules).length > 0) {
            return;
        }

        throw new Error('Validation field used without any validation rules.');
    });
</script>
