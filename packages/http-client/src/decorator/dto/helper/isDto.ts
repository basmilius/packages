import { NAME } from '../symbols';
import type DtoInstance from '../instance';

/**
 * Checks if the given object is a dto.
 */
export default function (obj: unknown): obj is DtoInstance<unknown> {
    return typeof obj === 'object' && !!obj && NAME in obj;
}
