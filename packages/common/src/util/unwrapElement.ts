import { type ComponentPublicInstance, type MaybeRef, unref } from 'vue';
import { isHtmlElement } from '@basmilius/utils';

type EligibleElement = HTMLElement | ComponentPublicInstance;

export default function <TElement extends EligibleElement>(elementRef: MaybeRef<TElement | null | undefined>): HTMLElement | null {
    const element = unref(elementRef);

    if (!element) {
        return null;
    }

    if (isHtmlElement(element)) {
        return element;
    }

    return element.$el ?? null;
}
