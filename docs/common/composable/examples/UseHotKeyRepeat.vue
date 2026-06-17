<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import { useHotKey } from '@basmilius/common';

    const panel = useTemplateRef<HTMLDivElement>('panel');
    const once = ref(0);
    const repeated = ref(0);

    useHotKey('up', () => {
        once.value++;
    }, {target: panel});

    useHotKey('down', () => {
        repeated.value++;
    }, {target: panel, repeat: true});
</script>

<template>
    <div ref="panel" class="demo" tabindex="0">
        <p class="hint">Click this panel to focus it, then press and hold the arrow keys.</p>

        <dl class="readout">
            <div>
                <dt>↑ — repeat: false</dt>
                <dd>{{ once }}</dd>
            </div>
            <div>
                <dt>↓ — repeat: true</dt>
                <dd>{{ repeated }}</dd>
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
        outline: none;
        transition: border-color .2s, background .2s;
        user-select: none;
    }

    .demo:focus {
        border-color: var(--vp-c-brand-1);
    }

    .hint {
        margin: 0 0 16px;
        color: var(--vp-c-text-2);
        font-size: 14px;
    }

    .readout {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
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
        font-family: var(--vp-font-family-mono);
        font-size: 12px;
    }

    .readout dd {
        margin: 0;
        font-family: var(--vp-font-family-mono);
        font-size: 24px;
        font-weight: 600;
        color: var(--vp-c-brand-1);
    }
</style>
