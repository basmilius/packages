---
outline: deep
---

# Message keys

Every message the package produces goes through a single `validator.*` key, whether it originates from a rule, a component or the server error mapping. When a project registers its own translate function through [`createValidation`](/validation/config/createValidation), these are the keys it should provide. Without configuration, the built-in English texts below are used.

Some keys are not tied to a rule at all: `validator.notice` is shown by [`ValidationNotice`](/validation/component/ValidationNotice), and keys like `validator.emailTaken` only occur through the [server error mapping](/validation/server-errors).

## All keys

| Key                          | Used by                        | Parameters       |
|------------------------------|--------------------------------|------------------|
| `validator.addressNotValid`  | server errors                  |                  |
| `validator.afterDate`        | `afterDate`                    |                  |
| `validator.alpha`            | `alpha`                        |                  |
| `validator.alphaNum`         | `alphaNum`                     |                  |
| `validator.and`              | `and`                          |                  |
| `validator.beforeDate`       | `beforeDate`                   |                  |
| `validator.between`          | `between`, server errors       | `{min}`, `{max}` |
| `validator.betweenDates`     | `betweenDates`                 | `{from}`, `{to}` |
| `validator.bsn`              | `bsn`                          |                  |
| `validator.credentials`      | server errors                  |                  |
| `validator.decimal`          | `decimal`                      |                  |
| `validator.email`            | `email`, server errors         |                  |
| `validator.emailTaken`       | server errors                  |                  |
| `validator.integer`          | `integer`                      |                  |
| `validator.ipAddress`        | `ipAddress`                    |                  |
| `validator.macAddress`       | `macAddress`                   |                  |
| `validator.maxLength`        | `maxLength`, server errors     | `{max}`          |
| `validator.maxValue`         | `maxValue`, server errors      | `{max}`          |
| `validator.minLength`        | `minLength`, server errors     | `{min}`          |
| `validator.minValue`         | `minValue`, server errors      | `{min}`          |
| `validator.not`              | `not`                          |                  |
| `validator.notice`           | `ValidationNotice`, server errors |               |
| `validator.numeric`          | `numeric`                      |                  |
| `validator.or`               | `or`                           |                  |
| `validator.phoneNumber`      | server errors                  |                  |
| `validator.postalCode`       | `postalCode`                   |                  |
| `validator.required`         | `required`, server errors      |                  |
| `validator.requiredIf`       | `requiredIf`                   |                  |
| `validator.requiredUnless`   | `requiredUnless`               |                  |
| `validator.sameAs`           | `sameAs`, server errors        | `{otherName}`    |
| `validator.url`              | `url`                          |                  |

## Ready to paste

The complete set with the built-in English texts, in vue-i18n YAML format:

```yaml
validator:
    addressNotValid: "The chosen address is not valid."
    afterDate: "Please choose a date later than the start date."
    alpha: "Please enter only alphabetical characters."
    alphaNum: "Please enter a value containing only letters and numbers."
    and: "Please ensure all requirements are met."
    beforeDate: "Please choose a date earlier than the end date."
    between: "Please enter a number between {min} and {max}, inclusive."
    betweenDates: "Please choose a date within the allowed period."
    bsn: "Please enter a valid citizen service number."
    credentials: "The provided credentials are invalid."
    decimal: "Please enter a valid decimal value."
    email: "Please enter a valid email address."
    emailTaken: "The chosen email address is already in use."
    integer: "Please enter a whole number."
    ipAddress: "Please enter a valid IP address."
    macAddress: "Please enter a valid MAC address."
    maxLength: "Please enter a value with a maximum length of {max} characters."
    maxValue: "Please enter a number less than or equal to {max}."
    minLength: "Please enter a value with a minimum length of {min} characters."
    minValue: "Please enter a number greater than or equal to {min}."
    not: "Please enter a different value."
    notice: "Please address the errors in the form before proceeding with the submission."
    numeric: "Please enter a valid numeric value."
    or: "Please ensure at least one requirement is met."
    phoneNumber: "Please enter a valid phone number."
    postalCode: "Please enter a valid postal code."
    required: "This field is required."
    requiredIf: "This field is required."
    requiredUnless: "This field is required."
    sameAs: "Please ensure this field is the same as the other field."
    url: "Please enter a valid URL."
```

Custom constraint codes added through `createValidation({constraints})` map onto keys of your choosing; add those to your locale files as well.

## See also

- [createValidation](/validation/config/createValidation)
- [Server errors](/validation/server-errors)
