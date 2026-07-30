import { HTML_ESCAPES } from './escapeHtml';

const ATTR_PATTERN = /[&<>"]/g;

export default function (value: unknown): string {
    return String(value ?? '').replace(ATTR_PATTERN, character => HTML_ESCAPES[character]);
}
