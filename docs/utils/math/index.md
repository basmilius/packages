---
outline: deep
---

# Math & numbers

Numeric helpers for formatting, snapping to a step, generating tick lists, and a fast deterministic pseudo random number generator.

## Formatting

- [`formatNumber`](/utils/math/formatNumber) — locale-aware number formatting with a fixed number of fraction digits.
- [`formatPercentage`](/utils/math/formatPercentage) — formats `0..1` as a localized percentage.

## Stepping & rounding

- [`clampWithStepPrecision`](/utils/math/clampWithStepPrecision) — clamps a normalized value into `[min, max]` while snapping to a step.
- [`countDecimals`](/utils/math/countDecimals) — number of fraction digits in a number's string form.
- [`generateStepTicks`](/utils/math/generateStepTicks) — generates a list of evenly spaced ticks for an axis.
- [`roundStep`](/utils/math/roundStep) — rounds a value to the nearest multiple of a step.

## Randomness

- [`mulberry32`](/utils/math/mulberry32) — seeded Mulberry32 PRNG with `next`, `nextBetween` and `fork`.
