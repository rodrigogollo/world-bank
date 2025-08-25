"use client";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { DevelopmentReducer, initialState, DevelopmentState, DevelopmentAction, ProcessedData, EconomicData } from "./DevelopmentReducer";

interface DevelopmentContextType extends DevelopmentState {
  changeCountry: (country: string) => void;
  refreshData: () => void;
  getLatestData: () => ProcessedData | null;
  getDataByYear: (year: string) => ProcessedData | null;
  getYearsWithData: () => string[];
}

const DevelopmentContext = createContext<DevelopmentContextType | undefined>(undefined);

// ---------- Fetch helpers ----------
async function getGDPbyCountry(country: string): Promise<EconomicData[]> {
  const res = await fetch(`https://api.worldbank.org/v2/country/${country}/indicator/NY.GDP.MKTP.CD?format=json&per_page=50`);
  if (!res.ok) throw new Error("Failed to fetch GDP data");
  const data = await res.json();
  return data[1] || [];
}

async function getGDPPerCapitaPPP(country: string): Promise<EconomicData[]> {
  const res = await fetch(`https://api.worldbank.org/v2/country/${country}/indicator/NY.GDP.PCAP.PP.CD?format=json&per_page=50`);
  if (!res.ok) throw new Error("Failed to fetch GDP per capita PPP data");
  const data = await res.json();
  return data[1] || [];
}

async function getPopulationData(country: string): Promise<EconomicData[]> {
  const res = await fetch(`https://api.worldbank.org/v2/country/${country}/indicator/SP.POP.TOTL?format=json&per_page=50`);
  if (!res.ok) throw new Error("Failed to fetch population data");
  const data = await res.json();
  return data[1] || [];
}

function processEconomicData(
  gdpData: EconomicData[],
  gdpPPPData: EconomicData[],
  popData: EconomicData[]
): ProcessedData[] {
  const years = Array.from(new Set([
    ...gdpData.map(d => d.date),
    ...gdpPPPData.map(d => d.date),
    ...popData.map(d => d.date),
  ])).sort((a, b) => parseInt(b) - parseInt(a));

  const processed: ProcessedData[] = years.map(year => {
    const gdpEntry = gdpData.find(d => d.date === year);
    const gdpPPPEntry = gdpPPPData.find(d => d.date === year);
    const popEntry = popData.find(d => d.date === year);

    const gdpValue = gdpEntry?.value || null;
    const populationValue = popEntry?.value || null;
    const gdpPerCapita = gdpValue && populationValue ? gdpValue / populationValue : null;

    return {
      year,
      gdp: gdpValue,
      gdpPerCapitaPPP: gdpPPPEntry?.value || null,
      population: populationValue,
      gdpPerCapita,
    };
  });

  return processed.map((item, index) => {
    const previousYear = processed[index + 1];
    let gdpGrowthRate = null;

    if (item.gdp && previousYear?.gdp) {
      gdpGrowthRate = ((item.gdp - previousYear.gdp) / previousYear.gdp) * 100;
    }

    return { ...item, gdpGrowthRate };
  });
}

// ---------- Provider ----------
export const DevelopmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(DevelopmentReducer, initialState, (init) => {
    // Load from localStorage if available
    const saved = localStorage.getItem("developmentState");
    return saved ? JSON.parse(saved) : init;
  });

  const fetchAllData = async (country: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const [gdpData, gdpPPPData, popData] = await Promise.all([
        getGDPbyCountry(country),
        getGDPPerCapitaPPP(country),
        getPopulationData(country),
      ]);

      const processed = processEconomicData(gdpData, gdpPPPData, popData);

      dispatch({
        type: "SET_DATA",
        payload: { gdp: gdpData, gdpPPP: gdpPPPData, pop: popData, processed },
      });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({ type: "SET_PAGE_LOADED", payload: true });
    }
  };

  // Persist state
  useEffect(() => {
    localStorage.setItem("developmentState", JSON.stringify(state));
  }, [state]);

  // Initial load
  useEffect(() => {
    if (!state.pageLoaded) {
      fetchAllData(state.country);
    }
  }, []);

  // Refetch when country changes
  useEffect(() => {
    if (state.pageLoaded) {
      fetchAllData(state.country);
    }
  }, [state.country]);

  const value: DevelopmentContextType = {
    ...state,
    changeCountry: (newCountry: string) => dispatch({ type: "SET_COUNTRY", payload: newCountry }),
    refreshData: () => fetchAllData(state.country),
    getLatestData: () => (state.processedData.length > 0 ? state.processedData[0] : null),
    getDataByYear: (year: string) => state.processedData.find(data => data.year === year) || null,
    getYearsWithData: () => state.processedData.map(data => data.year),
  };

  return (
    <DevelopmentContext.Provider value= { value } >
    { children }
    </DevelopmentContext.Provider>
   )
};

export const useDevelopmentContext = () => {
  const context = useContext(DevelopmentContext);
  if (!context) {
    throw new Error("useDevelopmentContext must be used within a DevelopmentProvider");
  }
  return context;
};
