import { type ComponentPublicInstance, type MaybeRef, unref } from 'vue';
import { isHtmlElement } from '@basmilius/utils';

export default function <TElement extends HTMLElement>(elementRef: MaybeRef<TElement | ComponentPublicInstance | null | undefined>): TElement | null {
    const element = unref(elementRef);

    if (!element) {
        return null;
    }

    if (isHtmlElement(element)) {
        return element as TElement;
    }

    return element.$el ?? null;
}
