---
outline: deep
---

# ValidationNotice

A form-wide notice, typically rendered at the top of a form. It shows the global request error when one is present (see [Server errors](/validation/server-errors)), falls back to a generic "please fix the errors" message while the form is invalid, and renders its default slot otherwise.

## Importing

```ts
import { ValidationNotice } from '@basmilius/validation';
```

## Usage

```vue
<FluxForm @submit="validated(submit)">
    <ValidationNotice/>

    <!-- fields -->
</FluxForm>
```

Inside a `FluxPane`, set `pane-body` to wrap the notice in a `FluxPaneBody` so spacing stays correct:

```vue
<ValidationNotice pane-body/>
```

## Props

| Prop       | Type      | Description                                              |
|------------|-----------|----------------------------------------------------------|
| `message`  | `string`  | Overrides the generic invalid-form message.              |
| `paneBody` | `boolean` | Wraps the notice in a `FluxPaneBody` when it is visible. |

## See also

- [useValidation](/validation/composable/useValidation)
- [Server errors](/validation/server-errors)
