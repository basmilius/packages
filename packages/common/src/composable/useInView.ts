import { type ComponentPublicInstance, type MaybeRefOrGetter, onScopeDispose, type Ref, ref, toValue, watch } from 'vue';
import { unwrapElement } from '../util';

type EligibleElement = HTMLElement | ComponentPublicInstance;

type UseInViewOptions = {
    readonly root?: Element | Document | null;
    readonly rootMargin?: string;
    readonly threshold?: number | number[];
    readonly once?: boolean;
};

export default function <TElement extends EligibleElement>(target: MaybeRefOrGetter<TElement | null | undefined>, options?: UseInViewOptions): Ref<boolean> {
    const {root, rootMargin, threshold, once} = options ?? {};
    const isInView = ref(false);

    let observer: IntersectionObserver | undefined;

    const stopWatch = watch(() => toValue(target), value => {
        cleanup();

        const element = unwrapElement(value);

        if (!element) {
            return;
        }

        observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                isInView.value = entry.isIntersecting;

                if (entry.isIntersecting && once) {
                    cleanup();
                }
            }
        }, {root, rootMargin, threshold});

        observer.observe(element);
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
        stopWatch();
    }

    onScopeDispose(dispose);

    return isInView;
}
