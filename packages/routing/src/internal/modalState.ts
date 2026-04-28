import type { HistoryState } from 'vue-router';

export type ModalState = {
    readonly backgroundPath: string;
    readonly depth: number;
};

// note: Modal fields on `history.state`:
//   { modal: true, modalBackgroundPath: '/users', modalDepth: 0 }
//  - `modal` flags the entry as a modal.
//  - `modalBackgroundPath` is the fullPath rendered behind the wrapper.
//  - `modalDepth` is the parent-record count above the deepest matched
//    record that renders inside the wrapper (0 = deepest only).

export function readModalState(): ModalState | null {
    if (typeof history === 'undefined' || !history.state) {
        return null;
    }

    const state = history.state as Record<string, unknown>;

    if (state.modal !== true) {
        return null;
    }

    if (typeof state.modalBackgroundPath !== 'string' || !state.modalBackgroundPath) {
        return null;
    }

    return {
        backgroundPath: state.modalBackgroundPath,
        depth: typeof state.modalDepth === 'number' ? Math.max(0, state.modalDepth) : 0
    };
}

export function writeModalState(base: HistoryState | null, backgroundPath: string | null, depth: number = 0): HistoryState {
    const next: HistoryState = {...(base ?? {})};

    if (backgroundPath === null) {
        // note: `null` (not `delete`) so vue-router's state-merging
        //  unambiguously wipes the previous value.
        next.modal = null;
        next.modalBackgroundPath = null;
        next.modalDepth = null;

        return next;
    }

    next.modal = true;
    next.modalBackgroundPath = backgroundPath;
    next.modalDepth = Math.max(0, depth);

    return next;
}
