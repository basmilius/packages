import { type MaybeRefOrGetter, type Ref, ref, watch } from 'vue';
import { type EligibleTarget, unwrapTarget } from '../util';
import useEventListener from './useEventListener';

type ScrollPosition = {
    readonly x: Ref<number>;
    readonly y: Ref<number>;
};

export default function (target: MaybeRefOrGetter<EligibleTarget | null | undefined>): ScrollPosition {
    const x = ref(0);
    const y = ref(0);

    function update(): void {
        const element = unwrapTarget(target);

        if (!element) {
            return;
        }

        if (element instanceof Window) {
            x.value = element.scrollX;
            y.value = element.scrollY;
        } else if (element instanceof Document) {
            x.value = element.documentElement.scrollLeft;
            y.value = element.documentElement.scrollTop;
        } else {
            x.value = element.scrollLeft;
            y.value = element.scrollTop;
        }
    }

    useEventListener(target, 'scroll', update, {passive: true});

    watch(() => unwrapTarget(target), update, {immediate: true});

    return {x, y};
}
