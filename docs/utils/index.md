---
outline: deep
---

# Utils

A collection of 47+ small, focused, tree-shakeable utilities for dates, colors, math, DOM operations and more. Built with TypeScript-first APIs and Luxon for date handling.

## Categories

- [Date & time](/utils/date/) — formatting, periods, seasons, moon phases, zodiac signs
- [Color](/utils/color/) — conversions between hex, RGB, HSL, HSV
- [Math & numbers](/utils/math/) — formatting, rounding, step calculations, PRNG
- [DOM & browser](/utils/dom/) — downloads, view transitions, element checks
- [Geo](/utils/geo/) — hemisphere and polygon checks
- [Object](/utils/object/) — prototype chain inspection, property setters
- [Function](/utils/function/) — debounce, waitFor

## Reference

- [Constants](/utils/constants) — CHECK, CROSS, MDASH, NDASH, NOOP
- [Types](/utils/types) — Constructor, Descriptors

## Quick example

```ts
import { formatDate, hexToRGB, mulberry32 } from '@basmilius/utils';
import { DateTime } from 'luxon';

formatDate(DateTime.now()); // localized date string
hexToRGB('#0070f3');         // [0, 112, 243]
const random = mulberry32(42); // seeded PRNG
random.next();                  // deterministic 0..1 value
```
