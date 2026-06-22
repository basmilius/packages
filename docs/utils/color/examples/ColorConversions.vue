<script
    setup
    lang="ts">
    import { computed, ref } from 'vue';
    import { hexToRGB, rgbToHSL, rgbToHSV } from '@basmilius/utils';

    const hex = ref('#0070f3');

    const rgb = computed(() => hexToRGB(hex.value));
    const hsl = computed(() => rgbToHSL(...rgb.value));
    const hsv = computed(() => rgbToHSV(...rgb.value));

    const round = (tuple: readonly number[]): string => tuple.map(value => Math.round(value)).join(', ');
</script>

<template>
    <div class="demo">
        <label class="picker">
            <input
                v-model="hex"
                type="color"/>
            <span class="swatch" :style="{ background: hex }"/>
        </label>

        <dl class="values">
            <div>
                <dt>HEX</dt>
                <dd>{{ hex }}</dd>
            </div>
            <div>
                <dt>RGB</dt>
                <dd>{{ round(rgb) }}</dd>
            </div>
            <div>
                <dt>HSL</dt>
                <dd>{{ round(hsl) }}</dd>
            </div>
            <div>
                <dt>HSV</dt>
                <dd>{{ round(hsv) }}</dd>
            </div>
        </dl>
    </div>
</template>

<style scoped>
    .demo {
        display: flex;
        gap: 20px;
        align-items: center;
        flex-wrap: wrap;
        padding: 24px;
        border: 1px solid var(--vp-c-border);
        border-radius: 12px;
        background: var(--vp-c-bg-soft);
    }

    .picker {
        position: relative;
        display: inline-flex;
    }

    .picker input {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
    }

    .swatch {
        width: 96px;
        height: 96px;
        border-radius: 12px;
        border: 1px solid var(--vp-c-border);
    }

    .values {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 12px 24px;
        margin: 0;
        flex: 1;
    }

    .values div {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .values dt {
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--vp-c-text-2);
    }

    .values dd {
        margin: 0;
        font-family: var(--vp-font-family-mono);
        font-size: 0.95rem;
        color: var(--vp-c-text-1);
    }
</style>
