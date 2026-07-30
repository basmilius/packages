---
outline: deep
---

# useSpring

Animate a single number towards a target with a physical spring. `set(target, {velocity})` retargets the animation and can inject a starting velocity, so a gesture's release speed carries straight into the motion. Feeding `set` a moving target every frame makes a dragged surface trail the pointer. When the user prefers reduced motion (or on the server) `set` snaps instead of animating, and the animation auto-stops on scope dispose.

## Importing

```ts
import { useSpring } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useSpring } from '@basmilius/common';

    const x = useSpring(0, {stiffness: 420, damping: 32});

    function moveTo(target: number): void {
        x.set(target, {velocity: 2});
    }
</script>

<template>
    <div :style="{transform: `translateX(${x.value}px)`}"/>
    <button @click="moveTo(320)">Move</button>
</template>
```

`snap` jumps to a value instantly, `stop` halts the animation, and `velocity()` reads the current velocity in units per millisecond.

## Options

| Field       | Type     | Default | Description                                                        |
|-------------|----------|---------|--------------------------------------------------------------------|
| `damping`   | `number` | `38`    | Resistance that settles the spring; higher values overshoot less.  |
| `mass`      | `number` | `1`     | Inertia of the animated value; higher values feel heavier.         |
| `stiffness` | `number` | `360`   | Pull towards the target; higher values move faster.                |
| `precision` | `number` | `.1`    | Distance and velocity at which the spring is considered at rest.   |

`set` accepts an additional `velocity` field (default `0`) that injects a starting velocity for that retarget.

The returned object exposes the animated value alongside four methods:

| Member             | Signature                                             | Description                                                         |
|--------------------|-------------------------------------------------------|---------------------------------------------------------------------|
| `value`            | `Readonly<Ref<number>>`                               | The current animated value.                                         |
| `set`              | `(target: number, options?: UseSpringSetOptions) => void` | Retargets the spring, optionally with a starting velocity.      |
| `snap`             | `(value: number) => void`                             | Jumps to a value instantly, without animating.                     |
| `stop`             | `() => void`                                          | Halts the running animation at the current value.                  |
| `velocity`         | `() => number`                                        | Reads the current velocity, in units per millisecond.              |

## Type signature

```ts
type SpringProfile = {
    readonly damping?: number;
    readonly mass?: number;
    readonly stiffness?: number;
};

type UseSpringOptions = SpringProfile & {
    readonly precision?: number;
};

type UseSpringSetOptions = SpringProfile & {
    readonly velocity?: number;
};

type UseSpringReturn = {
    readonly value: Readonly<Ref<number>>;
    set(target: number, options?: UseSpringSetOptions): void;
    snap(value: number): void;
    stop(): void;
    velocity(): number;
};

declare function useSpring(
    initial: number,
    options?: UseSpringOptions
): UseSpringReturn;
```

## See also

- [`prefersReducedMotion`](/utils/dom/prefersReducedMotion)
- [`usePointerDrag`](/common/composable/usePointerDrag)
- [`useWheelDrag`](/common/composable/useWheelDrag)
