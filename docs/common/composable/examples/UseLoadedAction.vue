<script setup lang="ts">
    import { ref } from 'vue';
    import { useLoadedAction } from '@basmilius/common';

    const result = ref('—');

    const [save, isSaving] = useLoadedAction(async () => {
        await new Promise(resolve => setTimeout(resolve, 1200));
        result.value = `Saved at ${new Date().toLocaleTimeString()}`;
    });
</script>

<template>
    <div class="demo">
        <button class="button" :disabled="isSaving" @click="save()">
            {{ isSaving ? 'Saving…' : 'Save' }}
        </button>

        <p class="result">{{ result }}</p>
    </div>
</template>

<style scoped>
    .demo {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 24px;
        border: 1px solid var(--vp-c-border);
        border-radius: 12px;
        background: var(--vp-c-bg-soft);
    }

    .button {
        padding: 8px 16px;
        border-radius: 8px;
        background: var(--vp-c-brand-1);
        font-weight: 600;
        color: var(--vp-c-white);
    }

    .button:disabled {
        opacity: .6;
    }

    .result {
        margin: 0;
        font-family: var(--vp-font-family-mono);
        font-size: 14px;
        color: var(--vp-c-text-2);
    }
</style>
