---
outline: deep
---

# useWheelDrag

Treat a trackpad two-finger swipe (wheel events) over an element as one continuous drag gesture, reporting the same `dx`/`dy`/`vx`/`vy` shape as [`usePointerDrag`](/common/composable/usePointerDrag). Because a trackpad never signals that the fingers lifted, the gesture ends after events stop arriving for `idle` milliseconds (default `80`), which is once the flick's momentum runs out. Pinch-zoom (ctrl or meta held with the wheel) is ignored, and the composable is inert on the server.

## Importing

```ts
import { useWheelDrag } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import { useWheelDrag } from '@basmilius/common';

    const track = useTemplateRef<HTMLDivElement>('track');
    const offset = ref(0);

    const {isWheeling} = useWheelDrag(track, {
        axis: 'x',
        onMove(context) {
            offset.value += context.dx;
        }
    });
</script>

<template>
    <div ref="track" :class="{wheeling: isWheeling}">
        <div :style="{transform: `translateX(${offset}px)`}"/>
    </div>
</template>
```

`axis` picks the dominant direction that starts the gesture. Line and page wheel deltas are converted to pixels, so `dx`/`dy` are always reported in pixels. Besides `isWheeling`, the composable returns a `cancel()` method that ends the gesture immediately.

## Options

| Field     | Type                                      | Default | Description                                                            |
|-----------|-------------------------------------------|---------|------------------------------------------------------------------------|
| `axis`    | `'x' \| 'y'`                              | `'x'`   | Dominant direction that starts and drives the gesture.                 |
| `idle`    | `number`                                  | `80`    | Milliseconds without wheel events after which the gesture ends.        |
| `onEnd`   | `(context: WheelDragContext) => void`     |         | Called once the gesture ends after the idle timeout.                   |
| `onMove`  | `(context: WheelDragContext) => void`     |         | Called on every wheel event while the gesture is active.               |
| `onStart` | `(event: WheelEvent) => boolean \| void`  |         | Called when a gesture is about to start; return `false` to cancel it.  |

## Type signature

```ts
type DragContext = {
    readonly dx: number;
    readonly dy: number;
    readonly vx: number;
    readonly vy: number;
};

type WheelDragAxis = 'x' | 'y';

type WheelDragContext = DragContext & {
    readonly event: WheelEvent;
};

type UseWheelDragOptions = {
    readonly axis?: WheelDragAxis;
    readonly idle?: number;
    onEnd?(context: WheelDragContext): void;
    onMove?(context: WheelDragContext): void;
    onStart?(event: WheelEvent): boolean | void;
};

type UseWheelDragReturn = {
    readonly isWheeling: Readonly<Ref<boolean>>;
    cancel(): void;
};

declare function useWheelDrag<TElement extends HTMLElement>(
    elementRef: MaybeRef<TElement | null | undefined>,
    options?: UseWheelDragOptions
): UseWheelDragReturn;
```

## See also

- [`usePointerDrag`](/common/composable/usePointerDrag)
- [`useSpring`](/common/composable/useSpring)
