import { type ComponentPublicInstance, onScopeDispose, type Ref, watch } from 'vue';
import { unwrapElement } from '../util';

type EligibleElement = HTMLElement | ComponentPublicInstance;

type SharedObservation = {
    readonly callbacks: Set<MutationCallback>;
    readonly observer: MutationObserver;
};

const elementObservations = new WeakMap<Element, Map<string, SharedObservation>>();

function optionsKey(options: MutationObserverInit): string {
    const normalized: Record<string, unknown> = {};

    for (const key of Object.keys(options).sort()) {
        normalized[key] = key === 'attributeFilter' && options.attributeFilter
            ? [...options.attributeFilter].sort()
            : options[key as keyof MutationObserverInit];
    }

    return JSON.stringify(normalized);
}

function observe(element: HTMLElement, callback: MutationCallback, key: string, options: MutationObserverInit): void {
    let observations = elementObservations.get(element);

    if (!observations) {
        observations = new Map();
        elementObservations.set(element, observations);
    }

    let observation = observations.get(key);

    if (!observation) {
        const callbacks = new Set<MutationCallback>();
        const observer = new MutationObserver((records, observer) => {
            for (const sharedCallback of callbacks) {
                sharedCallback(records, observer);
            }
        });

        observer.observe(element, options);
        observation = {callbacks, observer};
        observations.set(key, observation);
    }

    observation.callbacks.add(callback);
}

function unobserve(element: HTMLElement, callback: MutationCallback, key: string): void {
    const observations = elementObservations.get(element);
    const observation = observations?.get(key);

    if (!observations || !observation) {
        return;
    }

    observation.callbacks.delete(callback);

    if (observation.callbacks.size > 0) {
        return;
    }

    observation.observer.disconnect();
    observations.delete(key);

    if (observations.size === 0) {
        elementObservations.delete(element);
    }
}

export default function <TElement extends EligibleElement>(elementRef: Ref<TElement | null>, callback: MutationCallback, options?: MutationObserverInit): void {
    options ??= {
        attributes: true
    };

    const key = optionsKey(options);
    const initialOptions = options;

    let observed: HTMLElement | null = null;

    const stop = watch(elementRef, elementRef => {
        cleanup();

        const element = unwrapElement(elementRef);

        if (!element) {
            return;
        }

        observe(element, callback, key, initialOptions);
        observed = element;
    }, {immediate: true});

    function cleanup(): void {
        if (!observed) {
            return;
        }

        unobserve(observed, callback, key);
        observed = null;
    }

    function dispose(): void {
        cleanup();
        stop();
    }

    onScopeDispose(dispose);
}
