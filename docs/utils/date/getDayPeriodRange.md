---
outline: deep
---

# getDayPeriodRange

Returns the start and end `DateTime` of a [`DayPeriod`](/utils/date/getDayPeriod) anchored on the current day. Useful for highlighting a time window in a schedule.

## Importing

```ts
import { getDayPeriodRange } from '@basmilius/utils';
```

## Usage

```ts
import { getDayPeriodRange } from '@basmilius/utils';

const [start, end] = getDayPeriodRange('morning');
// start: today at 05:00
// end:   today at 12:00

const [eveningStart, eveningEnd] = getDayPeriodRange('evening');
// eveningStart: today at 17:00
// eveningEnd:   today at 22:00
```

## Parameters

| Name     | Type        | Description                                    |
|----------|-------------|------------------------------------------------|
| `period` | `DayPeriod` | The named period to expand into a date range.  |

## Returns

`[DateTime, DateTime]` — `[start, end]` tuple. For `night`, the end falls on the next day at 05:00 (22:00 plus seven hours).

## Type signature

```ts
type DayPeriod = 'afternoon' | 'evening' | 'morning' | 'night';

declare function getDayPeriodRange(period: DayPeriod): [DateTime, DateTime];
```

## See also

- [`getDayPeriod`](/utils/date/getDayPeriod)
