---
outline: deep
---

# getZodiacSign

Returns the Western tropical zodiac sign for a birth date. Boundaries follow the conventional civil dates (for example Aries from March 21 to April 19).

## Importing

```ts
import { getZodiacSign } from '@basmilius/utils';
import type { ZodiacSign } from '@basmilius/utils';
```

## Usage

```ts
import { getZodiacSign } from '@basmilius/utils';
import { DateTime } from 'luxon';

getZodiacSign(DateTime.fromISO('2026-04-29')); // => 'taurus'
getZodiacSign(DateTime.fromISO('1990-12-25')); // => 'capricorn'
```

## Parameters

| Name   | Type       | Description                                  |
|--------|------------|----------------------------------------------|
| `date` | `DateTime` | The birth date to evaluate the sign for.     |

## Returns

`ZodiacSign` — one of `'aquarius'`, `'aries'`, `'cancer'`, `'capricorn'`, `'gemini'`, `'leo'`, `'libra'`, `'pisces'`, `'sagittarius'`, `'scorpio'`, `'taurus'`, `'virgo'`.

## Type signature

```ts
type ZodiacSign =
    | 'aquarius'
    | 'aries'
    | 'cancer'
    | 'capricorn'
    | 'gemini'
    | 'leo'
    | 'libra'
    | 'pisces'
    | 'sagittarius'
    | 'scorpio'
    | 'taurus'
    | 'virgo';

declare function getZodiacSign(date: DateTime): ZodiacSign;
```

## See also

- [`getMoonPhase`](/utils/date/getMoonPhase)
- [`getSeason`](/utils/date/getSeason)
