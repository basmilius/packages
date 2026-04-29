---
outline: deep
---

# generateStepTicks

Generates a list of evenly spaced ticks between `lower` and `upper` for use in axes or rulers. The function picks a tick size from a curated set so that you end up with roughly `target` ticks.

## Importing

```ts
import { generateStepTicks } from '@basmilius/utils';
```

## Usage

```ts
import { generateStepTicks } from '@basmilius/utils';

generateStepTicks(0, 100);
// => [0, 25, 50, 75, 100]

generateStepTicks(0, 10, 4, true);
// => [0, 2.5, 5, 7.5, 10] (with the small-size set enabled)
```

## Parameters

| Name      | Type      | Description                                                                                       |
|-----------|-----------|---------------------------------------------------------------------------------------------------|
| `lower`   | `number`  | Inclusive lower bound.                                                                            |
| `upper`   | `number`  | Inclusive upper bound.                                                                            |
| `target`  | `number`  | Approximate number of ticks to aim for. Defaults to `5`.                                          |
| `isSmall` | `boolean` | When `true`, includes the `0.1` and `0.5` step sizes so small ranges produce useful tick lists.   |

## Returns

`number[]` — the generated ticks. The first entry is always `lower` and the last is always `upper`.

## Type signature

```ts
declare function generateStepTicks(lower: number, upper: number, target?: number, isSmall?: boolean): number[];
```

## See also

- [`roundStep`](/utils/math/roundStep)
- [`clampWithStepPrecision`](/utils/math/clampWithStepPrecision)
