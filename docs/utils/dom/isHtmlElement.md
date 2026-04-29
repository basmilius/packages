---
outline: deep
---

# isHtmlElement

Type guard that narrows an unknown value to `HTMLElement`. Safe to call in non-browser environments — it returns `false` when `globalThis.document` is not available.

## Importing

```ts
import { isHtmlElement } from '@basmilius/utils';
```

## Usage

```ts
import { isHtmlElement } from '@basmilius/utils';

function focus(target: unknown): void {
    if (isHtmlElement(target)) {
        target.focus();
    }
}
```

## Parameters

| Name  | Type      | Description                       |
|-------|-----------|-----------------------------------|
| `elm` | `unknown` | The value to test.                |

## Returns

`boolean` — `true` when running in a browser and `elm instanceof HTMLElement`.

## Type signature

```ts
declare function isHtmlElement(elm: unknown): elm is HTMLElement;
```

## See also

- [`viewTransition`](/utils/dom/viewTransition)
