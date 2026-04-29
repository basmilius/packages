---
outline: deep
---

# rgbToHEX

Converts an RGB triplet into a six-digit lowercase hex color prefixed with `#`.

## Importing

```ts
import { rgbToHEX } from '@basmilius/utils';
```

## Usage

```ts
import { rgbToHEX } from '@basmilius/utils';

rgbToHEX(0, 112, 243);  // => '#0070f3'
rgbToHEX(255, 255, 255); // => '#ffffff'
```

## Parameters

| Name | Type     | Description                       |
|------|----------|-----------------------------------|
| `r`  | `number` | Red component, `0..255`.          |
| `g`  | `number` | Green component, `0..255`.        |
| `b`  | `number` | Blue component, `0..255`.         |

## Returns

`string` — the color in `#rrggbb` form. Each component is left-padded with zeros so the result is always seven characters long.

## Type signature

```ts
declare function rgbToHEX(r: number, g: number, b: number): string;
```

## See also

- [`hexToRGB`](/utils/color/hexToRGB)
- [`rgbToHSL`](/utils/color/rgbToHSL)
- [`rgbToHSV`](/utils/color/rgbToHSV)
