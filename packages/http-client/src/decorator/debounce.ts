import { debounce } from '@basmilius/utils';

export default function (interval: number) {
    return (target: object, _: string, descriptor: PropertyDescriptor) => {
        descriptor.value = debounce(descriptor.value, interval, target);
    };
}
