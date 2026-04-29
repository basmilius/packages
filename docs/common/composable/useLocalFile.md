---
outline: deep
---

# useLocalFile

Manage a single locally-uploaded `File` together with its preview `URL`. The composable exposes refs for the file and a `URL.createObjectURL` URL, and takes care of revoking the object URL when the file is replaced or cleared.

## Importing

```ts
import { useLocalFile } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useLocalFile } from '@basmilius/common';

    const {
        file,
        url,
        upload,
        delete: removeFile
    } = useLocalFile();

    function onChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        const next = input.files?.[0];

        if (next) {
            upload(next);
        }
    }
</script>

<template>
    <input type="file" @change="onChange"/>
    <img v-if="url" :src="url" alt=""/>
    <button v-if="file" @click="removeFile">Remove</button>
</template>
```

Both `file` and `url` are `null` until a file is uploaded. Replacing the file triggers a `URL.revokeObjectURL` for the previous preview to avoid memory leaks; the watch cleanup handles unmount as well.

## Returned bindings

| Property         | Type                       | Description                                |
| ---------------- | -------------------------- | ------------------------------------------ |
| `file`           | `Ref<File \| null>`        | Currently uploaded file                    |
| `url`            | `Ref<string \| null>`      | Object URL for the file's preview          |
| `upload(file)`   | `(file: File) => void`     | Set the file and create a preview URL      |
| `delete()`       | `() => void`               | Clear the file and revoke the preview URL  |

## Type signature

```ts
declare function useLocalFile(): {
    readonly file: Ref<File | null>;
    readonly url: Ref<string | null>;
    delete: () => void;
    upload: (file: File) => void;
};
```
