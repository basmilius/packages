<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { usePasswordStrength } from '@basmilius/common';

    const password = ref('');
    const result = usePasswordStrength(password);

    const allRules = ['lowercase', 'uppercase', 'number', 'symbol'] as const;

    const labels = {
        too_weak: 'Too weak',
        weak: 'Weak',
        medium: 'Medium',
        strong: 'Strong'
    } as const;

    const label = computed(() => result.value ? labels[result.value.strength] : '—');
</script>

<template>
    <div class="demo">
        <input v-model="password" class="input" type="text" placeholder="Type a password…"/>

        <div class="bar" :data-strength="result?.strength ?? 'none'">
            <span/>
            <span/>
            <span/>
            <span/>
        </div>

        <p class="label">Strength: <b>{{ label }}</b></p>

        <ul class="rules">
            <li v-for="rule in allRules" :key="rule" :class="{met: result?.rules.includes(rule)}">
                {{ rule }}
            </li>
        </ul>
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

    .bar {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
        margin-bottom: 12px;
    }

    .bar span {
        height: 6px;
        border-radius: 999px;
        background: var(--vp-c-bg);
        box-shadow: 0 0 0 1px var(--vp-c-border) inset;
    }

    .bar[data-strength='too_weak'] span:nth-child(-n + 1),
    .bar[data-strength='weak'] span:nth-child(-n + 2),
    .bar[data-strength='medium'] span:nth-child(-n + 3),
    .bar[data-strength='strong'] span:nth-child(-n + 4) {
        background: var(--vp-c-brand-1);
        box-shadow: none;
    }

    .label {
        margin: 0 0 12px;
        font-size: 14px;
        color: var(--vp-c-text-2);
    }

    .rules {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .rules li {
        padding: 4px 12px;
        border-radius: 999px;
        background: var(--vp-c-bg);
        box-shadow: 0 0 0 1px var(--vp-c-border) inset;
        font-family: var(--vp-font-family-mono);
        font-size: 12px;
        color: var(--vp-c-text-3);
    }

    .rules li.met {
        color: var(--vp-c-brand-1);
        box-shadow: 0 0 0 1px var(--vp-c-brand-1) inset;
    }
</style>
