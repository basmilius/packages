---
outline: deep
---

# clampWithStepPrecision

Maps a normalized value (`0..1`) into the inclusive range `[min, max]`, snaps it to the nearest multiple of `step` and clamps the result. The output is rounded to four significant digits via `Number.toPrecision(4)`.

This is the helper that powers slider controls where the visual position is normalized but the underlying value should respect a step.

## Importing

```ts
import { clampWithStepPrecision } from '@basmilius/utils';
```

## Usage

```ts
import { clampWithStepPrecision } from '@basmilius/utils';

clampWithStepPrecision(0.5, 0, 100, 5);   // => 50
clampWithStepPrecision(0.33, 0, 10, 0.1); // => 3.3
clampWithStepPrecision(2, 0, 100, 5);     // => 100 (clamped)
```

## Parameters

| Name    | Type     | Description                                                |
|---------|----------|------------------------------------------------------------|
| `value` | `number` | A normalized fraction in `0..1`.                           |
| `min`   | `number` | Lower bound of the resulting range (inclusive).            |
| `max`   | `number` | Upper bound of the resulting range (inclusive).            |
| `step`  | `number` | The step the result must be a multiple of.                 |

## Returns

`number` — the snapped, clamped and precision-bounded value.

## Type signature

```ts
declare function clampWithStepPrecision(value: number, min: number, max: number, step: number): number;
```

## See also

- [`roundStep`](/utils/math/roundStep)
- [`generateStepTicks`](/utils/math/generateStepTicks)
- [`countDecimals`](/utils/math/countDecimals)
