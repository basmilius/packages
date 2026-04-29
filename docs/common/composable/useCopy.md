---
outline: deep
---

# useCopy

Build a one-shot function that copies the current value of a `Ref<string>` to the clipboard via `navigator.clipboard.writeText`, optionally invoking a success callback after the copy resolves.

## Importing

```ts
import { useCopy } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { ref } from 'vue';
    import { useCopy } from '@basmilius/common';

    const token = ref('sk_live_...');
    const copyToken = useCopy(token, () => {
        console.log('Token copied to clipboard');
    });
</script>

<template>
    <button @click="copyToken">Copy token</button>
</template>
```

The returned function reads the ref's current value at call time, so updating the ref between renders is fine. The callback only fires after the clipboard write has resolved.

## Type signature

```ts
declare function useCopy(
    contents: Ref<string>,
    onSuccess?: Function
): () => Promise<void>;
```

## See also

- [`emptyNull`](/common/util/emptyNull)
