"use client";

import { DevelopmentActions, DevelopmentState } from "./Development.types";
import { Dispatch, ReactNode, useReducer, createContext } from "react";
import { initialDevelopmentState } from "./Development.constants";
import { DevelopmentReducer } from "./DevelopmentReducer";

type ContextProps = {
  state: DevelopmentState;
  dispatch: Dispatch<DevelopmentActions>;
}

export const DevelopmentContext = createContext<ContextProps>({
  state: initialDevelopmentState,
  dispatch: () => null,
})

export const DevelopmentProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(DevelopmentReducer, initialDevelopmentState);
  return (
    <DevelopmentContext.Provider value={{ state, dispatch }}>
      {children}
    </DevelopmentContext.Provider>
  )
}
