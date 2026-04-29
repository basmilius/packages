---
outline: deep
---

# getWorkdayPeriod

Classifies a `DateTime` as `work`, `break` or `off` based on a standard nine-to-five schedule with a one-hour lunch break, treating Saturday and Sunday as `off`.

## Importing

```ts
import { getWorkdayPeriod } from '@basmilius/utils';
import type { WorkdayPeriod } from '@basmilius/utils';
```

## Usage

```ts
import { getWorkdayPeriod } from '@basmilius/utils';
import { DateTime } from 'luxon';

// 2026-04-29 is a Wednesday.
getWorkdayPeriod(DateTime.fromISO('2026-04-29T10:00')); // => 'work'
getWorkdayPeriod(DateTime.fromISO('2026-04-29T12:30')); // => 'break'
getWorkdayPeriod(DateTime.fromISO('2026-04-29T18:00')); // => 'off'

// Saturday is always off.
getWorkdayPeriod(DateTime.fromISO('2026-05-02T10:00')); // => 'off'
```

## Parameters

| Name   | Type       | Description                       |
|--------|------------|-----------------------------------|
| `date` | `DateTime` | The moment to classify.           |

## Returns

`WorkdayPeriod` — one of:

- `'work'` between 09:00 and 12:00, and between 13:00 and 17:00 on weekdays.
- `'break'` between 12:00 and 13:00 on weekdays.
- `'off'` outside of working hours and on weekends.

## Type signature

```ts
type WorkdayPeriod = 'break' | 'off' | 'work';

declare function getWorkdayPeriod(date: DateTime): WorkdayPeriod;
```

## See also

- [`getDayPeriod`](/utils/date/getDayPeriod)
- [`getCircadianPhase`](/utils/date/getCircadianPhase)
