---
outline: deep
---

# Server errors

The submit flow of [`useValidation`](/validation/composable/useValidation) understands the error types of [`@basmilius/http-client`](/http-client/). When the function passed to `validated()` throws, the error is routed as follows:

- **`ValidationError`**: the nested error tree is flattened into dot-notation keys (`profile.zip`) and every backend constraint code is mapped to a `validator.*` message key. Each error lands on the [`ValidationField`](/validation/component/ValidationField) whose `validation-key` matches.
- **`RequestError`**: the error description is stored under the exported `GLOBAL_ERROR_KEY` symbol and shown by [`ValidationNotice`](/validation/component/ValidationNotice).
- Anything else is re-thrown so your global error handling can pick it up.

Server errors live next to client-side errors instead of replacing them: re-validation on the client never wipes a server error. A field-level server error is cleared as soon as the value of that field changes; all server errors are cleared when a new submit starts or `reset()` is called.

## Constraint mapping

Backend constraint codes are translated through a constraint map. The default map understands both short codes (`missing`, `max_length`) and their `http_validation_constraint_*` prefixed variants:

| Constraint code       | Message key                |
|-----------------------|----------------------------|
| `address_not_valid`   | `validator.addressNotValid`|
| `credentials`         | `validator.credentials`    |
| `email`               | `validator.email`          |
| `email_taken`         | `validator.emailTaken`     |
| `is_phone_number`     | `validator.phoneNumber`    |
| `max`                 | `validator.maxValue`       |
| `max_length`          | `validator.maxLength`      |
| `min`                 | `validator.minValue`       |
| `min_length`          | `validator.minLength`      |
| `missing`             | `validator.required`       |
| `same_as`             | `validator.sameAs`         |
| `validator_errors`    | `validator.notice`         |

Unknown codes are passed to the translate function as-is, so project-specific codes can be handled by extending the map through [`createValidation`](/validation/config/createValidation):

```ts
app.use(createValidation({
    constraints: {
        http_validation_constraint_iban: 'validator.iban'
    },
    t: (key, params) => i18n.global.t(key, params ?? {})
}));
```
