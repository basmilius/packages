import { assertDto, isDto } from './helper';
import { ARGS, DESCRIPTORS, NAME } from './symbols';
import { DTO_CLASS_MAP } from './map';
import type DtoInstance from './instance';

/**
 * Returns a clone of the dto.
 */
export default function <T>(this: DtoInstance<T>): DtoInstance<T> {
    const instance = this;
    assertDto(instance);

    const clazz = DTO_CLASS_MAP[instance[NAME]];
    const clone = new clazz(...instance[ARGS]);

    for (const [key, descriptor] of Object.entries(this[DESCRIPTORS])) {
        if (!descriptor.set) {
            continue;
        }

        clone[key] = isDto(this[key]) ? this[key].clone() : this[key];
    }

    return clone as DtoInstance<T>;
}
