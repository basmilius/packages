<script setup lang="ts">
    import { ref } from 'vue';
    import { useInterval } from '@basmilius/common';

    const ticks = ref(0);
    const delay = ref(1000);

    useInterval(delay, () => {
        ticks.value++;
    });
</script>

<template>
    <div class="demo">
        <p class="count">{{ ticks }}</p>
        <p class="hint">Ticks every {{ delay }}ms. The interval reads its delay reactively:</p>

        <div class="actions">
            <button :class="{active: delay === 250}" @click="delay = 250">Fast · 250ms</button>
            <button :class="{active: delay === 1000}" @click="delay = 1000">Normal · 1s</button>
            <button :class="{active: delay === 2000}" @click="delay = 2000">Slow · 2s</button>
        </div>
    </div>
</template>

<style scoped>
    .demo {
        padding: 24px;
        border: 1px solid var(--vp-c-border);
        border-radius: 12px;
        background: var(--vp-c-bg-soft);
        text-align: center;
    }

    .count {
        margin: 0;
        font-family: var(--vp-font-family-mono);
        font-size: 48px;
        font-weight: 700;
        color: var(--vp-c-brand-1);
        line-height: 1;
    }

    .hint {
        margin: 12px 0 16px;
        color: var(--vp-c-text-2);
        font-size: 14px;
    }

    .actions {
        display: flex;
        justify-content: center;
        gap: 8px;
    }

    .actions button {
        padding: 6px 14px;
        border: 1px solid var(--vp-c-border);
        border-radius: 8px;
        background: var(--vp-c-bg);
        font-size: 13px;
        color: var(--vp-c-text-1);
    }

    .actions button.active {
        border-color: var(--vp-c-brand-1);
        color: var(--vp-c-brand-1);
    }
</style>
