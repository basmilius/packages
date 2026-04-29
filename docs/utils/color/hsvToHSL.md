---
outline: deep
---

# hsvToHSL

Converts HSV to HSL by routing through RGB.

## Importing

```ts
import { hsvToHSL } from '@basmilius/utils';
```

## Usage

```ts
import { hsvToHSL } from '@basmilius/utils';

hsvToHSL(0.589, 1, 0.952);
// => [h, s, l] with h in 0..360, s and l in 0..100
```

## Parameters

| Name | Type     | Description                                              |
|------|----------|----------------------------------------------------------|
| `h`  | `number` | Hue as a fraction, `0..1` (multiply by 360 for degrees). |
| `s`  | `number` | Saturation as a fraction, `0..1`.                        |
| `v`  | `number` | Value as a fraction, `0..1`.                             |

## Returns

`[number, number, number]` — `[h, s, l]` with `h` in `0..360`, `s` and `l` in `0..100`, matching the [`rgbToHSL`](/utils/color/rgbToHSL) output range.

## Type signature

```ts
declare function hsvToHSL(h: number, s: number, v: number): [number, number, number];
```

## See also

- [`hslToHSV`](/utils/color/hslToHSV)
- [`hsvToRGB`](/utils/color/hsvToRGB)
- [`rgbToHSL`](/utils/color/rgbToHSL)
