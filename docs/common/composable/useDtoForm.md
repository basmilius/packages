---
outline: deep
---

# useDtoForm

Mirror a DTO into a form-friendly ref. Whenever the source DTO changes, the form ref is replaced with a deep clone of the DTO marked clean — so subsequent edits flag the form as dirty without polluting the source.

This composable is built around the DTO machinery from [`@basmilius/http-client`](/http-client/), specifically `cloneDto` and `markDtoClean` (see [DTO decorators](/http-client/decorator/dto)).

## Importing

```ts
import { useDtoForm } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { ref, watch } from 'vue';
    import { useDtoForm, useService } from '@basmilius/common';
    import { OrderService, type OrderDto } from '@/services/OrderService';

    const orders = useService(OrderService);
    const orderRef = ref<OrderDto | null>(null);
    const form = useDtoForm(orderRef);

    orders.get(123).then(response => {
        orderRef.value = response.data;
    });

    function save(): void {
        // form.value contains the edited clone, ready to submit back.
    }
</script>
```

The form ref is `null` until the source DTO emits a non-null value for the first time. After that, every change to the source ref triggers a re-clone — pending edits are discarded, so guard against this if you need to merge user edits with newly received server state.

## Type signature

```ts
declare function useDtoForm<T>(dtoRef: Ref<T | null>): Ref<T>;
```

## See also

- [DTO decorators](/http-client/decorator/dto)
- [`useService`](/common/composable/useService)
