---
outline: deep
---

# usePasswordStrength

Compute a coarse-grained password strength based on length and character class diversity. Returns a `ComputedRef<Result | null>` that emits `null` while the password is empty.

The result reports the password length, the matched rules (lowercase, uppercase, number, symbol) and a strength bucket (`too_weak`, `weak`, `medium`, `strong`).

## Importing

```ts
import { usePasswordStrength } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { ref } from 'vue';
    import { usePasswordStrength } from '@basmilius/common';

    const password = ref('');
    const strength = usePasswordStrength(password);
</script>

<template>
    <input v-model="password" type="password"/>
    <p v-if="strength">
        Strength: {{ strength.strength }} ({{ strength.length }} chars,
        {{ strength.rules.length }} rule(s) matched)
    </p>
</template>
```

## Strength buckets

| Bucket      | Minimum length | Minimum diversity |
| ----------- | -------------- | ----------------- |
| `too_weak`  | 0              | 0                 |
| `weak`      | 6              | 2                 |
| `medium`    | 8              | 3                 |
| `strong`    | 10             | 4                 |

Diversity counts how many of the four rules (lowercase, uppercase, number, symbol) the password matches. The resulting bucket is the highest one whose length and diversity thresholds are both satisfied.

## Result shape

```ts
type PasswordRuleType =
    | 'lowercase'
    | 'uppercase'
    | 'number'
    | 'symbol';

type PasswordStrengthType =
    | 'too_weak'
    | 'weak'
    | 'medium'
    | 'strong';

type Result = {
    readonly length: number;
    readonly rules: PasswordRuleType[];
    readonly strength: PasswordStrengthType;
};
```

## Type signature

```ts
declare function usePasswordStrength(
    passwordRef: Ref<string>
): ComputedRef<Result | null>;
```
