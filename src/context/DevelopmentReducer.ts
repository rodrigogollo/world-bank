export interface EconomicData {
  indicator: { id: string; value: string };
  country: { id: string; value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

export interface ProcessedData {
  year: string;
  gdp: number | null;
  gdpPerCapitaPPP: number | null;
  population: number | null;
  gdpPerCapita?: number | null;
  gdpGrowthRate?: number | null;
}

export interface DevelopmentState {
  gdp: EconomicData[];
  gdpPerCapitaPPP: EconomicData[];
  population: EconomicData[];
  processedData: ProcessedData[];
  loading: boolean;
  pageLoaded: boolean;
  error: string | null;
  country: string;
}

export type DevelopmentAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_DATA"; payload: { gdp: EconomicData[]; gdpPPP: EconomicData[]; pop: EconomicData[]; processed: ProcessedData[] } }
  | { type: "SET_COUNTRY"; payload: string }
  | { type: "SET_PAGE_LOADED"; payload: boolean };

export const initialState: DevelopmentState = {
  gdp: [],
  gdpPerCapitaPPP: [],
  population: [],
  processedData: [],
  loading: false,
  pageLoaded: false,
  error: null,
  country: "US",
};

export function DevelopmentReducer(state: DevelopmentState, action: DevelopmentAction): DevelopmentState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_DATA":
      return {
        ...state,
        gdp: action.payload.gdp,
        gdpPerCapitaPPP: action.payload.gdpPPP,
        population: action.payload.pop,
        processedData: action.payload.processed,
      };
    case "SET_COUNTRY":
      return { ...state, country: action.payload };
    case "SET_PAGE_LOADED":
      return { ...state, pageLoaded: action.payload };
    default:
      return state;
  }
}
