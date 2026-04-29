---
outline: deep
---

# Color

Conversion helpers between common color spaces. All helpers operate on plain numeric tuples — RGB and HSL/HSV are returned as `[a, b, c]` arrays, hex values are strings prefixed with `#`.

## Conversions

- [`hexToRGB`](/utils/color/hexToRGB) — `#rrggbb` to `[r, g, b]`.
- [`rgbToHEX`](/utils/color/rgbToHEX) — `[r, g, b]` to `#rrggbb`.
- [`rgbToHSL`](/utils/color/rgbToHSL) — `[r, g, b]` to `[h, s, l]`.
- [`rgbToHSV`](/utils/color/rgbToHSV) — `[r, g, b]` to `[h, s, v]`.
- [`hslToRGB`](/utils/color/hslToRGB) — `[h, s, l]` to `[r, g, b]`.
- [`hslToHSV`](/utils/color/hslToHSV) — `[h, s, l]` to `[h, s, v]`.
- [`hsvToRGB`](/utils/color/hsvToRGB) — `[h, s, v]` to `[r, g, b]`.
- [`hsvToHSL`](/utils/color/hsvToHSL) — `[h, s, v]` to `[h, s, l]`.

## Internals

- [`hueToRGB`](/utils/color/hueToRGB) — low-level helper used by [`hslToRGB`](/utils/color/hslToRGB) for converting a hue component to its RGB value.

## Conventions

- RGB components are integers in the range `0..255`.
- Hue is in degrees `0..360` (or normalized `0..1` when used with [`hsvToRGB`](/utils/color/hsvToRGB)).
- Saturation and lightness/value are percentages `0..100` for HSL/HSV inputs as documented per function.
- Hex strings use the short `#rrggbb` form with a leading `#`.
