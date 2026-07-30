---
outline: deep
---

# upperFirst

Uppercases the first character of a string and leaves the rest untouched.

## Importing

```ts
import { upperFirst } from '@basmilius/utils';
```

## Usage

```ts
import { upperFirst } from '@basmilius/utils';

upperFirst('hello world');
// 'Hello world'
```

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `value` | `string` | The string to capitalize. |

## Returns

`string` the input with its first character uppercased.

## Type signature

```ts
declare function upperFirst(value: string): string;
```
