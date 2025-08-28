"use client"
import { useContext, useEffect } from "react";
import { DevelopmentActionTypes, EconomicData, ProcessedData } from "../Development.types";
import { DevelopmentContext } from "../DevelopmentContext";
import { formatGDPValue } from "@/app/development/utils";

const useGDP = () => {
  const { state, dispatch } = useContext(DevelopmentContext)
  useEffect(() => console.log("state", state), [])

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

  const fetchAllData = async (country: string) => {
    dispatch({ type: DevelopmentActionTypes.SetLoading, payload: true });
    dispatch({ type: DevelopmentActionTypes.SetError, payload: null });

    try {
      const [gdpData, gdpPPPData, popData] = await Promise.all([
        getGDPbyCountry(country),
        getGDPPerCapitaPPP(country),
        getPopulationData(country),
      ]);

      const processed = processEconomicData(gdpData, gdpPPPData, popData);

      dispatch({
        type: DevelopmentActionTypes.SetData,
        payload: {
          gdp: gdpData,
          gdpPPP: gdpPPPData,
          pop: popData,
          processed
        },
      });

    } catch (err) {
      dispatch({
        type: DevelopmentActionTypes.SetError,
        payload: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      dispatch({ type: DevelopmentActionTypes.SetLoading, payload: false });
      dispatch({ type: DevelopmentActionTypes.SetPageLoaded, payload: true });
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

  const getLatestData = (): ProcessedData | null => {
    return state?.processedData?.length > 0 ? state.processedData[0] : null
  }

  const changeCountry = (newCountry: string) => {
    dispatch({
      type: DevelopmentActionTypes.SetCountry,
      payload: newCountry
    })
  }

  const refreshData = () => {
    fetchAllData(state.country)
  }

  const getGDPPerCapitaGrowth = () => {
    if (state.processedData.length < 2) return null;
    const current = state.processedData[0];
    const previous = state.processedData[1];

    if (current?.gdpPerCapita && previous?.gdpPerCapita) {
      const growth = ((current.gdpPerCapita - previous.gdpPerCapita) / previous.gdpPerCapita) * 100;
      return growth.toFixed(2) + '%';
    }
    return null;
  };

  const transformGDPData = (gdpData) => {
    if (!gdpData || !Array.isArray(gdpData)) return [];
    return gdpData
      .filter(item => item.value !== null)
      .map(item => ({
        year: item.date,
        "GDP (in trillion USD)": (item.value / 1000000000000).toFixed(2),
        "GDP (raw)": item.value
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  };

  function analyzeGDP(data) {
    const sortedRecords = data.sort((a, b) => parseInt(b.date) - parseInt(a.date));
    const latestYear = sortedRecords[0];
    const previousYear = sortedRecords[1];
    const latestGDP = latestYear?.value ?? 0;
    const previousGDP = previousYear?.value ?? 0;
    const growthRate = ((latestGDP - previousGDP) / previousGDP) * 100;

    return {
      latestYear: latestYear?.date,
      latestGDP: latestGDP,
      latestGDPFormatted: formatGDPValue(latestGDP),
      previousYear: previousYear?.date,
      previousGDP: previousGDP,
      growthRate: growthRate,
      growthRateFormatted: growthRate.toFixed(2) + '%'
    };
  }


  const getPopulationGrowth = () => {
    if (state.processedData?.length < 2) return null;
    const current = state.processedData[0];
    const previous = state.processedData[1];

    if (current?.population && previous?.population) {
      const growth = ((current.population - previous.population) / previous.population) * 100;
      return growth.toFixed(2) + '%';
    }
    return null;
  };

  const populationGrowth = getPopulationGrowth();

  return {
    gdp: state.gdp,
    processedData: state.processedData,
    loading: state.loading,
    country: state.country,
    pageLoaded: state.pageLoaded,
    changeCountry,
    refreshData,
    gdpPerCapitaGrowth: getGDPPerCapitaGrowth,
    transformedData: transformGDPData(state.gdp),
    analysis: analyzeGDP(state.gdp),
    latestData: getLatestData(),
    populationGrowth,
  }
}

export default useGDP;
