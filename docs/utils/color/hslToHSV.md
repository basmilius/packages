---
outline: deep
---

# hslToHSV

Converts HSL to HSV by routing through RGB. Useful when adapting between APIs that prefer one or the other.

## Importing

```ts
import { hslToHSV } from '@basmilius/utils';
```

## Usage

```ts
import { hslToHSV } from '@basmilius/utils';

hslToHSV(212, 100, 47.6);
// => [h, s, v] with h in 0..1, s and v in 0..1
```

## Parameters

| Name | Type     | Description                                     |
|------|----------|-------------------------------------------------|
| `h`  | `number` | Hue in degrees, `0..360`.                       |
| `s`  | `number` | Saturation as a percentage, `0..100`.           |
| `v`  | `number` | Lightness as a percentage, `0..100`.            |

## Returns

`[number, number, number]` — `[h, s, v]` with all components in `0..1`, identical to the [`rgbToHSV`](/utils/color/rgbToHSV) output range.

## Type signature

```ts
declare function hslToHSV(h: number, s: number, v: number): [number, number, number];
```

## See also

- [`hsvToHSL`](/utils/color/hsvToHSL)
- [`hslToRGB`](/utils/color/hslToRGB)
- [`rgbToHSV`](/utils/color/rgbToHSV)
