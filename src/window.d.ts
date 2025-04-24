/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type {Store} from 'groundstate';
import type {TransientState} from './TransientState';

declare global {
    interface Window {
        _transientState: Map<string, Store<TransientState>>;
    }
}
