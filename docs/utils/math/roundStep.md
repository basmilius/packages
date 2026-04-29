---
outline: deep
---

# roundStep

Rounds a number to the nearest multiple of `step`.

## Importing

```ts
import { roundStep } from '@basmilius/utils';
```

## Usage

```ts
import { roundStep } from '@basmilius/utils';

roundStep(7, 5);     // => 5
roundStep(8, 5);     // => 10
roundStep(0.27, 0.1); // => 0.3
```

## Parameters

| Name    | Type     | Description                              |
|---------|----------|------------------------------------------|
| `value` | `number` | The number to round.                     |
| `step`  | `number` | The step the result must be a multiple of. |

## Returns

`number` — `Math.round(value / step) * step`. Beware of floating-point artefacts when the step is a non-terminating binary fraction; pair with [`countDecimals`](/utils/math/countDecimals) when displaying the value.

## Type signature

```ts
declare function roundStep(value: number, step: number): number;
```

## See also

- [`clampWithStepPrecision`](/utils/math/clampWithStepPrecision)
- [`generateStepTicks`](/utils/math/generateStepTicks)
- [`countDecimals`](/utils/math/countDecimals)
