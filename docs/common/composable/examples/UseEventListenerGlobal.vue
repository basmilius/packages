<script setup lang="ts">
    import { ref } from 'vue';
    import { useEventListener } from '@basmilius/common';

    const width = ref(window.innerWidth);
    const height = ref(window.innerHeight);
    const lastKey = ref('—');

    useEventListener(window, 'resize', () => {
        width.value = window.innerWidth;
        height.value = window.innerHeight;
    });

    useEventListener(document, 'keydown', evt => {
        lastKey.value = evt.key;
    });
</script>

<template>
    <div class="demo">
        <p class="hint">Resize the window or press any key.</p>

        <dl class="readout">
            <div>
                <dt>window size</dt>
                <dd>{{ width }} × {{ height }}</dd>
            </div>
            <div>
                <dt>document keydown</dt>
                <dd>{{ lastKey }}</dd>
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
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: .04em;
    }

    .readout dd {
        margin: 0;
        font-family: var(--vp-font-family-mono);
        font-size: 18px;
        font-weight: 600;
        color: var(--vp-c-brand-1);
    }
</style>
