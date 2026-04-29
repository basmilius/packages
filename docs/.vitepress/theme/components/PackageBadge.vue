<template>
    <a
        class="package-badge"
        :href="`https://www.npmjs.com/package/${name}`"
        target="_blank"
        rel="noopener noreferrer">
        {{ name }}
    </a>
</template>

<script
    lang="ts"
    setup>
    defineProps<{
        readonly name: string;
    }>();
</script>
