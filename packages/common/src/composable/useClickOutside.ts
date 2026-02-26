import { type ComponentPublicInstance, onMounted, onUnmounted, type Ref, ref, unref, watchEffect } from 'vue';
import { unwrapElement } from '../util';

type EligibleElement = HTMLElement | ComponentPublicInstance;
type Handler = ((evt: PointerEvent) => void) | ((evt: PointerEvent) => Promise<void>);

export default function <TElement extends EligibleElement>(elementRefs: Ref<TElement> | Ref<TElement>[], enabled: boolean | Ref<boolean>, onOutsideClick: Handler): void {
    const elements = ref<HTMLElement[]>([]);

    onMounted(() => {
        document.addEventListener('pointerdown', onBodyClick);
    });

    onUnmounted(() => {
        document.removeEventListener('pointerdown', onBodyClick);
    });

    function onBodyClick(evt: PointerEvent): void {
        if (!unref(enabled)) {
            return;
        }

        const isInside = unref(elements).some(element => element.contains(evt.target as Node));
        !isInside && onOutsideClick(evt);
    }

    watchEffect(() => {
        const newElements: HTMLElement[] = [];

        (Array.isArray(elementRefs) ? elementRefs : [elementRefs]).forEach(elementRef => {
            const element = unwrapElement(elementRef);

            if (!element) {
                return;
            }

            newElements.push(element);
        });

        elements.value = newElements;
    });
}
