<script setup lang="ts">
    import { useLocalFile } from '@basmilius/common';

    const {file, url, upload, delete: remove} = useLocalFile();

    function onChange(evt: Event): void {
        const picked = (evt.target as HTMLInputElement).files?.[0];

        if (picked) {
            upload(picked);
        }
    }
</script>

<template>
    <div class="demo">
        <input type="file" accept="image/*" @change="onChange"/>

        <div v-if="url" class="preview">
            <img :src="url" alt=""/>
            <div class="meta">
                <p>{{ file?.name }}</p>
                <button @click="remove">Remove</button>
            </div>
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

    .preview {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-top: 16px;
    }

    .preview img {
        width: 96px;
        height: 96px;
        border-radius: 8px;
        object-fit: cover;
        background: var(--vp-c-bg);
    }

    .meta {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .meta p {
        margin: 0;
        font-family: var(--vp-font-family-mono);
        font-size: 13px;
        color: var(--vp-c-text-2);
    }

    .meta button {
        padding: 4px 12px;
        border: 1px solid var(--vp-c-border);
        border-radius: 8px;
        background: var(--vp-c-bg);
        font-size: 13px;
        color: var(--vp-c-text-1);
    }
</style>
