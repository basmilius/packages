<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import { useClickOutside } from '@basmilius/common';

    const trigger = useTemplateRef<HTMLButtonElement>('trigger');
    const panel = useTemplateRef<HTMLDivElement>('panel');
    const open = ref(false);

    useClickOutside([trigger, panel], open, () => {
        open.value = false;
    });
</script>

<template>
    <div class="demo">
        <button ref="trigger" class="trigger" @click="open = !open">
            {{ open ? 'Close' : 'Open' }} menu
        </button>

        <div v-if="open" ref="panel" class="panel">
            Click anywhere outside this panel to close it.
        </div>
    </div>
</template>

<style scoped>
    .demo {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        padding: 24px;
        border: 1px solid var(--vp-c-border);
        border-radius: 12px;
        background: var(--vp-c-bg-soft);
    }

    .trigger {
        padding: 8px 16px;
        border-radius: 8px;
        background: var(--vp-c-brand-1);
        font-weight: 600;
        color: var(--vp-c-white);
    }

    .panel {
        padding: 16px;
        border: 1px solid var(--vp-c-border);
        border-radius: 8px;
        background: var(--vp-c-bg);
        color: var(--vp-c-text-2);
        font-size: 14px;
    }
</style>
