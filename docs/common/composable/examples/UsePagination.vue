<script setup lang="ts">
    import { computed } from 'vue';
    import { usePagination } from '@basmilius/common';

    const {limits, page, perPage, total, setPage, setPerPage, setTotal} = usePagination();

    setTotal(243);

    const pageCount = computed(() => Math.max(1, Math.ceil(total.value / perPage.value)));

    function onPerPage(evt: Event): void {
        setPerPage(Number((evt.target as HTMLSelectElement).value));
        setPage(1);
    }
</script>

<template>
    <div class="demo">
        <div class="row">
            <label class="field">
                Per page
                <select :value="perPage" @change="onPerPage">
                    <option v-for="limit in limits" :key="limit" :value="limit">{{ limit }}</option>
                </select>
            </label>
            <span class="total">{{ total }} items</span>
        </div>

        <div class="pager">
            <button :disabled="page <= 1" @click="setPage(page - 1)">Prev</button>
            <span class="label">Page {{ page }} / {{ pageCount }}</span>
            <button :disabled="page >= pageCount" @click="setPage(page + 1)">Next</button>
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

    .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
    }

    .field {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: var(--vp-c-text-2);
    }

    .field select {
        padding: 6px 10px;
        border: 1px solid var(--vp-c-border);
        border-radius: 8px;
        background: var(--vp-c-bg);
        color: var(--vp-c-text-1);
    }

    .total {
        font-family: var(--vp-font-family-mono);
        font-size: 13px;
        color: var(--vp-c-text-3);
    }

    .pager {
        display: flex;
        align-items: center;
        gap: 14px;
    }

    .pager button {
        padding: 6px 14px;
        border: 1px solid var(--vp-c-border);
        border-radius: 8px;
        background: var(--vp-c-bg);
        color: var(--vp-c-text-1);
    }

    .pager button:disabled {
        opacity: .5;
    }

    .label {
        font-family: var(--vp-font-family-mono);
        font-size: 14px;
        color: var(--vp-c-text-1);
    }
</style>
