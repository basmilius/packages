---
outline: deep
---

# postalCode

Validates a Dutch postal code: four digits optionally followed by two letters (`1234 AB`, `1234AB` or just `1234`). Empty values are considered valid.

## Importing

```ts
import { postalCode } from '@basmilius/validation';
```

## Usage

```vue
<ValidationField
    label="Postal code"
    :rules="[rules.required, rules.postalCode]"
    validation-key="postal_code"
    :value="form.postalCode">
    <FluxFormInput v-model="form.postalCode"/>
</ValidationField>
```

## Type signature

```ts
declare const postalCode: RegleRuleDefinition<'postalCode', string>;
```

## See also

- [Built-in rules](/validation/rule/)
- [bsn](/validation/rule/bsn)
