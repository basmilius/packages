<script setup lang="ts">
    import { useMounted } from '@basmilius/common';

    const mounted = useMounted();
</script>

<template>
    <div class="demo">
        <span class="badge" :class="{on: mounted}">
            {{ mounted ? 'Mounted (client)' : 'Not mounted yet (SSR)' }}
        </span>
        <p class="hint">Flips to <code>true</code> once the component mounts in the browser.</p>
    </div>
</template>

<style scoped>
    .demo {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 24px;
        border: 1px solid var(--vp-c-border);
        border-radius: 12px;
        background: var(--vp-c-bg-soft);
    }

    .badge {
        padding: 6px 14px;
        border-radius: 999px;
        background: var(--vp-c-bg);
        box-shadow: 0 0 0 1px var(--vp-c-border) inset;
        font-family: var(--vp-font-family-mono);
        font-size: 13px;
        font-weight: 600;
        color: var(--vp-c-text-3);
        white-space: nowrap;
    }

    .badge.on {
        background: var(--vp-c-brand-1);
        box-shadow: none;
        color: var(--vp-c-white);
    }

    .hint {
        margin: 0;
        color: var(--vp-c-text-2);
        font-size: 14px;
    }
</style>
