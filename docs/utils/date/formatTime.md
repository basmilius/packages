---
outline: deep
---

# formatTime

Formats a Luxon `DateTime` as a localized two-digit hour and minute string.

## Importing

```ts
import { formatTime } from '@basmilius/utils';
```

## Usage

```ts
import { formatTime } from '@basmilius/utils';
import { DateTime } from 'luxon';

formatTime(DateTime.fromISO('2026-04-29T14:30'));
// => '02:30 PM' (en-US)
// => '14:30'    (nl-NL)
```

## Parameters

| Name       | Type       | Description                          |
|------------|------------|--------------------------------------|
| `dateTime` | `DateTime` | The Luxon `DateTime` to format.      |

## Returns

`string` — formatted with `hour: '2-digit'`, `minute: '2-digit'`.

## Type signature

```ts
declare function formatTime(dateTime: DateTime): string;
```

## See also

- [`formatDateTime`](/utils/date/formatDateTime)
- [`formatDate`](/utils/date/formatDate)
