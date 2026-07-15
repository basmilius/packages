---
outline: deep
---

# Built-in rules

All rules are re-exports of [Regle rules](https://reglejs.dev/core-concepts/rules/built-in-rules) wrapped with localized messages (`validator.*` keys). They are available as individual imports and, more commonly, through the `rules` object returned by [`useValidation`](/validation/composable/useValidation).

Every rule skips empty values: `minLength(3)` on an empty field is valid. Combine with `required` to enforce presence.

## Importing

```ts
import { rules } from '@basmilius/validation';
// or individually:
import { email, minLength, required } from '@basmilius/validation';
```

## Rules

| Rule                      | Message key               | Parameters in message |
|---------------------------|---------------------------|-----------------------|
| `alpha`                   | `validator.alpha`         |                       |
| `alphaNum`                | `validator.alphaNum`      |                       |
| `and(...rules)`           | `validator.and`           |                       |
| `between(min, max)`       | `validator.between`       | `{min}`, `{max}`      |
| `decimal`                 | `validator.decimal`       |                       |
| `email`                   | `validator.email`         |                       |
| `integer`                 | `validator.integer`       |                       |
| `ipAddress`               | `validator.ipAddress`     |                       |
| `macAddress(separator?)`  | `validator.macAddress`    |                       |
| `maxLength(max)`          | `validator.maxLength`     | `{max}`               |
| `maxValue(max)`           | `validator.maxValue`      | `{max}`               |
| `minLength(min)`          | `validator.minLength`     | `{min}`               |
| `minValue(min)`           | `validator.minValue`      | `{min}`               |
| `not(rule)`               | `validator.not`           |                       |
| `numeric`                 | `validator.numeric`       |                       |
| `or(...rules)`            | `validator.or`            |                       |
| `required`                | `validator.required`      |                       |
| `requiredIf(condition)`   | `validator.requiredIf`    |                       |
| `requiredUnless(condition)` | `validator.requiredUnless` |                    |
| `sameAs(target, name?)`   | `validator.sameAs`        | `{otherName}`         |
| `url`                     | `validator.url`           |                       |

Custom rules that ship with the package: [`afterDate`](/validation/rule/afterDate), [`beforeDate`](/validation/rule/beforeDate), [`betweenDates`](/validation/rule/betweenDates), [`bsn`](/validation/rule/bsn) and [`postalCode`](/validation/rule/postalCode).

## Usage

```vue
<ValidationField
    label="New password (confirm)"
    :rules="[rules.required, rules.sameAs(() => form.newPassword)]"
    validation-key="new_password_confirm"
    :value="form.newPasswordConfirm">
    <FluxFormInput
        v-model="form.newPasswordConfirm"
        type="password"/>
</ValidationField>
```

Because the exports are plain Regle rules, they also work in a regular `useRegle` rules tree.

## See also

- [named & toNamedRules](/validation/rule/named)
- [Regle built-in rules](https://reglejs.dev/core-concepts/rules/built-in-rules)
