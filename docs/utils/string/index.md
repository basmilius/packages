---
outline: deep
---

# String & HTML

Helpers for escaping and normalizing untrusted strings and URLs.

- [`escapeHtml`](/utils/string/escapeHtml): escapes the five HTML-significant characters for safe HTML text content.
- [`escapeAttr`](/utils/string/escapeAttr): escapes a value for safe interpolation into a double-quoted HTML attribute.
- [`sanitizeUrl`](/utils/string/sanitizeUrl): sanitizes a URL against a scheme allow-list, rejecting disallowed schemes.
- [`upperFirst`](/utils/string/upperFirst): uppercases the first character of a string.
