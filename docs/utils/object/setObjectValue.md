---
outline: deep
---

# setObjectValue

Defines a non-enumerable, non-writable property on an object using `Object.defineProperty` with the default descriptor. This is handy for stamping internal metadata on objects without polluting `for..in` loops or `Object.keys`.

## Importing

```ts
import { setObjectValue } from '@basmilius/utils';
```

## Usage

```ts
import { setObjectValue } from '@basmilius/utils';

const target = {visible: true};
setObjectValue(target, '__internal', {tag: 'meta'});

Object.keys(target);            // => ['visible']
(target as any).__internal;     // => { tag: 'meta' }
```

## Parameters

| Name    | Type               | Description                                       |
|---------|--------------------|---------------------------------------------------|
| `obj`   | `object`           | The object to mutate.                             |
| `key`   | `string \| symbol` | The property name to assign.                      |
| `value` | `unknown`          | The value to set.                                 |

## Returns

`void` — the property is defined in place.

## Type signature

```ts
declare function setObjectValue(obj: object, key: symbol | string, value: unknown): void;
```

## See also

- [`setObjectMethod`](/utils/object/setObjectMethod)
- [`getPrototypeChain`](/utils/object/getPrototypeChain)
