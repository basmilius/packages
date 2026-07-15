import { markStatic } from '@regle/core';

export function asFieldValue<TValue>(value: TValue): TValue {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return markStatic(value as object) as TValue;
    }

    return value;
}
