---
outline: deep
---

# DOM & browser

Helpers that touch the DOM, the browser navigation, downloads or the View Transitions API. They all expect a browser environment.

## Downloads

- [`downloadBlob`](/utils/dom/downloadBlob) — downloads a `Blob` as a file.
- [`downloadString`](/utils/dom/downloadString) — downloads a string as a file with a custom MIME type.
- [`downloadUrl`](/utils/dom/downloadUrl) — downloads from an `http(s):` or `blob:` URL.

## Navigation & view

- [`openUrl`](/utils/dom/openUrl) — navigates to a URL, breaking out of an iframe when needed.
- [`printHtml`](/utils/dom/printHtml) — prints arbitrary HTML through a hidden iframe.
- [`viewTransition`](/utils/dom/viewTransition) — wraps the [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) with a graceful fallback.

## Predicates

- [`isHtmlElement`](/utils/dom/isHtmlElement) — type-guarding `instanceof HTMLElement` check that is safe in non-browser environments.
