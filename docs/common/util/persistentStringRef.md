---
outline: deep
---

# persistentStringRef

A nullable string variant of [`persistentRef`](/common/util/persistentRef) that stores plain strings in `localStorage` without going through `JSON.stringify`. Empty strings round-trip to `null` so the API stays consistent with [`emptyNull`](/common/util/emptyNull).

## Importing

```ts
import { persistentStringRef } from '@basmilius/common';
```

## Usage

```ts
import { persistentStringRef } from '@basmilius/common';

const lastSearch = persistentStringRef('search:last', null);

lastSearch.value = 'invoices';     // persists 'invoices'
lastSearch.value = '';             // persisted as null, key removed
lastSearch.value = null;           // key removed
```

The serializer turns `null` into `''` for storage and the deserializer turns `''` back into `null`, so the localStorage entry is always a non-empty string when present.

## Type signature

```ts
declare function persistentStringRef(
    key: string,
    defaultValue: string | null
): Ref<string | null>;
```

## See also

- [`persistentRef`](/common/util/persistentRef)
- [`emptyNull`](/common/util/emptyNull)
