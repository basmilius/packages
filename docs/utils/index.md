---
outline: deep

cards:
    categories:
        -   title: Date & time
            details: 'Formatting, periods, seasons, moon phases and zodiac signs (Luxon-based).'
            link: /utils/date/
        -   title: Color
            details: 'Conversions between hex, RGB, HSL and HSV color spaces.'
            link: /utils/color/
        -   title: Math & numbers
            details: 'Formatting, rounding, step calculations and a seeded PRNG.'
            link: /utils/math/
        -   title: DOM & browser
            details: 'Downloads, view transitions, printing and element checks.'
            link: /utils/dom/
        -   title: Geo
            details: 'Hemisphere detection and point-in-polygon checks.'
            link: /utils/geo/
        -   title: Object
            details: 'Prototype chain inspection and property setters.'
            link: /utils/object/
        -   title: Function
            details: 'Debounce and waitFor control-flow helpers.'
            link: /utils/function/
---

# Utils

A collection of 47+ small, focused, tree-shakeable utilities for dates, colors, math, DOM operations and more. Built with TypeScript-first APIs and Luxon for date handling.

## Categories

<LinkCards group="categories"/>

## Reference

- [Constants](/utils/constants) — `CHECK`, `CROSS`, `MDASH`, `NDASH`, `NOOP`
- [Types](/utils/types) — `Constructor`, `Descriptors` plus the domain enums returned by the date helpers

## Quick example

```ts
import { formatDate, hexToRGB, mulberry32 } from '@basmilius/utils';
import { DateTime } from 'luxon';

formatDate(DateTime.now()); // localized date string
hexToRGB('#0070f3');         // [0, 112, 243]
const random = mulberry32(42); // seeded PRNG
random.next();                  // deterministic 0..1 value
```

Continue with [installation](/utils/installation) or pick a category above.
