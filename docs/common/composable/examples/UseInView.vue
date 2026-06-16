<script setup lang="ts">
    import { useTemplateRef } from 'vue';
    import { useInView } from '@basmilius/common';

    const target = useTemplateRef<HTMLDivElement>('target');
    const isInView = useInView(target, {
        threshold: 0.6
    });
</script>

<template>
    <div class="demo">
        <div class="status" :class="{in: isInView}">
            {{ isInView ? '✓ Target is in view' : 'Scroll the page — target is out of view' }}
        </div>

        <div class="rail">
            <div ref="target" class="target" :class="{in: isInView}">
                <span>Watch me</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .demo {
        border: 1px solid var(--vp-c-border);
        border-radius: 12px;
        background: var(--vp-c-bg-soft);
        overflow: hidden;
    }

    .status {
        position: sticky;
        top: 72px;
        z-index: 1;
        padding: 12px 16px;
        border-bottom: 1px solid var(--vp-c-border);
        background: var(--vp-c-bg);
        font-family: var(--vp-font-family-mono);
        font-size: 14px;
        color: var(--vp-c-text-2);
        transition: color .2s, background .2s;
    }

    .status.in {
        color: var(--vp-c-bg);
        background: var(--vp-c-brand-1);
    }

    .rail {
        display: flex;
        justify-content: center;
        padding: 55vh 0;
    }

    .target {
        display: grid;
        place-items: center;
        width: 160px;
        height: 160px;
        border-radius: 16px;
        background: var(--vp-c-bg);
        box-shadow: 0 0 0 1px var(--vp-c-border) inset;
        font-weight: 600;
        color: var(--vp-c-text-2);
        transition: transform .3s, box-shadow .3s, color .3s;
    }

    .target.in {
        transform: scale(1.1);
        box-shadow: 0 0 0 3px var(--vp-c-brand-1) inset;
        color: var(--vp-c-brand-1);
    }
</style>
