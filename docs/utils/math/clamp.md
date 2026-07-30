---
outline: deep
---

# clamp

Constrains a number to an inclusive range. Values below `min` return `min`, values above `max` return `max`, and anything in between is returned unchanged.

## Importing

```ts
import { clamp } from '@basmilius/utils';
```

## Usage

```ts
import { clamp } from '@basmilius/utils';

clamp(5, 0, 10);   // 5
clamp(-3, 0, 10);  // 0
clamp(42, 0, 10);  // 10
```

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `value` | `number` | The number to constrain. |
| `min` | `number` | Lower bound of the range. |
| `max` | `number` | Upper bound of the range. |

## Returns

`number` the value clamped to the inclusive `[min, max]` range.

## Type signature

```ts
declare function clamp(value: number, min: number, max: number): number;
```

## See also

- [`clampWithStepPrecision`](/utils/math/clampWithStepPrecision): clamps to a range and additionally snaps to a step with fixed precision, where `clamp` is purely numeric.
- [`roundStep`](/utils/math/roundStep)
