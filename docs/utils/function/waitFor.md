---
outline: deep
---

# waitFor

Promise wrapper around `setTimeout`. Resolves with `undefined` after the given number of milliseconds.

## Importing

```ts
import { waitFor } from '@basmilius/utils';
```

## Usage

```ts
import { waitFor } from '@basmilius/utils';

async function fadeOut(): Promise<void> {
    element.classList.add('fade-out');
    await waitFor(300);
    element.remove();
}
```

## Parameters

| Name | Type     | Description                       |
|------|----------|-----------------------------------|
| `ms` | `number` | The delay in milliseconds.        |

## Returns

`Promise<void>` — resolves once the delay elapses.

## Type signature

```ts
declare function waitFor(ms: number): Promise<void>;
```

## See also

- [`debounce`](/utils/function/debounce)
