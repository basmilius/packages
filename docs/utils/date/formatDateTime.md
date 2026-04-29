---
outline: deep
---

# formatDateTime

Formats a Luxon `DateTime` as a long localized date together with the time as `HH:mm`.

## Importing

```ts
import { formatDateTime } from '@basmilius/utils';
```

## Usage

```ts
import { formatDateTime } from '@basmilius/utils';
import { DateTime } from 'luxon';

formatDateTime(DateTime.fromISO('2026-04-29T14:30'));
// => 'April 29, 2026, 02:30 PM' (en-US)
// => '29 april 2026 14:30'      (nl-NL)
```

## Parameters

| Name       | Type       | Description                          |
|------------|------------|--------------------------------------|
| `dateTime` | `DateTime` | The Luxon `DateTime` to format.      |

## Returns

`string` — the date-time formatted with `year: 'numeric'`, `month: 'long'`, `day: 'numeric'`, `hour: '2-digit'`, `minute: '2-digit'`.

## Type signature

```ts
declare function formatDateTime(dateTime: DateTime): string;
```

## See also

- [`formatDate`](/utils/date/formatDate)
- [`formatTime`](/utils/date/formatTime)
