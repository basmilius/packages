import { debounce } from '@basmilius/utils';

export default function <T extends (...args: any[]) => any>(fn: T, delay: number): T {
    return debounce(fn, delay) as T;
}
