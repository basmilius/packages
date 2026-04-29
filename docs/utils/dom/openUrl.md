---
outline: deep
---

# openUrl

Navigates the current browser tab to the given URL. When the page is embedded inside an iframe, the navigation breaks out by targeting `_top`.

## Importing

```ts
import { openUrl } from '@basmilius/utils';
```

## Usage

```ts
import { openUrl } from '@basmilius/utils';

openUrl('https://example.com');
```

## Parameters

| Name  | Type     | Description                                |
|-------|----------|--------------------------------------------|
| `url` | `string` | The URL to navigate to.                    |

## Returns

`void` — navigation is triggered synchronously.

## Type signature

```ts
declare function openUrl(url: string): void;
```

## See also

- [`downloadUrl`](/utils/dom/downloadUrl)
