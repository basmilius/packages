import { PARENT, PARENT_KEY } from '../symbols';
import type DtoInstance from '../instance';
import isDto from './isDto';
import unrelateDtoFrom from './unrelateDtoFrom';

/**
 * Removes relationships between the given value and dto.
 */
export default function (dto: DtoInstance<unknown>, value: unknown): void {
    if (isDto(value)) {
        unrelateDtoFrom(value, dto);
    } else if (Array.isArray(value)) {
        for (const item of value) {
            if (isDto(item)) {
                unrelateDtoFrom(item, dto);
            }
        }

        value[PARENT] = undefined;
        value[PARENT_KEY] = undefined;
    }
}
