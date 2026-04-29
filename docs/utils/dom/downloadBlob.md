---
outline: deep
---

# downloadBlob

Downloads a `Blob` as a file. The helper internally creates an object URL, triggers an anchor click via [`downloadUrl`](/utils/dom/downloadUrl) and revokes the URL afterwards.

## Importing

```ts
import { downloadBlob } from '@basmilius/utils';
```

## Usage

```ts
import { downloadBlob } from '@basmilius/utils';

const blob = new Blob([JSON.stringify({hello: 'world'})], {type: 'application/json'});
downloadBlob(blob, 'hello.json');
```

## Parameters

| Name       | Type     | Description                          |
|------------|----------|--------------------------------------|
| `blob`     | `Blob`   | The binary content to download.      |
| `filename` | `string` | The suggested filename.              |

## Returns

`void` — the download is triggered synchronously. The browser handles the actual file save dialog.

## Type signature

```ts
declare function downloadBlob(blob: Blob, filename: string): void;
```

## See also

- [`downloadString`](/utils/dom/downloadString)
- [`downloadUrl`](/utils/dom/downloadUrl)
