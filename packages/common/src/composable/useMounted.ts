import { onMounted, type Ref, ref } from 'vue';

export default function (): Ref<boolean> {
    const mounted = ref(false);

    onMounted(() => mounted.value = true);

    return mounted;
}
