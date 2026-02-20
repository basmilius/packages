import type { DateTime } from 'luxon';
import { MAGIC_DATETIME, type SerializedDateTime } from './types';

/**
 * Serializes a Luxon DateTime object to an array format.
 * Includes the magic marker and ISO 8601 string representation.
 */
export default function (obj: DateTime): SerializedDateTime {
    return [MAGIC_DATETIME, obj.toISO({
        extendedZone: true,
        includeOffset: true
    })];
}
