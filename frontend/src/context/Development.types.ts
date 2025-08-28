import { ActionMap } from "@/globals/GlobalEntries.types";

export enum DevelopmentActionTypes {
  SetLoading = "SET_LOADING",
  SetError = "SET_ERROR",
  SetData = "SET_DATA",
  SetCountry = "SET_COUNTRY",
  SetPageLoaded = "SET_PAGE_LOADED"
}

export type DevelopmentPayload = {
  [DevelopmentActionTypes.SetLoading]: boolean;
  [DevelopmentActionTypes.SetError]: string | null;
  [DevelopmentActionTypes.SetData]: { gdp: EconomicData[]; gdpPPP: EconomicData[]; pop: EconomicData[]; processed: ProcessedData[] };
  [DevelopmentActionTypes.SetCountry]: string;
  [DevelopmentActionTypes.SetPageLoaded]: boolean;
}

export type DevelopmentActions = ActionMap<DevelopmentPayload>[keyof ActionMap<DevelopmentPayload>];

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
