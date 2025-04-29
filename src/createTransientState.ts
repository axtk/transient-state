import type {TransientState} from './TransientState';

export function createTransientState(
    initialized = false,
    complete = false,
    error?: unknown,
): TransientState {
    return {
        initialized,
        complete,
        error,
        time: Date.now(),
    };
}
