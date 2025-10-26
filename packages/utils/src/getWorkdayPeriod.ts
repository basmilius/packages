import type { DateTime } from 'luxon';

export type WorkdayPeriod =
    | 'break'
    | 'off'
    | 'work';

export default function (date: DateTime): WorkdayPeriod {
    if (date.weekday === 6 || date.weekday === 7) return 'off';

    if (date.hour >= 9 && date.hour < 12) return 'work';
    if (date.hour >= 12 && date.hour < 13) return 'break';
    if (date.hour >= 13 && date.hour < 17) return 'work';
    return 'off';
}
