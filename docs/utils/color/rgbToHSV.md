---
outline: deep
---

# rgbToHSV

Converts an RGB triplet to HSV. Hue is returned as a normalized fraction in `0..1`, saturation and value as fractions in `0..1`.

## Importing

```ts
import { rgbToHSV } from '@basmilius/utils';
```

## Usage

```ts
import { rgbToHSV } from '@basmilius/utils';

rgbToHSV(0, 112, 243);   // => [0.589..., 1, 0.952...]
rgbToHSV(255, 255, 255); // => [0, 0, 1]
```

## Parameters

| Name | Type     | Description                       |
|------|----------|-----------------------------------|
| `r`  | `number` | Red component, `0..255`.          |
| `g`  | `number` | Green component, `0..255`.        |
| `b`  | `number` | Blue component, `0..255`.         |

## Returns

`[number, number, number]` — `[h, s, v]` with all components in `0..1`. Multiply `h` by 360 to get degrees.

## Type signature

```ts
declare function rgbToHSV(r: number, g: number, b: number): [number, number, number];
```

## See also

- [`hsvToRGB`](/utils/color/hsvToRGB)
- [`rgbToHSL`](/utils/color/rgbToHSL)
- [`hsvToHSL`](/utils/color/hsvToHSL)
