---
outline: deep
---

# getSeason

Returns the meteorological season for a country and date. Hemisphere is derived from the country code via [`isNorthernHemisphere`](/utils/geo/isNorthernHemisphere).

## Importing

```ts
import { getSeason } from '@basmilius/utils';
import type { Season } from '@basmilius/utils';
```

## Usage

```ts
import { getSeason } from '@basmilius/utils';
import { DateTime } from 'luxon';

getSeason('nl', DateTime.fromISO('2026-04-29')); // => 'spring'
getSeason('au', DateTime.fromISO('2026-04-29')); // => 'autumn'
getSeason('zz', DateTime.now());                  // => null
```

## Parameters

| Name          | Type          | Description                                                       |
|---------------|---------------|-------------------------------------------------------------------|
| `countryCode` | `CountryCode` | ISO 3166-1 alpha-2 country code (lowercase).                      |
| `date`        | `DateTime`    | The date to classify.                                              |

## Returns

`Season | null` — one of `'autumn'`, `'spring'`, `'summer'`, `'winter'`, or `null` when the country code is unknown.

## Type signature

```ts
type Season = 'autumn' | 'spring' | 'summer' | 'winter';

declare function getSeason(countryCode: CountryCode, date: DateTime): Season | null;
```

## See also

- [`getSeasonalMood`](/utils/date/getSeasonalMood)
- [`isNorthernHemisphere`](/utils/geo/isNorthernHemisphere)
