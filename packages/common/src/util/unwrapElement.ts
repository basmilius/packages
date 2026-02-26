import { type ComponentPublicInstance, type MaybeRef, unref } from 'vue';
import { isHtmlElement } from '@basmilius/utils';

type EligibleElement = HTMLElement | ComponentPublicInstance;

export default function <TElement extends EligibleElement>(elementRef: MaybeRef<TElement>): HTMLElement {
    const element = unref(elementRef);

    if (isHtmlElement(element)) {
        return element;
    }

    return element.$el;
}
