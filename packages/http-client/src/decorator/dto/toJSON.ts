import { isDto } from './helper';
import type DtoInstance from './instance';
import { PROPERTIES } from './symbols';

/**
 * Returns the json object representation of the dto.
 */
export default function (this: DtoInstance<unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const property of this[PROPERTIES]) {
        let value: unknown = this[property];

        if (isDto(value)) {
            value = value.toJSON();
        }

        result[property] = value;
    }

    return result;
}
