import { DevelopmentActions, DevelopmentActionTypes, DevelopmentState } from "./Development.types";

export function DevelopmentReducer(state: DevelopmentState, action: DevelopmentActions): DevelopmentState {
  switch (action.type) {
    case DevelopmentActionTypes.SetLoading:
      return { ...state, loading: action.payload };
    case DevelopmentActionTypes.SetError:
      return { ...state, error: action.payload };
    case DevelopmentActionTypes.SetData:
      return {
        ...state,
        gdp: action.payload.gdp,
        gdpPerCapitaPPP: action.payload.gdpPPP,
        population: action.payload.pop,
        processedData: action.payload.processed,
      };
    case DevelopmentActionTypes.SetCountry:
      return { ...state, country: action.payload };
    case DevelopmentActionTypes.SetPageLoaded:
      return { ...state, pageLoaded: action.payload };
    default:
      return state;
  }
}
