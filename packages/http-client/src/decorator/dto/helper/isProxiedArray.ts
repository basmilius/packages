import { PARENT } from '../symbols';
import type { ProxiedArray } from '../types';

export default function (value: unknown): value is ProxiedArray {
    return Array.isArray(value) && PARENT in value;
}
