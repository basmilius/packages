---
outline: deep
---

# ValidationField

Wraps a Flux form field and registers its own validation rules with the surrounding form. The field validates the `value` prop against the given `rules` and shows the first error (client- or server-side) as an error addition below the input.

The `validation-key` doubles as the identifier server errors are matched on, so use the backend field name (usually snake_case). Changing the field's value clears a lingering server error for that key.

## Importing

```ts
import { ValidationField } from '@basmilius/validation';
```

## Usage

```vue
<ValidationField
    label="Code"
    :rules="[rules.required, rules.minLength(3), rules.maxLength(64)]"
    validation-key="code"
    :value="form.code">
    <FluxFormInput v-model="form.code"/>
</ValidationField>
```

Rules are usually passed as an array; each rule provides its own name. An object form is also accepted when a custom key is needed:

```vue
<ValidationField
    label="Code"
    :rules="{required: rules.required, exact: named('exact', value => value === 'expected')}"
    validation-key="code"
    :value="form.code">
    <FluxFormInput v-model="form.code"/>
</ValidationField>
```

Using the component without rules throws; wrap plain fields in `FluxFormField` instead.

## Props

| Prop            | Type                | Description                                          |
|-----------------|---------------------|------------------------------------------------------|
| `currentLength` | `number`            | Forwarded to `FluxFormField`.                        |
| `hint`          | `string`            | Forwarded to `FluxFormField`.                        |
| `isOptional`    | `boolean`           | Forwarded to `FluxFormField`.                        |
| `label`         | `string`            | The field label. Required.                           |
| `maxLength`     | `number`            | Forwarded to `FluxFormField`.                        |
| `rules`         | `ValidationRuleSet` | Array or record of rules. Required.                  |
| `validationKey` | `string`            | Error key; matches the backend field name. Required. |
| `value`         | `unknown`           | The value to validate.                               |

## See also

- [useValidation](/validation/composable/useValidation)
- [named & toNamedRules](/validation/rule/named)
