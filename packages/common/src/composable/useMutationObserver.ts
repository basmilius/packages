import { type ComponentPublicInstance, onScopeDispose, type Ref, watch } from 'vue';
import { unwrapElement } from '../util';

type EligibleElement = HTMLElement | ComponentPublicInstance;

export default function <TElement extends EligibleElement>(elementRef: Ref<TElement | null>, callback: MutationCallback, options?: MutationObserverInit): void {
    options ??= {
        attributes: true
    };

    let observer: MutationObserver | undefined;

    const stop = watch(elementRef, elementRef => {
        cleanup();

        const element = unwrapElement(elementRef);

        if (!element) {
            return;
        }

        observer = new MutationObserver(callback);
        observer.observe(element, options);
    }, {immediate: true});

    function cleanup(): void {
        if (!observer) {
            return;
        }

        observer.disconnect();
        observer = undefined;
    }

    function dispose(): void {
        cleanup();
        stop();
    }

    onScopeDispose(dispose);
}
