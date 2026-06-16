<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import { unwrapTarget } from '@basmilius/common';

    const box = useTemplateRef<HTMLDivElement>('box');
    const result = ref('—');

    function describe(value: HTMLElement | Window | Document | null): string {
        if (value === null) {
            return 'null';
        }

        if (value instanceof Window) {
            return 'Window';
        }

        if (value instanceof Document) {
            return 'Document';
        }

        return `<${value.tagName.toLowerCase()}>`;
    }

    function resolveElement(): void {
        result.value = describe(unwrapTarget(box));
    }

    function resolveWindow(): void {
        result.value = describe(unwrapTarget(window));
    }

    function resolveDocument(): void {
        result.value = describe(unwrapTarget(document));
    }

    function resolveNull(): void {
        result.value = describe(unwrapTarget(null));
    }
</script>

<template>
    <div class="demo">
        <div ref="box" class="box">element ref</div>

        <div class="actions">
            <button @click="resolveElement">element ref</button>
            <button @click="resolveWindow">window</button>
            <button @click="resolveDocument">document</button>
            <button @click="resolveNull">null</button>
        </div>

        <p class="result">
            <span>unwrapTarget →</span>
            <code>{{ result }}</code>
        </p>
    </div>
</template>

<style scoped>
    .demo {
        padding: 24px;
        border: 1px solid var(--vp-c-border);
        border-radius: 12px;
        background: var(--vp-c-bg-soft);
    }

    .box {
        display: grid;
        place-items: center;
        height: 64px;
        margin-bottom: 16px;
        border-radius: 8px;
        background: var(--vp-c-bg);
        box-shadow: 0 0 0 1px var(--vp-c-border) inset;
        font-family: var(--vp-font-family-mono);
        font-size: 13px;
        color: var(--vp-c-text-3);
    }

    .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;
    }

    .actions button {
        padding: 6px 14px;
        border: 1px solid var(--vp-c-border);
        border-radius: 8px;
        background: var(--vp-c-bg);
        font-family: var(--vp-font-family-mono);
        font-size: 13px;
        color: var(--vp-c-text-1);
        cursor: pointer;
        transition: border-color .2s, color .2s;
    }

    .actions button:hover {
        border-color: var(--vp-c-brand-1);
        color: var(--vp-c-brand-1);
    }

    .result {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0;
        color: var(--vp-c-text-2);
        font-size: 14px;
    }

    .result code {
        font-size: 16px;
        font-weight: 600;
        color: var(--vp-c-brand-1);
    }
</style>
