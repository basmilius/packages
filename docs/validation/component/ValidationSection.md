---
outline: deep
---

# ValidationSection

Shows a danger notice when a specific validation key has an error. Use it for errors that belong to a section or group rather than to a single input, such as a backend error on a collection.

## Importing

```ts
import { ValidationSection } from '@basmilius/validation';
```

## Usage

```vue
<ValidationSection validation-key="tickets"/>
```

## Props

| Prop            | Type     | Description                       |
|-----------------|----------|-----------------------------------|
| `validationKey` | `string` | The error key to watch. Required. |

## See also

- [ValidationField](/validation/component/ValidationField)
- [ValidationNotice](/validation/component/ValidationNotice)
