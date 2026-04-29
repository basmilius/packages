---
outline: deep
---

# hueToRGB

Low-level helper used internally by [`hslToRGB`](/utils/color/hslToRGB) to convert a single hue component (with the precomputed `p` and `q` lightness terms) to its RGB value. It implements the standard `hue2rgb` step from the [HSL to RGB conversion](https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB_alternative) algorithm.

You usually do not call this function directly — reach for [`hslToRGB`](/utils/color/hslToRGB) instead.

## Importing

```ts
import { hueToRGB } from '@basmilius/utils';
```

## Usage

```ts
import { hueToRGB } from '@basmilius/utils';

const lightness = 0.5;
const saturation = 1;
const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
const p = 2 * lightness - q;

hueToRGB(p, q, 0.5); // => 1 (the "blue" channel for hue 0.5 fully saturated)
```

## Parameters

| Name | Type     | Description                                  |
|------|----------|----------------------------------------------|
| `p`  | `number` | The `2 * l - q` lightness term.              |
| `q`  | `number` | The combined lightness/saturation term.      |
| `t`  | `number` | The hue offset (`h + 1/3`, `h`, `h - 1/3`).  |

## Returns

`number` — the channel value in `0..1`.

## Type signature

```ts
declare function hueToRGB(p: number, q: number, t: number): number;
```

## See also

- [`hslToRGB`](/utils/color/hslToRGB)
