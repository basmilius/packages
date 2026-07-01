import { type MaybeRefOrGetter, toValue } from 'vue';
import { type EligibleTarget } from '../util';
import useEventListener from './useEventListener';

type HotKeyHandler = (evt: KeyboardEvent) => void;

export type UseHotKeyOptions = {
    readonly target?: MaybeRefOrGetter<EligibleTarget | null | undefined>;
    readonly enabled?: MaybeRefOrGetter<boolean>;
    readonly event?: 'keydown' | 'keyup';
    readonly preventDefault?: boolean;
    readonly stopPropagation?: boolean;
    readonly ignoreWhileTyping?: boolean;
    readonly repeat?: boolean;
};

type ParsedShortcut = {
    readonly key: string;
    readonly ctrl: boolean;
    readonly meta: boolean;
    readonly shift: boolean;
    readonly alt: boolean;
    readonly mod: boolean;
};

const KEY_ALIASES: Record<string, string> = {
    esc: 'escape',
    space: ' ',
    spacebar: ' ',
    up: 'arrowup',
    down: 'arrowdown',
    left: 'arrowleft',
    right: 'arrowright',
    return: 'enter',
    del: 'delete',
    plus: '+'
};

export default function (shortcuts: string | string[], handler: HotKeyHandler, options?: UseHotKeyOptions): () => void {
    const {target, enabled, event = 'keydown', preventDefault = true, stopPropagation = false, ignoreWhileTyping = true, repeat = false} = options ?? {};
    const parsed = (Array.isArray(shortcuts) ? shortcuts : [shortcuts]).map(parseShortcut);

    function resolveTarget(): EligibleTarget | null | undefined {
        if (target !== undefined) {
            return toValue(target);
        }

        return typeof window !== 'undefined' ? window : null;
    }

    function onKey(evt: KeyboardEvent): void {
        if (enabled !== undefined && !toValue(enabled)) {
            return;
        }

        if (evt.repeat && !repeat) {
            return;
        }

        const apple = isApplePlatform();
        const key = evt.key.toLowerCase();

        for (const shortcut of parsed) {
            const requiresMeta = shortcut.meta || (shortcut.mod && apple);
            const requiresCtrl = shortcut.ctrl || (shortcut.mod && !apple);

            // For punctuation/symbol/digit keys the shift state is already baked
            // into `evt.key` (`?` is Shift + `/`, and on some layouts a digit
            // needs Shift), so only enforce shift when it was requested explicitly
            // — otherwise `'?'` would never match. Letters are exempt: shift only
            // changes their case (which we normalise via `toLowerCase`), so shift
            // stays a meaningful modifier and `mod+d` must not also fire for
            // `mod+shift+d`.
            const ignoreShift = !shortcut.shift && shortcut.key.length === 1 && !/^[a-z]$/.test(shortcut.key);

            const matches = evt.metaKey === requiresMeta
                && evt.ctrlKey === requiresCtrl
                && (ignoreShift || evt.shiftKey === shortcut.shift)
                && evt.altKey === shortcut.alt
                && key === shortcut.key;

            if (!matches) {
                continue;
            }

            if (ignoreWhileTyping && !requiresMeta && !requiresCtrl && isEditable(evt.target)) {
                return;
            }

            if (preventDefault) {
                evt.preventDefault();
            }

            if (stopPropagation) {
                evt.stopPropagation();
            }

            handler(evt);
            return;
        }
    }

    return useEventListener(resolveTarget, event, onKey);
}

function parseShortcut(shortcut: string): ParsedShortcut {
    let key = '';
    let ctrl = false;
    let meta = false;
    let shift = false;
    let alt = false;
    let mod = false;

    for (const raw of shortcut.split('+')) {
        const token = raw.trim().toLowerCase();

        switch (token) {
            case 'ctrl':
            case 'control':
                ctrl = true;
                break;

            case 'meta':
            case 'cmd':
            case 'command':
            case 'super':
            case 'win':
            case 'windows':
                meta = true;
                break;

            case 'shift':
                shift = true;
                break;

            case 'alt':
            case 'option':
            case 'opt':
                alt = true;
                break;

            case 'mod':
                mod = true;
                break;

            case '':
                break;

            default:
                key = KEY_ALIASES[token] ?? token;
                break;
        }
    }

    return {key, ctrl, meta, shift, alt, mod};
}

function isEditable(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    return target.tagName === 'INPUT'
        || target.tagName === 'TEXTAREA'
        || target.tagName === 'SELECT'
        || target.isContentEditable;
}

function isApplePlatform(): boolean {
    if (typeof navigator === 'undefined') {
        return false;
    }

    return /mac|iphone|ipod|ipad/i.test(navigator.platform || navigator.userAgent);
}
