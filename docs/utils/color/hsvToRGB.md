---
outline: deep
---

# hsvToRGB

Converts HSV into an RGB triplet. Hue, saturation and value are expressed as fractions in `0..1`.

## Importing

```ts
import { hsvToRGB } from '@basmilius/utils';
```

## Usage

```ts
import { hsvToRGB } from '@basmilius/utils';

hsvToRGB(0.589, 1, 0.952); // => [0, 112, 243] (approximately)
hsvToRGB(0, 0, 1);          // => [255, 255, 255]
```

## Parameters

| Name | Type     | Description                                              |
|------|----------|----------------------------------------------------------|
| `h`  | `number` | Hue as a fraction, `0..1` (multiply by 360 for degrees). |
| `s`  | `number` | Saturation as a fraction, `0..1`.                        |
| `v`  | `number` | Value as a fraction, `0..1`.                             |

## Returns

`[number, number, number]` — `[r, g, b]` tuple with each component in `0..255`, rounded to the nearest integer.

## Type signature

```ts
declare function hsvToRGB(h: number, s: number, v: number): [number, number, number];
```

## See also

- [`rgbToHSV`](/utils/color/rgbToHSV)
- [`hsvToHSL`](/utils/color/hsvToHSL)
- [`hslToRGB`](/utils/color/hslToRGB)
