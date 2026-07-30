export const HTML_ESCAPES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;'
};

const HTML_PATTERN = /[&<>"']/g;

export default function (value: unknown): string {
    return String(value ?? '').replace(HTML_PATTERN, character => HTML_ESCAPES[character]);
}
