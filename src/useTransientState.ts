import {useCallback, useContext, useMemo, useRef, useState} from 'react';
import {SetStoreState, Store, useStore} from 'groundstate';
import {TransientStateContext} from './TransientStateContext';
import type {TransientState} from './TransientState';

/**
 * Returns an array containing `[state, withState, setState]`:
 * - `state` of a value passed to `withState()` reflecting its
 * completeness (which is `false` if the value is a Promise in the
 * pending state), an error (if the value is a rejected Promise), and
 * a timestamp of the latest state update;
 * - `withState(value, [overt=true])` tracks the state of the `value`
 * passed as the first parameter, setting the optional boolean `overt`
 * parameter to `false` prevents setting the state's `complete` to
 * `false` while it's pending (e.g. for background or optimistic
 * updates);
 * - `setState()` to directly update the state (normally unnecessary).
 */
export function useTransientState(
    /**
     * A unique store key or a store. Providing a store key or a
     * shared store allows to share the state across multiple
     * components.
     */
    store?: string | Store<TransientState> | null,
): [
    TransientState,
    <T>(value: T) => T,
    SetStoreState<TransientState>,
] {
    let storeMap = useContext(TransientStateContext);
    let storeRef = useRef(new Store<TransientState>({}));
    let [itemInited, setItemInited] = useState(false);

    let resolvedStore = useMemo(() => {
        if (store instanceof Store)
            return store;

        if (typeof store === 'string') {
            let storeItem = storeMap.get(store);

            if (!storeItem) {
                storeMap.set(store, storeItem = new Store<TransientState>({}));

                if (!itemInited)
                    setItemInited(true);
            }

            return storeItem;
        }

        return storeRef.current;
    }, [store, storeMap, storeRef, itemInited, setItemInited]);

    let [state, setState] = useStore(resolvedStore);

    let withState = useCallback(<T>(value: T, overt = true): T => {
        if (value instanceof Promise) {
            if (overt)
                setState(prevState => ({
                    ...prevState,
                    complete: false,
                }));

            return value
                .then(resolvedValue => {
                    setState({
                        error: undefined,
                        complete: true,
                        time: Date.now(),
                    });

                    return resolvedValue;
                })
                .catch(error => {
                    setState({
                        error,
                        complete: true,
                        time: Date.now(),
                    });

                    throw error;
                }) as T;
        }

        setState({
            error: undefined,
            complete: true,
            time: Date.now(),
        });

        return value;
    }, [setState]);

    return [state, withState, setState];
}
