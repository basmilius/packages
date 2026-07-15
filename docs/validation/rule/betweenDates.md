---
outline: deep
---

# betweenDates

Validates that a Luxon `DateTime` lies within an inclusive range. A missing bound is skipped, so an open-ended range works too. Empty values are considered valid.

The message receives the bounds as `{from}` and `{to}` parameters. Requires the optional `luxon` peer dependency.

## Importing

```ts
import { betweenDates } from '@basmilius/validation';
```

## Usage

```vue
<ValidationField
    label="Planned on"
    :rules="[rules.required, rules.betweenDates(event.startsOn, event.endsOn)]"
    validation-key="planned_on"
    :value="form.plannedOn">
    <FluxFormDateTimePicker v-model="form.plannedOn"/>
</ValidationField>
```

## Type signature

```ts
declare const betweenDates: RegleRuleWithParamsDefinition<'betweenDates', DateTime, [from: Maybe<DateTime>, to: Maybe<DateTime>]>;
```

## See also

- [afterDate](/validation/rule/afterDate)
- [beforeDate](/validation/rule/beforeDate)
