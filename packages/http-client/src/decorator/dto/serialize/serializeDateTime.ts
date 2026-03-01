import type { DateTime } from 'luxon';
import { SERIALIZED_DATETIME } from '../const';
import type { SerializedDateTime } from './types';

export default function (obj: DateTime): SerializedDateTime {
    return [SERIALIZED_DATETIME, obj.toISO({
        extendedZone: true,
        includeOffset: true
    })];
}
