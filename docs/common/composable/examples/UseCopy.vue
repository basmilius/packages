<script setup lang="ts">
    import { ref } from 'vue';
    import { useCopy } from '@basmilius/common';

    const text = ref('https://packages.bas.dev');
    const copied = ref(false);

    let timeout: ReturnType<typeof setTimeout>;

    const copy = useCopy(text, () => {
        copied.value = true;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            copied.value = false;
        }, 1500);
    });
</script>

<template>
    <div class="demo">
        <input v-model="text" class="input" type="text"/>
        <button class="button" @click="copy()">
            {{ copied ? '✓ Copied' : 'Copy' }}
        </button>
    </div>
</template>

<style scoped>
    .demo {
        display: flex;
        gap: 10px;
        padding: 24px;
        border: 1px solid var(--vp-c-border);
        border-radius: 12px;
        background: var(--vp-c-bg-soft);
    }

    .input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid var(--vp-c-border);
        border-radius: 8px;
        background: var(--vp-c-bg);
        font-family: var(--vp-font-family-mono);
        font-size: 14px;
        color: var(--vp-c-text-1);
    }

    .button {
        padding: 8px 16px;
        border-radius: 8px;
        background: var(--vp-c-brand-1);
        font-weight: 600;
        color: var(--vp-c-white);
        white-space: nowrap;
    }
</style>
