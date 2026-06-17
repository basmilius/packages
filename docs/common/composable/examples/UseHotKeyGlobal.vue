<script setup lang="ts">
    import { ref } from 'vue';
    import { useHotKey } from '@basmilius/common';

    const presses = ref(0);
    const enabled = ref(true);
    const text = ref('');

    useHotKey('k', () => {
        presses.value++;
    }, {
        enabled,
        preventDefault: false
    });
</script>

<template>
    <div class="demo">
        <p class="hint">
            Press <kbd>K</kbd> anywhere on the page to count. It listens on <code>window</code>, so no element has to be focused — but pressing <kbd>K</kbd> inside the field below is ignored while you type.
        </p>

        <label class="toggle">
            <input v-model="enabled" type="checkbox">
            Shortcut enabled
        </label>

        <input v-model="text" class="field" type="text" placeholder="Type here — pressing K is ignored">

        <p class="count"><strong>{{ presses }}</strong> presses</p>
    </div>
</template>

<style scoped>
    .demo {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 24px;
        border: 1px solid var(--vp-c-border);
        border-radius: 12px;
        background: var(--vp-c-bg-soft);
    }

    .hint {
        margin: 0;
        color: var(--vp-c-text-2);
        font-size: 14px;
    }

    .toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--vp-c-text-1);
        font-size: 14px;
        user-select: none;
    }

    .field {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid var(--vp-c-border);
        border-radius: 8px;
        background: var(--vp-c-bg);
        color: var(--vp-c-text-1);
        font-size: 14px;
    }

    .field:focus {
        outline: none;
        border-color: var(--vp-c-brand-1);
    }

    .count {
        margin: 0;
        color: var(--vp-c-text-2);
        font-size: 14px;
    }

    .count strong {
        font-family: var(--vp-font-family-mono);
        font-size: 18px;
        color: var(--vp-c-brand-1);
    }
</style>
