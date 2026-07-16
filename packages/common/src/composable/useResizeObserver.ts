import { type ComponentPublicInstance, onScopeDispose, type Ref, watch } from 'vue';
import { unwrapElement } from '../util';

type EligibleElement = HTMLElement | ComponentPublicInstance;

let sharedObserver: ResizeObserver | undefined;
let observedCount = 0;

const elementCallbacks = new WeakMap<Element, Set<ResizeObserverCallback>>();

function getSharedObserver(): ResizeObserver {
    sharedObserver ??= new ResizeObserver((entries, observer) => {
        for (const entry of entries) {
            const callbacks = elementCallbacks.get(entry.target);

            if (!callbacks) {
                continue;
            }

            for (const callback of callbacks) {
                callback([entry], observer);
            }
        }
    });

    return sharedObserver;
}

function observe(element: HTMLElement, callback: ResizeObserverCallback, options?: ResizeObserverOptions): void {
    let callbacks = elementCallbacks.get(element);

    if (!callbacks) {
        callbacks = new Set();
        elementCallbacks.set(element, callbacks);
        getSharedObserver().observe(element, options);
        observedCount++;
    }

    callbacks.add(callback);
}

function unobserve(element: HTMLElement, callback: ResizeObserverCallback): void {
    const callbacks = elementCallbacks.get(element);

    if (!callbacks) {
        return;
    }

    callbacks.delete(callback);

    if (callbacks.size > 0) {
        return;
    }

    elementCallbacks.delete(element);
    sharedObserver?.unobserve(element);
    observedCount--;

    if (observedCount === 0) {
        sharedObserver?.disconnect();
        sharedObserver = undefined;
    }
}

export default function <TElement extends EligibleElement>(elementRef: Ref<TElement | null>, callback: ResizeObserverCallback, options?: ResizeObserverOptions): void {
    options ??= {};

    let observed: HTMLElement | null = null;

    const stop = watch(elementRef, elementRef => {
        cleanup();

        const element = unwrapElement(elementRef);

        if (!element) {
            return;
        }

        observe(element, callback, options);
        observed = element;
    }, {immediate: true});

    function cleanup(): void {
        if (!observed) {
            return;
        }

        unobserve(observed, callback);
        observed = null;
    }

    function dispose(): void {
        cleanup();
        stop();
    }

    onScopeDispose(dispose);
}
