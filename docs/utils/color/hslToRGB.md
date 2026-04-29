---
outline: deep
---

# hslToRGB

Converts HSL into an RGB triplet. Hue is expressed in degrees, saturation and lightness as percentages.

## Importing

```ts
import { hslToRGB } from '@basmilius/utils';
```

## Usage

```ts
import { hslToRGB } from '@basmilius/utils';

hslToRGB(212, 100, 47.6); // => [0, 112, 243]
hslToRGB(0, 0, 100);      // => [255, 255, 255]
```

## Parameters

| Name | Type     | Description                       |
|------|----------|-----------------------------------|
| `h`  | `number` | Hue in degrees, `0..360`.         |
| `s`  | `number` | Saturation as a percentage, `0..100`. |
| `l`  | `number` | Lightness as a percentage, `0..100`.  |

## Returns

`[number, number, number]` — `[r, g, b]` tuple with each component in `0..255`, rounded to the nearest integer.

## Type signature

```ts
declare function hslToRGB(h: number, s: number, l: number): [number, number, number];
```

## See also

- [`rgbToHSL`](/utils/color/rgbToHSL)
- [`hslToHSV`](/utils/color/hslToHSV)
- [`hueToRGB`](/utils/color/hueToRGB)
