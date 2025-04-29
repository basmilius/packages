import type { DateTime } from 'luxon';

export default function (dateTime: DateTime): string {
    return dateTime.toLocaleString({
        month: 'long',
    });
}
