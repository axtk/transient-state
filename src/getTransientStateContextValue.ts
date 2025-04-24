import type {Store} from 'groundstate';
import type {TransientState} from './TransientState';

export function getTransientStateContextValue() {
    let transientState = new Map<string, Store<TransientState>>();

    // for debugging
    if (typeof window !== 'undefined')
        window._transientState = transientState;

    return transientState;
}
