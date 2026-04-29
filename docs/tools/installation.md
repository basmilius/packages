---
outline: deep
---

# Installation

`@basmilius/tools` is intended for use as a development dependency in library packages.

::: code-group

```shell [Bun]
bun add -d @basmilius/tools
```

```shell [npm]
npm install --save-dev @basmilius/tools
```

```shell [pnpm]
pnpm add -D @basmilius/tools
```

```shell [yarn]
yarn add -D @basmilius/tools
```

:::

## Requirements

- [Bun](https://bun.sh/) `>= 1.3.11` — the build helpers wrap `Bun.build`.
- A `tsconfig.json` with `isolatedDeclarations` enabled if you use [`dts`](/tools/dts).

## Recommended scripts

Add a `build.ts` to your package and a script that runs it:

```json
{
    "scripts": {
        "build": "tsgo --noEmit && bun build.ts"
    }
}
```

The `tsgo --noEmit` step performs a strict type check first; the actual emit is handled by `Bun.build` plus `dts()` for declaration files.
