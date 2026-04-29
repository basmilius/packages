---
outline: deep
---

# BlobResponse

DTO returned by [`RequestBuilder.fetchBlob`](/http-client/http/RequestBuilder#fetchblob). Pairs a binary payload with the resolved filename, ready to be handed to a download helper.

## Importing

```ts
import { BlobResponse } from '@basmilius/http-client';
```

## Constructor

```ts
new BlobResponse(blob: Blob, name: string)
```

| Argument | Type   | Description                        |
| -------- | ------ | ---------------------------------- |
| `blob`   | `Blob` | The binary payload from the API.   |
| `name`   | string | The filename suggested by the API. |

## Properties

- **`blob`** — `Blob`. Read-only. The binary payload.
- **`name`** — `string`. Read-only. Filename derived from the `Content-Disposition` header, or a `download-yyyy-MM-dd HH-mm-ss` timestamp fallback.

## Methods

`BlobResponse` is decorated with [`@dto`](/http-client/decorator/dto) and therefore exposes `clone()`, `fill()` and `toJSON()` from the DTO machinery.

## Example

```ts
import { downloadBlob } from '@basmilius/utils';

const result = await this
    .request('/exports/users.csv')
    .method('get')
    .bearerToken()
    .fetchBlob();

downloadBlob(result.blob, result.name);
```

## See also

- [`RequestBuilder.fetchBlob`](/http-client/http/RequestBuilder#fetchblob)
- [`HttpAdapter.parseFileNameFromContentDispositionHeader`](/http-client/adapter/HttpAdapter#parsefilenamefromcontentdispositionheader)
