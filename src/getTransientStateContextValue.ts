import type {Store} from 'groundstate';
import type {TransientState} from './TransientState';

export function getTransientStateContextValue() {
    return new Map<string, Store<TransientState>>();
}
