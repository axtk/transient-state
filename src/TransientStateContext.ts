import {createContext} from 'react';
import {getTransientStateContextValue} from './getTransientStateContextValue';

export const TransientStateContext = createContext(getTransientStateContextValue());
