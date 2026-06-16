<script setup lang="ts">
    import { ref } from 'vue';
    import { useDebounced } from '@basmilius/common';

    const query = ref('');
    const debouncedValue = ref('');
    const calls = ref(0);

    const commit = useDebounced((value: string) => {
        debouncedValue.value = value;
        calls.value++;
    }, 400);

    function handle(evt: Event): void {
        query.value = (evt.target as HTMLInputElement).value;
        commit(query.value);
    }
</script>

<template>
    <div class="demo">
        <input :value="query" class="input" placeholder="Type here…" @input="handle"/>

        <dl class="readout">
            <div>
                <dt>Live</dt>
                <dd>{{ query || '—' }}</dd>
            </div>
            <div>
                <dt>Debounced (400ms)</dt>
                <dd>{{ debouncedValue || '—' }}</dd>
            </div>
            <div>
                <dt>Callback calls</dt>
                <dd>{{ calls }}</dd>
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

    .input {
        width: 100%;
        margin-bottom: 16px;
        padding: 8px 12px;
        border: 1px solid var(--vp-c-border);
        border-radius: 8px;
        background: var(--vp-c-bg);
        font-size: 14px;
        color: var(--vp-c-text-1);
    }

    .readout {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
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
        font-size: 16px;
        font-weight: 600;
        color: var(--vp-c-brand-1);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
