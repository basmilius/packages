import { MAGIC_DTO, type SerializedDto } from './types';

/**
 * Type guard to check if a value is a serialized DTO object.
 * Checks for array structure and magic marker.
 */
export default function (obj: unknown): obj is SerializedDto {
    return Array.isArray(obj) && obj[0] === MAGIC_DTO;
}
