---
outline: deep
---

# rgbToHSL

Converts an RGB triplet to HSL. Hue is returned in degrees, saturation and lightness as percentages rounded to one decimal.

## Importing

```ts
import { rgbToHSL } from '@basmilius/utils';
```

## Usage

```ts
import { rgbToHSL } from '@basmilius/utils';

rgbToHSL(0, 112, 243);   // => [212, 100, 47.6]
rgbToHSL(255, 255, 255); // => [0, 0, 100]
```

## Parameters

| Name | Type     | Description                       |
|------|----------|-----------------------------------|
| `r`  | `number` | Red component, `0..255`.          |
| `g`  | `number` | Green component, `0..255`.        |
| `b`  | `number` | Blue component, `0..255`.         |

## Returns

`[number, number, number]` — `[h, s, l]` with `h` in `0..360`, `s` and `l` in `0..100`.

## Type signature

```ts
declare function rgbToHSL(r: number, g: number, b: number): [number, number, number];
```

## See also

- [`hslToRGB`](/utils/color/hslToRGB)
- [`rgbToHSV`](/utils/color/rgbToHSV)
- [`hslToHSV`](/utils/color/hslToHSV)
