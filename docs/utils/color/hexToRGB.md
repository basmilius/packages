---
outline: deep
---

# hexToRGB

Parses a hexadecimal color string into an `[r, g, b]` tuple. The leading `#` is optional.

## Importing

```ts
import { hexToRGB } from '@basmilius/utils';
```

## Usage

```ts
import { hexToRGB } from '@basmilius/utils';

hexToRGB('#0070f3');  // => [0, 112, 243]
hexToRGB('0070f3');   // => [0, 112, 243]
hexToRGB('#ffffff');  // => [255, 255, 255]
```

## Parameters

| Name  | Type     | Description                                                       |
|-------|----------|-------------------------------------------------------------------|
| `hex` | `string` | A six-digit hexadecimal color, with or without a leading `#`.     |

## Returns

`[number, number, number]` — `[r, g, b]` tuple with each component in the range `0..255`.

## Type signature

```ts
declare function hexToRGB(hex: string): [number, number, number];
```

## See also

- [`rgbToHEX`](/utils/color/rgbToHEX)
- [`rgbToHSL`](/utils/color/rgbToHSL)
- [`rgbToHSV`](/utils/color/rgbToHSV)
