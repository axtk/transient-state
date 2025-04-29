import {ReactNode, useMemo, useRef} from 'react';
import type {Store} from 'groundstate';
import {getTransientStateContextValue} from './getTransientStateContextValue';
import type {TransientState} from './TransientState';
import {TransientStateContext} from './TransientStateContext';

export type TransientStateProviderProps = {
    value?: Map<string, Store<TransientState>> | null | undefined;
    children?: ReactNode;
};

export const TransientStateProvider = ({
    value,
    children,
}: TransientStateProviderProps) => {
    let defaultValueRef = useRef<Map<string, Store<TransientState>> | undefined>(undefined);

    let resolvedValue = useMemo(() => {
        if (value !== undefined && value !== null)
            return value;

        if (defaultValueRef.current === undefined)
            defaultValueRef.current = getTransientStateContextValue();

        return defaultValueRef.current;
    }, [value]);

    return (
        <TransientStateContext.Provider value={resolvedValue}>
            {children}
        </TransientStateContext.Provider>
    );
};
