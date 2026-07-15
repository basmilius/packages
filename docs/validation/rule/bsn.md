---
outline: deep
---

# bsn

Validates a Dutch citizen service number (burgerservicenummer): eight or nine digits. Empty values are considered valid.

## Importing

```ts
import { bsn } from '@basmilius/validation';
```

## Usage

```vue
<ValidationField
    label="Citizen service number"
    :rules="[rules.bsn]"
    validation-key="bsn"
    :value="form.bsn">
    <FluxFormInput v-model="form.bsn"/>
</ValidationField>
```

## Type signature

```ts
declare const bsn: RegleRuleDefinition<'bsn', string>;
```

## See also

- [Built-in rules](/validation/rule/)
- [postalCode](/validation/rule/postalCode)
