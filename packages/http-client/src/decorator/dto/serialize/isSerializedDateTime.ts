import { MAGIC_DATETIME, type SerializedDateTime } from './types';

/**
 * Type guard to check if a value is a serialized DateTime object.
 * Checks for array structure and magic marker.
 */
export default function (obj: unknown): obj is SerializedDateTime {
    return Array.isArray(obj) && obj[0] === MAGIC_DATETIME;
}
