import { PARENT, PARENT_KEY } from '../symbols';
import type DtoInstance from '../instance';
import isDto from './isDto';
import isProxiedArray from './isProxiedArray';
import relateDtoTo from './relateDtoTo';

/**
 * Creates relationships between the given value and dto.
 */
export default function (dto: DtoInstance<unknown>, key: string, value: unknown): void {
    if (isDto(value)) {
        relateDtoTo(value, dto, key);
    } else if (isProxiedArray(value)) {
        for (const item of value) {
            if (!isDto(item)) {
                continue;
            }

            relateDtoTo(item, dto, key);
        }

        value[PARENT] = dto;
        value[PARENT_KEY] = key;
    }
}
