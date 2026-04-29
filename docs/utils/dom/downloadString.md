---
outline: deep
---

# downloadString

Downloads a string as a file by wrapping it in a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) with a custom MIME type and forwarding to [`downloadBlob`](/utils/dom/downloadBlob).

## Importing

```ts
import { downloadString } from '@basmilius/utils';
```

## Usage

```ts
import { downloadString } from '@basmilius/utils';

const csv = 'name,age\nAda,36\n';
downloadString(csv, 'people.csv', 'text/csv');

const json = JSON.stringify({hello: 'world'});
downloadString(json, 'hello.json', 'application/json');
```

## Parameters

| Name       | Type     | Description                                      |
|------------|----------|--------------------------------------------------|
| `data`     | `string` | The string content to download.                  |
| `filename` | `string` | The suggested filename.                          |
| `type`     | `string` | The MIME type for the underlying `Blob`.         |

## Returns

`void` — the download is triggered synchronously.

## Type signature

```ts
declare function downloadString(data: string, filename: string, type: string): void;
```

## See also

- [`downloadBlob`](/utils/dom/downloadBlob)
- [`downloadUrl`](/utils/dom/downloadUrl)
