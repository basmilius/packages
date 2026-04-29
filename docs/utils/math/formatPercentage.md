---
outline: deep
---

# formatPercentage

Formats a fraction `0..1` as a localized percentage with up to one fraction digit. Uses `Intl.NumberFormat` with `style: 'percent'`.

## Importing

```ts
import { formatPercentage } from '@basmilius/utils';
```

## Usage

```ts
import { formatPercentage } from '@basmilius/utils';

formatPercentage(0.42);   // => '42%'
formatPercentage(0.123);  // => '12.3%' (en-US) / '12,3%' (nl-NL)
formatPercentage(1);      // => '100%'
```

## Parameters

| Name    | Type     | Description                                                |
|---------|----------|------------------------------------------------------------|
| `value` | `number` | The fraction to format. `0` renders as `0%`, `1` as `100%`. |

## Returns

`string` — the localized percentage string.

## Type signature

```ts
declare function formatPercentage(value: number): string;
```

## See also

- [`formatNumber`](/utils/math/formatNumber)
