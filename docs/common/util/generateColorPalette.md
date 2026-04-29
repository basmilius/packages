---
outline: deep
---

# generateColorPalette

Generate a 12-shade color palette as a CSS custom-properties record from a single base hex color. Conversion happens in OKLCH space via [`culori`](https://culorijs.org/), so lightness ramps stay perceptually even and chroma falls off smoothly toward the extremes.

## Importing

```ts
import { generateColorPalette } from '@basmilius/common';
```

## Usage

```ts
import { generateColorPalette } from '@basmilius/common';

const palette = generateColorPalette('#0070f3', 'brand');

// {
//   '--brand-25':  '#f7faff',
//   '--brand-50':  '#eff5ff',
//   '--brand-100': '#dbe9fe',
//   ...
//   '--brand-950': '#020c1e'
// }
```

Apply the result to `document.documentElement.style` (or any element) to expose the palette as CSS variables:

```ts
import { generateColorPalette } from '@basmilius/common';

const palette = generateColorPalette('#0070f3', 'brand');
const root = document.documentElement;

for (const [name, value] of Object.entries(palette)) {
    root.style.setProperty(name, value);
}
```

The base color is anchored at the `500` shade. Lighter shades interpolate toward white (`L = 1`), darker shades interpolate toward black (`L = 0`). Chroma is scaled by `1 - distance * 1.4`, clamped between `0.2` and `1`, so very light and very dark shades stay readable without becoming grey.

If `culori` cannot parse the input as an OKLCH color, the function throws `Error('Invalid color')`.

## Shades

`25`, `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`, `950`.

## Type signature

```ts
declare function generateColorPalette(
    baseHex: string,
    prefix?: string
): Record<string, string>;
```

## See also

- [`hexToRGB`](/utils/color/hexToRGB) and other color conversions in [`@basmilius/utils`](/utils/color/)
