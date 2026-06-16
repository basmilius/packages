<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import { useResizeObserver } from '@basmilius/common';

    const target = useTemplateRef<HTMLTextAreaElement>('target');
    const size = ref({width: 0, height: 0});

    useResizeObserver(target, entries => {
        for (const entry of entries) {
            size.value = {
                width: Math.round(entry.contentRect.width),
                height: Math.round(entry.contentRect.height)
            };
        }
    });
</script>

<template>
    <div class="demo">
        <p class="hint">Drag the bottom-right corner to resize.</p>
        <textarea ref="target" class="resizable">Resize me</textarea>
        <p class="readout">{{ size.width }} × {{ size.height }} px</p>
    </div>
</template>

<style scoped>
    .demo {
        padding: 24px;
        border: 1px solid var(--vp-c-border);
        border-radius: 12px;
        background: var(--vp-c-bg-soft);
    }

    .hint {
        margin: 0 0 12px;
        color: var(--vp-c-text-2);
        font-size: 14px;
    }

    .resizable {
        display: block;
        width: 220px;
        height: 110px;
        min-width: 120px;
        min-height: 70px;
        max-width: 100%;
        padding: 12px;
        border: 1px solid var(--vp-c-border);
        border-radius: 8px;
        background: var(--vp-c-bg);
        font-family: var(--vp-font-family-mono);
        font-size: 14px;
        color: var(--vp-c-text-1);
        resize: both;
    }

    .readout {
        margin: 16px 0 0;
        font-family: var(--vp-font-family-mono);
        font-size: 18px;
        font-weight: 600;
        color: var(--vp-c-brand-1);
    }
</style>
