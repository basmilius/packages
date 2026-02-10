import { PARENT, PARENT_KEY } from '../symbols';
import type DtoInstance from '../instance';
import isDto from './isDto';
import relateDtoTo from './relateDtoTo';

/**
 * Creates relationships between the given value and dto.
 * Optimized to use single-pass iteration for arrays instead of filtering twice.
 */
export default function (dto: DtoInstance<unknown>, key: string, value: unknown): void {
    if (isDto(value)) {
        relateDtoTo(value, dto, key);
    } else if (Array.isArray(value)) {
        // Single-pass iteration: check and relate DTOs in one loop
        // More efficient than .some() + .filter() which iterates twice
        let hasDtos = false;
        for (const item of value) {
            if (isDto(item)) {
                relateDtoTo(item, dto, key);
                hasDtos = true;
            }
        }

        // Only set parent if array contains DTOs
        if (hasDtos) {
            value[PARENT] = dto;
            value[PARENT_KEY] = key;
        }
    }
}
