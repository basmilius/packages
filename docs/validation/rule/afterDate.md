---
outline: deep
---

# afterDate

Validates that a Luxon `DateTime` lies strictly after a reference `DateTime`. Empty values and a missing reference are considered valid, mirroring the other rules.

Requires the optional `luxon` peer dependency.

## Importing

```ts
import { afterDate } from '@basmilius/validation';
```

## Usage

```vue
<ValidationField
    label="Sale ends on"
    :rules="[rules.required, rules.afterDate(form.saleStartsOn)]"
    validation-key="sale_ends_on"
    :value="form.saleEndsOn">
    <FluxFormDateTimePicker v-model="form.saleEndsOn"/>
</ValidationField>
```

## Type signature

```ts
declare const afterDate: RegleRuleWithParamsDefinition<'afterDate', DateTime, [reference: Maybe<DateTime>]>;
```

## See also

- [beforeDate](/validation/rule/beforeDate)
- [betweenDates](/validation/rule/betweenDates)
