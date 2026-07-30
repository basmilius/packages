---
outline: deep
---

# usePointerDrag

Track a pointer drag (mouse, touch, pen) on an element using pointer capture, reporting a `PointerDragContext` with the accumulated delta (`dx`/`dy`) and velocity (`vx`/`vy`, in pixels per millisecond) to `onMove` and `onEnd`. Only the primary button starts a drag. The element keeps ownership of its own `touch-action`, and on the server the composable is inert.

## Importing

```ts
import { usePointerDrag } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useTemplateRef } from 'vue';
    import { usePointerDrag } from '@basmilius/common';

    const surface = useTemplateRef<HTMLDivElement>('surface');

    const {isDragging} = usePointerDrag(surface, {
        threshold: 4,
        onMove(context) {
            surface.value!.style.transform = `translate(${context.dx}px, ${context.dy}px)`;
        }
    });
</script>

<template>
    <div ref="surface" :class="{dragging: isDragging}"/>
</template>
```

`threshold` sets a dead zone the pointer must travel before the drag begins, and `onStart` returning `false` cancels the drag. Enable `rebaseOnThreshold` to zero the delta at the moment the threshold is crossed, so motion starts from there rather than from the initial press. `axis` locks the reported delta to a single direction and may be a getter for reactive locking.

## Options

| Field               | Type                                             | Default    | Description                                                                 |
|---------------------|--------------------------------------------------|------------|-----------------------------------------------------------------------------|
| `axis`              | `'x' \| 'y' \| 'both'` or `() => 'x' \| 'y' \| 'both'` | `'both'`   | Restricts the reported delta to one axis; a getter re-evaluates per drag.   |
| `rebaseOnThreshold` | `boolean`                                        | `false`    | Zeroes the delta when the threshold is crossed, so motion starts from there.|
| `threshold`         | `number` or `(event: PointerEvent) => number`    | `0`        | Dead zone the pointer must travel before the drag begins.                   |
| `onCancel`          | `() => void`                                      |            | Called when the drag is canceled before it starts moving.                   |
| `onEnd`             | `(context: PointerDragContext) => void`           |            | Called once when the pointer is released.                                   |
| `onMove`            | `(context: PointerDragContext) => void`           |            | Called on every pointer move while dragging.                                |
| `onStart`           | `(event: PointerEvent) => boolean \| void`        |            | Called when a drag is about to start; return `false` to cancel it.          |

## Type signature

```ts
type DragContext = {
    readonly dx: number;
    readonly dy: number;
    readonly vx: number;
    readonly vy: number;
};

type PointerDragContext = DragContext & {
    readonly event: PointerEvent;
    readonly startX: number;
    readonly startY: number;
    readonly x: number;
    readonly y: number;
};

type PointerDragAxis = 'x' | 'y' | 'both';

type UsePointerDragOptions = {
    readonly axis?: PointerDragAxis | (() => PointerDragAxis);
    readonly rebaseOnThreshold?: boolean;
    readonly threshold?: number | ((event: PointerEvent) => number);
    onCancel?(): void;
    onEnd?(context: PointerDragContext): void;
    onMove?(context: PointerDragContext): void;
    onStart?(event: PointerEvent): boolean | void;
};

type UsePointerDragReturn = {
    readonly isDragging: Readonly<Ref<boolean>>;
};

declare function usePointerDrag<TElement extends HTMLElement>(
    elementRef: MaybeRef<TElement | null | undefined>,
    options?: UsePointerDragOptions
): UsePointerDragReturn;
```

## See also

- [`useWheelDrag`](/common/composable/useWheelDrag)
- [`useSpring`](/common/composable/useSpring)
- [`unwrapElement`](/common/util/unwrapElement)
