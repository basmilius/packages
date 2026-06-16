import { type ComponentPublicInstance, type MaybeRefOrGetter, toValue } from 'vue';
import { isHtmlElement } from '@basmilius/utils';

export type EligibleTarget = HTMLElement | ComponentPublicInstance | Window | Document;

export default function (target: MaybeRefOrGetter<EligibleTarget | null | undefined>): HTMLElement | Window | Document | null {
    const value = toValue(target);

    if (!value) {
        return null;
    }

    if (value instanceof Window || value instanceof Document || isHtmlElement(value)) {
        return value;
    }

    return (value as ComponentPublicInstance).$el ?? null;
}
