import { ref } from 'vue';

const DEFAULT_LIMITS = [5, 10, 25, 50, 100];
const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 25;

export default function () {
    const limits = ref(DEFAULT_LIMITS);
    const page = ref(DEFAULT_PAGE);
    const perPage = ref(DEFAULT_PER_PAGE);
    const total = ref(0);

    function setPage(num: number): void {
        page.value = num;
    }

    function setPerPage(num: number): void {
        perPage.value = num;
    }

    function setTotal(num: number): void {
        total.value = num;
    }

    return {
        limits,
        page,
        perPage,
        total,

        setPage,
        setPerPage,
        setTotal
    };
};
