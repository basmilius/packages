---
outline: deep
---

# useValidation

The heart of the package: one call per form creates a validation context that is shared with every validation component in the subtree through provide/inject. Fields register themselves; the composable aggregates their state and drives the submit flow.

Calling `useValidation()` in a component whose ancestors already created a context returns that existing context, so nested components can freely access the same errors and helpers.

## Importing

```ts
import { useValidation } from '@basmilius/validation';
```

## Usage

```vue
<template>
    <FluxForm @submit="validated(submit)">
        <ValidationNotice/>

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
        email: ''
    });

    const {invalid, rules, validated} = useValidation();

    async function submit(): Promise<void> {
        await service.update(form);
    }
</script>
```

### Live validation

By default, fields validate when the form is submitted and keep re-validating while the user fixes the reported errors. Pass `true` to validate every field on each change instead:

```ts
const {invalid, rules, validated} = useValidation(true);
```

### The submit flow

`validated(fn, close?)` first validates the whole form. When valid, `fn` runs; when `fn` resolves, the optional `close` callback fires (handy for dialogs). Errors thrown by `fn` are mapped onto the form; see [Server errors](/validation/server-errors).

### Escape hatch

The returned `r$` is Regle's merged instance for the form. Use it for anything the simplified surface does not cover, such as `$touch`, `$extractDirtyFields` or per-instance inspection.

## Type signature

```ts
declare function useValidation(isLive?: boolean): UseValidation;

interface UseValidation {
    readonly errors: ComputedRef<ValidationErrors>;
    readonly invalid: ComputedRef<boolean>;
    readonly live: Readonly<Ref<boolean>>;
    readonly r$: MergedScopedRegles;
    readonly rules: ValidationRules;
    readonly handleError: (err: unknown) => void;
    readonly reset: () => void;
    readonly validate: () => Promise<boolean>;
    readonly validated: (fn: () => void | Promise<void>, close?: () => void) => Promise<void>;
}

type ValidationErrors = Record<string | symbol, string>;

const GLOBAL_ERROR_KEY: unique symbol;
```

- `errors`: flat map of client- and server-side error messages, keyed by `validation-key` (dot-notation for nested server errors) plus `GLOBAL_ERROR_KEY` for request failures.
- `invalid`: `true` when there is at least one visible error. Before the first submit this is `false`, so submit buttons stay enabled until the user actually gets something wrong.
- `handleError`: the mapping used by `validated()`, exposed for manual try/catch flows.

## See also

- [ValidationField](/validation/component/ValidationField)
- [ValidationNotice](/validation/component/ValidationNotice)
- [Server errors](/validation/server-errors)
