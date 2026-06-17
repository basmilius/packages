<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import { useHotKey } from '@basmilius/common';

    const panel = useTemplateRef<HTMLDivElement>('panel');
    const log = ref<string[]>([]);
    const saves = ref(0);

    function push(message: string): void {
        log.value = [message, ...log.value].slice(0, 5);
    }

    useHotKey('mod+s', () => {
        saves.value++;
        push('Saved');
    }, {target: panel});

    useHotKey('mod+enter', () => {
        push('Submitted');
    }, {target: panel});

    useHotKey('?', () => {
        push('Help');
    }, {target: panel});
</script>

<template>
    <div ref="panel" class="demo" tabindex="0">
        <p class="hint">Click this panel to focus it, then try the shortcuts below.</p>

        <dl class="readout">
            <div>
                <dt>⌘/Ctrl + S</dt>
                <dd>{{ saves }}× saved</dd>
            </div>
            <div>
                <dt>⌘/Ctrl + Enter</dt>
                <dd>submit</dd>
            </div>
            <div>
                <dt>?</dt>
                <dd>help</dd>
            </div>
        </dl>

        <ul class="events">
            <li v-for="(entry, index) in log" :key="index">{{ entry }}</li>
            <li v-if="log.length === 0" class="empty">No shortcuts yet.</li>
        </ul>
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
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin: 0 0 16px;
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
        font-size: 16px;
        font-weight: 600;
        color: var(--vp-c-brand-1);
    }

    .events {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin: 0;
        padding: 0;
        list-style: none;
        font-family: var(--vp-font-family-mono);
        font-size: 14px;
    }

    .events .empty {
        color: var(--vp-c-text-3);
    }
</style>
