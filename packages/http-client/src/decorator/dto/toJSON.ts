import { isDto } from './helper';
import { PROPERTIES } from './symbols';
import type DtoInstance from './instance';

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
