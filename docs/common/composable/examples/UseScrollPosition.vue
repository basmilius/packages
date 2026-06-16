<script setup lang="ts">
    import { computed, useTemplateRef } from 'vue';
    import { useScrollPosition } from '@basmilius/common';

    const scroller = useTemplateRef<HTMLDivElement>('scroller');
    const {x, y} = useScrollPosition(scroller);

    const progress = computed(() => {
        const element = scroller.value;

        if (!element) {
            return 0;
        }

        const max = element.scrollHeight - element.clientHeight;

        return max > 0 ? Math.round((y.value / max) * 100) : 0;
    });
</script>

<template>
    <div class="demo">
        <div class="readout">
            <span>y: <b>{{ y }}</b>px</span>
            <span>x: <b>{{ x }}</b>px</span>
            <span><b>{{ progress }}</b>%</span>
        </div>

        <div class="track">
            <div class="fill" :style="{width: `${progress}%`}"/>
        </div>

        <div ref="scroller" class="scroller">
            <div class="content">
                <p>Scroll this box ↓</p>
                <p v-for="line in 12" :key="line">Line {{ line }}</p>
                <p>You reached the bottom 🎉</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .demo {
        padding: 24px;
        border: 1px solid var(--vp-c-border);
        border-radius: 12px;
        background: var(--vp-c-bg-soft);
    }

    .readout {
        display: flex;
        gap: 20px;
        margin-bottom: 12px;
        font-family: var(--vp-font-family-mono);
        font-size: 14px;
        color: var(--vp-c-text-2);
    }

    .readout b {
        color: var(--vp-c-brand-1);
    }

    .track {
        height: 6px;
        margin-bottom: 16px;
        border-radius: 999px;
        overflow: hidden;
        background: var(--vp-c-bg);
    }

    .fill {
        height: 100%;
        border-radius: 999px;
        background: var(--vp-c-brand-1);
        transition: width .05s linear;
    }

    .scroller {
        height: 180px;
        overflow: auto;
        border-radius: 8px;
        background: var(--vp-c-bg);
    }

    .content {
        padding: 16px;
    }

    .content p {
        margin: 0 0 24px;
        color: var(--vp-c-text-2);
    }

    .content p:first-child {
        font-weight: 600;
        color: var(--vp-c-text-1);
    }
</style>
