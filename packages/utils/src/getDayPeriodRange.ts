import { DateTime } from 'luxon';
import type { DayPeriod } from './getDayPeriod';

export default function (period: DayPeriod): [DateTime, DateTime] {
    const dt = DateTime.now();

    switch (period) {
        case 'afternoon':
            return [
                dt.set({hour: 12, minute: 0, second: 0, millisecond: 0}),
                dt.set({hour: 17, minute: 0, second: 0, millisecond: 0})
            ];

        case 'evening':
            return [
                dt.set({hour: 17, minute: 0, second: 0, millisecond: 0}),
                dt.set({hour: 22, minute: 0, second: 0, millisecond: 0})
            ];

        case 'morning':
            return [
                dt.set({hour: 5, minute: 0, second: 0, millisecond: 0}),
                dt.set({hour: 12, minute: 0, second: 0, millisecond: 0})
            ];

        case 'night':
            return [
                dt.set({hour: 22, minute: 0, second: 0, millisecond: 0}),
                dt.set({hour: 22, minute: 0, second: 0, millisecond: 0}).plus({hours: 7})
            ];
    }
}
