---
outline: deep
---

# named & toNamedRules

Array-style rule props (`:rules="[rules.required, rules.email]"`) need a name per rule to build Regle's object-shaped rule tree. Rules shipped by this package carry that name themselves; for inline or third-party rules, `named()` stamps one on. `toNamedRules()` is the conversion [`ValidationField`](/validation/component/ValidationField) uses internally and is exported for custom field components.

## Importing

```ts
import { named, toNamedRules } from '@basmilius/validation';
```

## Usage

```ts
const exact = named('exact', (value: unknown) => value === 'expected');
```

```vue
<ValidationField
    label="Code"
    :rules="[rules.required, exact]"
    validation-key="code"
    :value="form.code">
    <FluxFormInput v-model="form.code"/>
</ValidationField>
```

`toNamedRules` passes record-shaped rule sets through unchanged and converts arrays; a rule without a name throws.

```ts
toNamedRules([rules.required, rules.minLength(3)]);
// { required: ..., minLength: ... }
```

## Type signature

```ts
declare function named<TRule extends ValidationRule>(name: string, rule: TRule): TRule;
declare function toNamedRules(ruleSet: ValidationRuleSet): Record<string, ValidationRule>;

type ValidationRule = FormRuleDeclaration<any, any[]>;
type ValidationRuleSet = readonly ValidationRule[] | Readonly<Record<string, ValidationRule>>;
```

## See also

- [ValidationField](/validation/component/ValidationField)
- [Built-in rules](/validation/rule/)
