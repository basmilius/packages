---
outline: deep
---

# getMoonPhase

Returns the moon phase for a given `DateTime`. The implementation uses [Conway's algorithm](https://en.wikipedia.org/wiki/Lunar_phase#Calculating_phase) — a simple integer approximation that is accurate to about a day for civil purposes.

## Importing

```ts
import { getMoonPhase } from '@basmilius/utils';
import type { MoonPhase } from '@basmilius/utils';
```

## Usage

```ts
import { getMoonPhase } from '@basmilius/utils';
import { DateTime } from 'luxon';

getMoonPhase(DateTime.fromISO('2026-04-29')); // => 'waxing_gibbous'
getMoonPhase(DateTime.fromISO('2026-05-01')); // => 'full_moon'
```

## Parameters

| Name   | Type       | Description                          |
|--------|------------|--------------------------------------|
| `date` | `DateTime` | The date to evaluate the phase for.  |

## Returns

`MoonPhase` — one of `'new_moon'`, `'waxing_crescent'`, `'first_quarter'`, `'waxing_gibbous'`, `'full_moon'`, `'waning_gibbous'`, `'last_quarter'`, `'waning_crescent'`.

## Type signature

```ts
type MoonPhase =
    | 'new_moon'
    | 'waxing_crescent'
    | 'first_quarter'
    | 'waxing_gibbous'
    | 'full_moon'
    | 'waning_gibbous'
    | 'last_quarter'
    | 'waning_crescent';

declare function getMoonPhase(date: DateTime): MoonPhase;
```

## See also

- [`getSeason`](/utils/date/getSeason)
- [`getZodiacSign`](/utils/date/getZodiacSign)
