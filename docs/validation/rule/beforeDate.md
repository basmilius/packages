---
outline: deep
---

# beforeDate

Validates that a Luxon `DateTime` lies strictly before a reference `DateTime`. Empty values and a missing reference are considered valid, mirroring the other rules.

Requires the optional `luxon` peer dependency.

## Importing

```ts
import { beforeDate } from '@basmilius/validation';
```

## Usage

```vue
<ValidationField
    label="Sale starts on"
    :rules="[rules.required, rules.beforeDate(form.saleEndsOn)]"
    validation-key="sale_starts_on"
    :value="form.saleStartsOn">
    <FluxFormDateTimePicker v-model="form.saleStartsOn"/>
</ValidationField>
```

## Type signature

```ts
declare const beforeDate: RegleRuleWithParamsDefinition<'beforeDate', DateTime, [reference: Maybe<DateTime>]>;
```

## See also

- [afterDate](/validation/rule/afterDate)
- [betweenDates](/validation/rule/betweenDates)
