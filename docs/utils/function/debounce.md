---
outline: deep
---

# debounce

Returns a debounced wrapper around `fn`. Repeated calls within `interval` milliseconds reset the timer. The wrapper returns a `Promise` that resolves with the eventual result of the call that actually runs — every pending caller receives the same result (or rejection).

## Importing

```ts
import { debounce } from '@basmilius/utils';
```

## Usage

```ts
import { debounce } from '@basmilius/utils';

const search = debounce(async (query: string) => {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    return response.json();
}, 300);

await search('he');
await search('hel');
const results = await search('hello');
// Only the final invocation runs after 300ms.
```

## Parameters

| Name       | Type     | Description                                                          |
|------------|----------|----------------------------------------------------------------------|
| `fn`       | `F`      | The function to debounce.                                            |
| `interval` | `number` | Debounce window in milliseconds.                                     |
| `$this`    | `object` | Optional `this` binding for `fn`. Defaults to `undefined`.           |

## Returns

`Function` — a wrapper that returns `Promise<Awaited<ReturnType<F>>>`. All pending promises share the result of the call that eventually runs; if the underlying call throws, every pending promise rejects with the same error.

## Type signature

```ts
declare function debounce<F extends (...args: any[]) => any>(
    fn: F,
    interval: number,
    $this?: object
): Function;
```

## See also

- [`waitFor`](/utils/function/waitFor)
