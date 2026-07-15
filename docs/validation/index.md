---
outline: deep

cards:
    highlights:
        -   title: useValidation
            code: true
            details: 'One composable per form: rules, errors, submit flow and server error mapping.'
            link: /validation/composable/useValidation
        -   title: ValidationField
            code: true
            details: 'A form field wrapper that registers its own rules and shows its own errors.'
            link: /validation/component/ValidationField
        -   title: ValidationNotice
            code: true
            details: 'A form-wide notice for global and request-level errors.'
            link: /validation/component/ValidationNotice
        -   title: createValidation
            code: true
            details: 'Plug in your own translate function and backend constraint mapping.'
            link: /validation/config/createValidation
        -   title: Built-in rules
            code: true
            details: 'All familiar rules, localized and ready for array-style usage.'
            link: /validation/rule/
        -   title: Server errors
            code: true
            details: 'ValidationError responses land on the exact field that caused them.'
            link: /validation/server-errors
---

# Validation

Form validation for Vue 3, built on top of [Regle](https://reglejs.dev). The package pairs a single `useValidation()` composable with self-registering field components: each `ValidationField` declares its own rules, the surrounding form collects them, and one submit flow handles client-side validation, server-side validation errors and request failures alike.

The API is intentionally close to the Vuelidate-based `useValidation()` composable it replaces, so existing forms migrate with little more than an import change. Regle's `r$` instance is exposed for anything beyond that surface.

## Highlights

<LinkCards group="highlights"/>

## At a glance

```vue
<template>
    <FluxForm @submit="validated(submit)">
        <ValidationNotice/>

        <ValidationField
            label="Code"
            :rules="[rules.required, rules.minLength(3), rules.maxLength(64)]"
            validation-key="code"
            :value="form.code">
            <FluxFormInput v-model="form.code"/>
        </ValidationField>

        <ValidationField
            label="Email address"
            :rules="[rules.required, rules.email]"
            validation-key="email"
            :value="form.email">
            <FluxFormInput
                v-model="form.email"
                type="email"/>
        </ValidationField>

        <FluxPrimaryButton
            :disabled="invalid"
            is-submit
            label="Save"/>
    </FluxForm>
</template>

<script
    lang="ts"
    setup>
    import { useValidation, ValidationField, ValidationNotice } from '@basmilius/validation';
    import { reactive } from 'vue';

    const form = reactive({
        code: '',
        email: ''
    });

    const {invalid, rules, validated} = useValidation();

    async function submit(): Promise<void> {
        // Runs only when the form is valid. Thrown ValidationError and
        // RequestError instances are mapped onto the form automatically.
    }
</script>
```
