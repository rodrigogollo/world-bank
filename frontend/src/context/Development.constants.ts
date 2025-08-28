import { DevelopmentState } from "./Development.types";

export const initialDevelopmentState: DevelopmentState = {
  gdp: [],
  gdpPerCapitaPPP: [],
  population: [],
  processedData: [],
  loading: false,
  pageLoaded: false,
  error: null,
  country: "US",
};
