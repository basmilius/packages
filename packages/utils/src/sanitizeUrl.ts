const PROTOCOL = /^([a-z][a-z0-9+.-]*):/i;
const UNSAFE_URL_CHARACTERS = /[\s\p{Cc}\p{Cf}]/gu;

export const IMAGE_PROTOCOLS = ['http:', 'https:'] as const;
export const LINK_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'] as const;
export const NAVIGATION_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:', 'sms:', 'ftp:', 'ftps:', 'geo:'] as const;

export default function (url: string | null | undefined, protocols: readonly string[] = LINK_PROTOCOLS): string | null {
    if (!url) {
        return null;
    }

    // Whitespace and control characters go first, so a scheme the browser still
    // honors cannot hide behind them as in "java\tscript:alert(1)".
    const normalized = url.replace(UNSAFE_URL_CHARACTERS, '');
    const protocol = PROTOCOL.exec(normalized);

    if (protocol && !protocols.includes(`${protocol[1].toLowerCase()}:`)) {
        return null;
    }

    return normalized || null;
}
