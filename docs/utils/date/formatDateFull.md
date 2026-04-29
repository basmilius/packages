---
outline: deep
---

# formatDateFull

Formats a Luxon `DateTime` as a long weekday plus day and month — without a year. Useful for headers in calendar UIs where the year is implicit.

## Importing

```ts
import { formatDateFull } from '@basmilius/utils';
```

## Usage

```ts
import { formatDateFull } from '@basmilius/utils';
import { DateTime } from 'luxon';

formatDateFull(DateTime.fromISO('2026-04-29'));
// => 'Wednesday, April 29' (en-US)
// => 'woensdag 29 april'   (nl-NL)
```

## Parameters

| Name       | Type       | Description                          |
|------------|------------|--------------------------------------|
| `dateTime` | `DateTime` | The Luxon `DateTime` to format.      |

## Returns

`string` — the date formatted with `weekday: 'long'`, `day: 'numeric'`, `month: 'long'`.

## Type signature

```ts
declare function formatDateFull(dateTime: DateTime): string;
```

## See also

- [`formatDate`](/utils/date/formatDate)
- [`formatDateTime`](/utils/date/formatDateTime)
