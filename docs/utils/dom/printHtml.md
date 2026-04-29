---
outline: deep
---

# printHtml

Prints arbitrary HTML by injecting it into a hidden iframe and calling `window.print()` on the iframe's content window. The helper waits for any `<img>` tags inside the HTML to finish loading before triggering the print dialog and removes the iframe one second later.

## Importing

```ts
import { printHtml } from '@basmilius/utils';
```

## Usage

```ts
import { printHtml } from '@basmilius/utils';

await printHtml(`
    <html>
        <head><title>Receipt</title></head>
        <body>
            <h1>Order #1234</h1>
            <p>Thank you for your purchase.</p>
        </body>
    </html>
`);
```

## Parameters

| Name   | Type     | Description                       |
|--------|----------|-----------------------------------|
| `html` | `string` | A complete HTML document string.  |

## Returns

`Promise<void>` — resolves once images have loaded and `print()` has been called.

## Throws

`Error` — when the iframe document cannot be accessed.

## Type signature

```ts
declare function printHtml(html: string): Promise<void>;
```

## See also

- [`viewTransition`](/utils/dom/viewTransition)
