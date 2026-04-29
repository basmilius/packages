---
outline: deep
---

# getSeasonalMood

Maps a [`Season`](/utils/date/getSeason) to a single-word mood label that can be used to drive theming, copy or imagery.

## Importing

```ts
import { getSeasonalMood } from '@basmilius/utils';
import type { SeasonMood } from '@basmilius/utils';
```

## Usage

```ts
import { getSeason, getSeasonalMood } from '@basmilius/utils';
import { DateTime } from 'luxon';

const season = getSeason('nl', DateTime.fromISO('2026-04-29'));
if (season) {
    getSeasonalMood(season); // => 'fresh'
}
```

## Parameters

| Name     | Type     | Description                       |
|----------|----------|-----------------------------------|
| `season` | `Season` | The season to derive a mood for.  |

## Returns

`SeasonMood` — one of:

- `'fresh'` for `'spring'`.
- `'energetic'` for `'summer'`.
- `'cozy'` for `'autumn'`.
- `'warm'` for `'winter'`.

## Type signature

```ts
type SeasonMood = 'cozy' | 'energetic' | 'fresh' | 'warm';

declare function getSeasonalMood(season: Season): SeasonMood;
```

## See also

- [`getSeason`](/utils/date/getSeason)
