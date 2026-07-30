---
outline: deep
---

# escapeAttr

Escapes `&`, `<`, `>` and `"` so untrusted text can be safely interpolated into a double-quoted HTML attribute value. It behaves like [`escapeHtml`](/utils/string/escapeHtml) but leaves the single quote untouched, since attribute values are assumed to be double-quoted.

## Importing

```ts
import { escapeAttr } from '@basmilius/utils';
```

## Usage

```ts
import { escapeAttr } from '@basmilius/utils';

const title = escapeAttr('5" display & more');
const html = `<img alt="${title}">`;
// '<img alt="5&quot; display &amp; more">'
```

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `value` | `unknown` | The value to escape. Coerced to a string; `null` and `undefined` become `''`. |

## Returns

`string` the input with `&`, `<`, `>` and `"` replaced by their HTML entities.

## Type signature

```ts
declare function escapeAttr(value: unknown): string;
```

## See also

- [`escapeHtml`](/utils/string/escapeHtml)
- [`sanitizeUrl`](/utils/string/sanitizeUrl)
