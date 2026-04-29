---
outline: deep
---

# formatNumber

Formats a number using the user's `navigator.language` locale (or a `nl-NL` fallback when `navigator` is not defined) with a fixed number of fraction digits.

## Importing

```ts
import { formatNumber } from '@basmilius/utils';
```

## Usage

```ts
import { formatNumber } from '@basmilius/utils';

formatNumber(1234567);        // => '1,234,567' (en-US) / '1.234.567' (nl-NL)
formatNumber(3.14159, 2);     // => '3.14'      (en-US) / '3,14'       (nl-NL)
formatNumber(1.5, 3);         // => '1.500'     (en-US)
```

## Parameters

| Name       | Type     | Description                                                          |
|------------|----------|----------------------------------------------------------------------|
| `value`    | `number` | The number to format.                                                |
| `decimals` | `number` | Number of fraction digits, applied as both `min` and `max`. Defaults to `0`. |

## Returns

`string` — the localized number string.

## Type signature

```ts
declare function formatNumber(value: number, decimals?: number): string;
```

## See also

- [`formatPercentage`](/utils/math/formatPercentage)
- [`countDecimals`](/utils/math/countDecimals)
