---
outline: deep
---

# downloadUrl

Triggers a download for an `http://`, `https://` or `blob:` URL by appending a temporary anchor with the `download` attribute. URLs with any other scheme are rejected with an error.

## Importing

```ts
import { downloadUrl } from '@basmilius/utils';
```

## Usage

```ts
import { downloadUrl } from '@basmilius/utils';

downloadUrl('https://example.com/files/report.pdf', 'report.pdf');

const blob = new Blob(['hello'], {type: 'text/plain'});
const url = URL.createObjectURL(blob);
downloadUrl(url, 'hello.txt');
URL.revokeObjectURL(url);
```

## Parameters

| Name       | Type     | Description                                                          |
|------------|----------|----------------------------------------------------------------------|
| `url`      | `string` | The URL to download. Must start with `http://`, `https://` or `blob:`. |
| `filename` | `string` | The suggested filename.                                              |

## Returns

`void` — the download is triggered synchronously.

## Throws

`Error` — when the URL scheme is not supported.

## Type signature

```ts
declare function downloadUrl(url: string, filename: string): void;
```

## See also

- [`downloadBlob`](/utils/dom/downloadBlob)
- [`downloadString`](/utils/dom/downloadString)
- [`openUrl`](/utils/dom/openUrl)
