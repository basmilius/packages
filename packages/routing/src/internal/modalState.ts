import type { HistoryState } from 'vue-router';

export type ModalState = {
    readonly backgroundPath: string;
    readonly depth: number;
};

// note: Schema of the modal-related fields stored on `history.state`:
//   { modal: true, modalBackgroundPath: '/users', modalDepth: 0 }
//  - `modal: true` is the source of truth for "this entry is a modal".
//  - `modalBackgroundPath` is the fullPath of the route rendered behind
//    the modal wrapper.
//  - `modalDepth` is the number of parent records above the deepest matched
//    record that should render inside the modal wrapper (default 0 = only
//    render the deepest matched record).

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
        // note: Using `null` rather than `delete` — vue-router's history
        //  replace/push merges state, and `null` unambiguously wipes the
        //  previous value in the merged entry.
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
