<script
    setup
    lang="ts">
    import { computed, ref } from 'vue';
    import { formatNumber, formatPercentage } from '@basmilius/utils';

    const value = ref(1234567.891);
    const decimals = ref(2);
    const ratio = ref(0.4267);

    const formattedNumber = computed(() => formatNumber(value.value, decimals.value));
    const formattedPercentage = computed(() => formatPercentage(ratio.value));
</script>

<template>
    <ClientOnly>
        <div class="demo">
            <div class="row">
                <label>
                    <span>value</span>
                    <input
                        v-model.number="value"
                        class="input"
                        type="number"
                        step="0.001"/>
                </label>
                <label>
                    <span>decimals</span>
                    <input
                        v-model.number="decimals"
                        class="input"
                        type="number"
                        min="0"
                        max="6"/>
                </label>
                <output><code>formatNumber</code> → {{ formattedNumber }}</output>
            </div>

            <div class="row">
                <label>
                    <span>ratio</span>
                    <input
                        v-model.number="ratio"
                        class="input"
                        type="number"
                        step="0.01"/>
                </label>
                <output><code>formatPercentage</code> → {{ formattedPercentage }}</output>
            </div>
        </div>
    </ClientOnly>
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

    .row {
        display: flex;
        gap: 16px;
        align-items: flex-end;
        flex-wrap: wrap;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    label span {
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--vp-c-text-2);
    }

    .input {
        width: 140px;
        padding: 8px 12px;
        border: 1px solid var(--vp-c-border);
        border-radius: 8px;
        background: var(--vp-c-bg);
        font-family: var(--vp-font-family-mono);
        font-size: 14px;
        color: var(--vp-c-text-1);
    }

    output {
        font-family: var(--vp-font-family-mono);
        font-size: 0.95rem;
        color: var(--vp-c-text-1);
    }

    output code {
        padding: 1px 6px;
        border-radius: 6px;
        background: var(--vp-c-brand-soft);
        color: var(--vp-c-brand-1);
        font-size: 0.8rem;
    }
</style>
