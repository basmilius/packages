---
outline: deep
---

# emptyNull

Collapse falsy strings (empty string, `null`, `undefined`) to `null`. Useful when normalising form values before they hit a backend that expects either a non-empty string or `null` rather than the JavaScript `''`.

## Importing

```ts
import { emptyNull } from '@basmilius/common';
```

## Usage

```ts
import { emptyNull } from '@basmilius/common';

emptyNull('hello');     // 'hello'
emptyNull('');          // null
emptyNull(null);        // null
emptyNull(undefined);   // null
```

## Type signature

```ts
declare function emptyNull(str: string | undefined | null): string | null;
```

## See also

- [`persistentStringRef`](/common/util/persistentStringRef)
