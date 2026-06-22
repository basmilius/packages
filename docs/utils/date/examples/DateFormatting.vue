<script
    setup
    lang="ts">
    import { computed, ref } from 'vue';
    import { DateTime } from 'luxon';
    import {
        formatDate,
        formatDateFull,
        formatDateTime,
        formatMonth,
        formatMonthYear,
        formatTime
    } from '@basmilius/utils';

    const value = ref('2026-06-17T09:30');

    const dateTime = computed(() => DateTime.fromISO(value.value));

    const rows = computed(() => [
        {fn: 'formatDate', result: formatDate(dateTime.value)},
        {fn: 'formatDateFull', result: formatDateFull(dateTime.value)},
        {fn: 'formatDateTime', result: formatDateTime(dateTime.value)},
        {fn: 'formatMonth', result: formatMonth(dateTime.value)},
        {fn: 'formatMonthYear', result: formatMonthYear(dateTime.value)},
        {fn: 'formatTime', result: formatTime(dateTime.value)}
    ]);
</script>

<template>
    <ClientOnly>
        <div class="demo">
            <input
                v-model="value"
                class="input"
                type="datetime-local"/>

            <dl class="values">
                <div
                    v-for="row in rows"
                    :key="row.fn">
                    <dt><code>{{ row.fn }}</code></dt>
                    <dd>{{ row.result }}</dd>
                </div>
            </dl>
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

    .input {
        align-self: flex-start;
        padding: 8px 12px;
        border: 1px solid var(--vp-c-border);
        border-radius: 8px;
        background: var(--vp-c-bg);
        font-family: var(--vp-font-family-mono);
        font-size: 14px;
        color: var(--vp-c-text-1);
    }

    .values {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px 24px;
        margin: 0;
    }

    .values div {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .values dt code {
        padding: 1px 6px;
        border-radius: 6px;
        background: var(--vp-c-brand-soft);
        color: var(--vp-c-brand-1);
        font-family: var(--vp-font-family-mono);
        font-size: 0.8rem;
    }

    .values dd {
        margin: 0;
        font-size: 0.95rem;
        color: var(--vp-c-text-1);
    }
</style>
