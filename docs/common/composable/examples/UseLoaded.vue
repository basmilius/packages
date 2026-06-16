<script setup lang="ts">
    import { useLoaded } from '@basmilius/common';

    const {isLoading, loaded} = useLoaded();

    const run = loaded(() => new Promise<void>(resolve => {
        setTimeout(resolve, 1200);
    }));
</script>

<template>
    <div class="demo">
        <button class="button" :disabled="isLoading" @click="run()">
            {{ isLoading ? 'Loading…' : 'Run task' }}
        </button>

        <span class="status" :class="{active: isLoading}">
            {{ isLoading ? 'busy' : 'idle' }}
        </span>
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

    .status {
        font-family: var(--vp-font-family-mono);
        font-size: 14px;
        color: var(--vp-c-text-3);
    }

    .status.active {
        color: var(--vp-c-brand-1);
    }
</style>
