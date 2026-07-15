---
outline: deep
---

# configureValidation

The imperative sibling of [`createValidation`](/validation/config/createValidation), for setups without access to the Vue app instance (tests, stories, non-plugin bootstrapping). Both accept the same options; the plugin simply calls this function on install.

## Importing

```ts
import { configureValidation } from '@basmilius/validation';
```

## Usage

```ts
import { configureValidation } from '@basmilius/validation';

configureValidation({
    constraints: {
        http_validation_constraint_iban: 'validator.iban'
    },
    t: (key, params) => translate(key, params)
});
```

Custom constraints are merged over the defaults; a second call replaces earlier custom constraints rather than stacking them.

## Type signature

```ts
declare function configureValidation(options?: ValidationOptions): void;
```

## See also

- [createValidation](/validation/config/createValidation)
