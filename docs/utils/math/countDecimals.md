---
outline: deep
---

# countDecimals

Counts the number of decimal digits a number has when stringified. Useful for deriving a sensible `maximumFractionDigits` from a step value.

## Importing

```ts
import { countDecimals } from '@basmilius/utils';
```

## Usage

```ts
import { countDecimals } from '@basmilius/utils';

countDecimals(1);       // => 0
countDecimals(0.1);     // => 1
countDecimals(3.14159); // => 5
countDecimals(100);     // => 0
```

## Parameters

| Name    | Type     | Description               |
|---------|----------|---------------------------|
| `value` | `number` | The number to inspect.    |

## Returns

`number` — the count of digits after the decimal point in the number's default string representation, or `0` when there is no fractional part.

## Type signature

```ts
declare function countDecimals(value: number): number;
```

## See also

- [`roundStep`](/utils/math/roundStep)
- [`formatNumber`](/utils/math/formatNumber)
