import type {Store} from 'groundstate';
import {createContext} from 'react';
import type {TransientState} from './TransientState';

export const TransientStateContext = createContext(
    new Map<string, Store<TransientState>>(),
);
