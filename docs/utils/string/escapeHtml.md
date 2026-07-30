---
outline: deep
---

# escapeHtml

Escapes the five HTML-significant characters (`&`, `<`, `>`, `"` and `'`) so untrusted text can be safely interpolated into HTML text content. Any value is coerced to a string first, with `null` and `undefined` becoming an empty string.

## Importing

```ts
import { escapeHtml } from '@basmilius/utils';
```

## Usage

```ts
import { escapeHtml } from '@basmilius/utils';

escapeHtml('<b>Tom & Jerry</b>');
// '&lt;b&gt;Tom &amp; Jerry&lt;/b&gt;'

escapeHtml(null);
// ''
```

The character-to-entity map used internally is also exported as `HTML_ESCAPES`.

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `value` | `unknown` | The value to escape. Coerced to a string; `null` and `undefined` become `''`. |

## Returns

`string` the input with `&`, `<`, `>`, `"` and `'` replaced by their HTML entities.

## Type signature

```ts
declare function escapeHtml(value: unknown): string;
```

## See also

- [`escapeAttr`](/utils/string/escapeAttr)
- [`sanitizeUrl`](/utils/string/sanitizeUrl)
