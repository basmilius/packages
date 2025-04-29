import type { Descriptors } from '@/index';

export default function (obj: Function): Descriptors {
    const entries: Descriptors = {};

    do {
        if (obj.name === '') {
            break;
        }

        for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(obj.prototype))) {
            if (['constructor', 'clone', 'toJSON'].includes(key)) {
                continue;
            }

            if (!descriptor.get && !descriptor.set) {
                continue;
            }

            entries[key] = descriptor;
        }
    } while (obj = Object.getPrototypeOf(obj));

    return entries;
}
