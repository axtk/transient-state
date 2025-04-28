import {useCallback, useContext} from 'react';
import {TransientStateContext} from './TransientStateContext';

/**
 * Returns a function that removes the given key, or multiple keys,
 * from the transient state context.
 *
 * With a key ending with '*', the cleanup function will remove the
 * keys starting like the given key.
 *
 * '*' as a key will signal to remove all items from the context.
 */
export function useTransientStateCleanup(key: string | string[] | Set<string>) {
    let transientState = useContext(TransientStateContext);

    return useCallback(() => {
        let keys = key instanceof Set
            ? key
            : new Set(Array.isArray(key) ? key : [key]);

        if (keys.has('*')) {
            transientState.clear();
            return;
        }

        let wildcardKeys = new Set<string>();

        for (let k of keys) {
            let deleted = transientState.delete(k);

            if (!deleted && k.endsWith('*'))
                wildcardKeys.add(k);
        }

        if (wildcardKeys.size === 0)
            return;
    
        let mapKeys = transientState.keys();

        for (let k of wildcardKeys) {
            let keyPrefix = k.slice(0, -1);

            for (let mapKey of mapKeys) {
                if (mapKey.startsWith(keyPrefix))
                    transientState.delete(mapKey);
            }
        }
    }, [key, transientState]);
}
