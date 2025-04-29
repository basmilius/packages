import type { DateTime } from 'luxon';

export default function (dateTime: DateTime): string {
    return dateTime.toLocaleString({
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
