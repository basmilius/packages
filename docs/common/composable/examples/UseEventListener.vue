<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import { useEventListener } from '@basmilius/common';

    const area = useTemplateRef<HTMLDivElement>('area');
    const position = ref({x: 0, y: 0});
    const inside = ref(false);
    const clicks = ref(0);

    useEventListener(area, 'pointermove', evt => {
        const rect = (evt.currentTarget as HTMLElement).getBoundingClientRect();
        position.value = {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        };
    });

    useEventListener(area, ['pointerenter', 'pointerleave'], evt => {
        inside.value = evt.type === 'pointerenter';
    });

    useEventListener(area, 'click', () => {
        clicks.value++;
    });
</script>

<template>
    <div ref="area" class="demo" :class="{active: inside}">
        <p class="hint">Move, hover and click anywhere inside this box.</p>

        <dl class="readout">
            <div>
                <dt>Pointer</dt>
                <dd>{{ position.x }} × {{ position.y }}</dd>
            </div>
            <div>
                <dt>Inside</dt>
                <dd>{{ inside ? 'yes' : 'no' }}</dd>
            </div>
            <div>
                <dt>Clicks</dt>
                <dd>{{ clicks }}</dd>
            </div>
        </dl>
    </div>
</template>

<style scoped>
    .demo {
        padding: 24px;
        border: 1px solid var(--vp-c-border);
        border-radius: 12px;
        background: var(--vp-c-bg-soft);
        cursor: crosshair;
        transition: border-color .2s, background .2s;
        user-select: none;
    }

    .demo.active {
        border-color: var(--vp-c-brand-1);
    }

    .hint {
        margin: 0 0 16px;
        color: var(--vp-c-text-2);
        font-size: 14px;
    }

    .readout {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin: 0;
    }

    .readout div {
        padding: 12px;
        border-radius: 8px;
        background: var(--vp-c-bg);
        text-align: center;
    }

    .readout dt {
        margin-bottom: 4px;
        color: var(--vp-c-text-3);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: .04em;
    }

    .readout dd {
        margin: 0;
        font-family: var(--vp-font-family-mono);
        font-size: 18px;
        font-weight: 600;
        color: var(--vp-c-brand-1);
    }
</style>
