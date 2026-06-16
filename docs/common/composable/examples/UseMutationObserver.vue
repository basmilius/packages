<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import { useMutationObserver } from '@basmilius/common';

    const target = useTemplateRef<HTMLDivElement>('target');
    const state = ref('idle');
    const mutations = ref(0);

    useMutationObserver(target, () => {
        mutations.value++;
    }, {
        attributes: true,
        attributeFilter: ['data-state']
    });

    function toggle(): void {
        state.value = state.value === 'idle' ? 'active' : 'idle';
    }
</script>

<template>
    <div class="demo">
        <div ref="target" class="target" :data-state="state">
            data-state = "{{ state }}"
        </div>

        <div class="actions">
            <button @click="toggle">Toggle attribute</button>
            <span class="count">{{ mutations }} mutations observed</span>
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

    .target {
        padding: 16px;
        margin-bottom: 16px;
        border-radius: 8px;
        background: var(--vp-c-bg);
        box-shadow: 0 0 0 1px var(--vp-c-border) inset;
        font-family: var(--vp-font-family-mono);
        font-size: 14px;
        color: var(--vp-c-text-2);
        transition: box-shadow .2s, color .2s;
    }

    .target[data-state='active'] {
        box-shadow: 0 0 0 2px var(--vp-c-brand-1) inset;
        color: var(--vp-c-brand-1);
    }

    .actions {
        display: flex;
        align-items: center;
        gap: 14px;
    }

    .actions button {
        padding: 8px 16px;
        border-radius: 8px;
        background: var(--vp-c-brand-1);
        font-weight: 600;
        color: var(--vp-c-white);
    }

    .count {
        font-family: var(--vp-font-family-mono);
        font-size: 13px;
        color: var(--vp-c-text-3);
    }
</style>
