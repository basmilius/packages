import { SERIALIZED_DATETIME } from '../const';
import type { SerializedDateTime } from './types';

export default function (obj: unknown): obj is SerializedDateTime {
    return Array.isArray(obj) && obj[0] === SERIALIZED_DATETIME;
}
