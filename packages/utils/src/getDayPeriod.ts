import type { DateTime } from 'luxon';

export type DayPeriod =
    | 'afternoon'
    | 'evening'
    | 'morning'
    | 'night';

export default function (date: DateTime): DayPeriod {
    if (date.hour >= 5 && date.hour < 12) return 'morning';
    if (date.hour >= 12 && date.hour < 17) return 'afternoon';
    if (date.hour >= 17 && date.hour < 22) return 'evening';
    return 'night';
}
