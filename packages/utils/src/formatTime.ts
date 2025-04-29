import type { DateTime } from 'luxon';

export default function (dateTime: DateTime): string {
    return dateTime.toLocaleString({
        hour: '2-digit',
        minute: '2-digit'
    });
}
