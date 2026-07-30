---
outline: deep
---

# sanitizeUrl

Sanitizes a URL against a scheme allow-list. It first strips whitespace and control or format characters (so tricks like `java&#9;script:` cannot hide a scheme), then rejects the URL by returning `null` when its scheme is not in the allow-list. Relative URLs (which have no scheme) always pass. The default allow-list is `LINK_PROTOCOLS`.

## Importing

```ts
import { sanitizeUrl } from '@basmilius/utils';
```

## Usage

```ts
import { sanitizeUrl, NAVIGATION_PROTOCOLS } from '@basmilius/utils';

sanitizeUrl('https://example.com');
// 'https://example.com'

sanitizeUrl('javascript:alert(1)');
// null

sanitizeUrl('/about');
// '/about'

sanitizeUrl('geo:52.37,4.90', NAVIGATION_PROTOCOLS);
// 'geo:52.37,4.90'
```

## Allow-lists

Three ready-made allow-lists are exported for common contexts:

| Constant | Protocols |
|----------|-----------|
| `IMAGE_PROTOCOLS` | `http:`, `https:` |
| `LINK_PROTOCOLS` | `http:`, `https:`, `mailto:`, `tel:` |
| `NAVIGATION_PROTOCOLS` | `http:`, `https:`, `mailto:`, `tel:`, `sms:`, `ftp:`, `ftps:`, `geo:` |

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `url` | `string \| null \| undefined` | The URL to sanitize. Empty, `null` or `undefined` input returns `null`. |
| `protocols` | `readonly string[]` | Allowed schemes. Defaults to `LINK_PROTOCOLS`. |

## Returns

`string | null` the cleaned URL, or `null` when the input is empty or its scheme is not allowed.

## Type signature

```ts
declare const IMAGE_PROTOCOLS: readonly ['http:', 'https:'];
declare const LINK_PROTOCOLS: readonly ['http:', 'https:', 'mailto:', 'tel:'];
declare const NAVIGATION_PROTOCOLS: readonly ['http:', 'https:', 'mailto:', 'tel:', 'sms:', 'ftp:', 'ftps:', 'geo:'];
declare function sanitizeUrl(url: string | null | undefined, protocols?: readonly string[]): string | null;
```

## See also

- [`escapeHtml`](/utils/string/escapeHtml)
- [`escapeAttr`](/utils/string/escapeAttr)
