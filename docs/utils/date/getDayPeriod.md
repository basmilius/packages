---
outline: deep
---

# getDayPeriod

Returns the part of the day for a given `DateTime`: morning, afternoon, evening or night.

## Importing

```ts
import { getDayPeriod } from '@basmilius/utils';
import type { DayPeriod } from '@basmilius/utils';
```

## Usage

```ts
import { getDayPeriod } from '@basmilius/utils';
import { DateTime } from 'luxon';

getDayPeriod(DateTime.fromObject({ hour: 8 }));  // => 'morning'
getDayPeriod(DateTime.fromObject({ hour: 14 })); // => 'afternoon'
getDayPeriod(DateTime.fromObject({ hour: 19 })); // => 'evening'
getDayPeriod(DateTime.fromObject({ hour: 23 })); // => 'night'
```

## Parameters

| Name   | Type       | Description                       |
|--------|------------|-----------------------------------|
| `date` | `DateTime` | The moment to classify.           |

## Returns

`DayPeriod` — one of:

- `'morning'` from 05:00 up to (but not including) 12:00.
- `'afternoon'` from 12:00 up to 17:00.
- `'evening'` from 17:00 up to 22:00.
- `'night'` for all other hours.

## Type signature

```ts
type DayPeriod = 'afternoon' | 'evening' | 'morning' | 'night';

declare function getDayPeriod(date: DateTime): DayPeriod;
```

## See also

- [`getDayPeriodRange`](/utils/date/getDayPeriodRange)
- [`getCircadianPhase`](/utils/date/getCircadianPhase)
