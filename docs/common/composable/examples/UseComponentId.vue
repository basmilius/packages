<script setup lang="ts">
    import { defineComponent, h, ref } from 'vue';
    import { useComponentId } from '@basmilius/common';

    const Row = defineComponent({
        name: 'ComponentIdRow',
        setup() {
            const id = useComponentId();

            return () => h('div', {
                style: 'padding:10px 14px;border-radius:8px;background:var(--vp-c-bg);box-shadow:0 0 0 1px var(--vp-c-border) inset;font-family:var(--vp-font-family-mono);font-size:13px;color:var(--vp-c-text-2)'
            }, `Component instance #${id.value}`);
        }
    });

    const rows = ref([0]);
    let next = 1;

    function add(): void {
        rows.value.push(next++);
    }

    function remove(): void {
        rows.value.pop();
    }
</script>

<template>
    <div class="demo">
        <p class="hint">Each instance gets a stable, unique id derived from its Vue <code>uid</code>.</p>

        <div class="actions">
            <button @click="add">Add instance</button>
            <button :disabled="rows.length <= 1" @click="remove">Remove</button>
        </div>

        <div class="rows">
            <Row v-for="row in rows" :key="row"/>
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

    .hint {
        margin: 0 0 16px;
        color: var(--vp-c-text-2);
        font-size: 14px;
    }

    .actions {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
    }

    .actions button {
        padding: 6px 14px;
        border: 1px solid var(--vp-c-border);
        border-radius: 8px;
        background: var(--vp-c-bg);
        font-size: 13px;
        color: var(--vp-c-text-1);
    }

    .actions button:disabled {
        opacity: .5;
    }

    .rows {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
</style>
