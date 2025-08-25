"use client"
import Topbar from "@/components/Topbar/Topbar";
import useDevelopment from "./hooks/useDevelopment.hooks";
import CustomLineChart from "@/components/CustomLineChart/CustomLineChart";
import Loading from "@/components/Loading/Loading";
import CardKPI from "@/components/CardKPI/CardKPI";
import {
  GDPGrowthBarChart,
  PopulationAreaChart,
  GDPComposedChart,
  EconomicIndicatorsPie,
  CountryComparisonChart
} from "@/components/CustomCharts/CustomCharts";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import CardList from "./components/CardList";
import { formatGDPValue } from "./utils";
import { formatCurrency, formatNumber } from "@/utils";


const Development = () => {
  const {
    gdp,
    processedData,
    loading,
    country,
    changeCountry,
    pageLoaded,
    getLatestData,
    refreshData,
  } = useDevelopment();

  // Transform the GDP data for the original line chart
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



  const getEconomicRanking = (countryCode: string) => {
    const rankings = {
      'US': 1, 'CN': 2, 'JP': 3, 'DE': 4, 'IN': 5, 'BR': 6, 'RU': 7
    };
    return rankings[countryCode] || 'N/A';
  };

  const getGDPPerCapitaGrowth = () => {
    if (processedData.length < 2) return null;
    const current = processedData[0];
    const previous = processedData[1];

    if (current?.gdpPerCapita && previous?.gdpPerCapita) {
      const growth = ((current.gdpPerCapita - previous.gdpPerCapita) / previous.gdpPerCapita) * 100;
      return growth.toFixed(2) + '%';
    }
    return null;
  };

  const getPopulationGrowth = () => {
    if (processedData.length < 2) return null;
    const current = processedData[0];
    const previous = processedData[1];

    if (current?.population && previous?.population) {
      const growth = ((current.population - previous.population) / previous.population) * 100;
      return growth.toFixed(2) + '%';
    }
    return null;
  };

  const latestData = getLatestData();
  const transformedData = transformGDPData(gdp);
  const analysis = analyzeGDP(gdp);
  const gdpPerCapitaGrowth = getGDPPerCapitaGrowth();
  const populationGrowth = getPopulationGrowth();

  // Filter processedData to only include years with complete data for charts
  const chartData = processedData.filter(item =>
    item.gdp && item.population && item.gdpPerCapita
  );

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <section className="h-screen w-full">
      <Topbar
        onRefresh={refreshData}
        iconName={"TrendingUp"}
        title="Development & Economy"
        subtitle="Comprehensive economic indicators and GDP analysis across major economies"
        onPrint={reactToPrintFn}
      />

      <main className="p-4" ref={contentRef}>
        <article className="flex flex-row bg-white shadow-md shadow-blue-200 p-4 border-0 rounded-2xl items-center">
          <h1 className="font-semibold text-2xl">Economic Analysis Dashboard</h1>
          <label htmlFor="country" className="ml-auto">Focus Country:</label>
          <select
            value={country}
            onChange={(e) => changeCountry(e.target.value)}
            id="country"
            className="p-2 mx-2 border-1 border-zinc-400 rounded-xl"
          >
            <option value="US">United States</option>
            <option value="CN">China</option>
            <option value="DE">Germany</option>
            <option value="JP">Japan</option>
            <option value="IN">India</option>
            <option value="RU">Russia</option>
            <option value="BR">Brazil</option>
          </select>
        </article>

        {loading ? (
          <Loading />
        ) : (
          <div className="my-4">
            <div className="flex flex-row flex-wrap gap-2">
              <CardKPI
                iconName="DollarSign"
                title="GDP"
                subtitle={`${analysis.latestYear} total GDP`}
                value={analysis.latestGDPFormatted}
                growth={analysis.growthRateFormatted}
              />
              <CardKPI
                iconName="TrendingUp"
                title="GDP per Capita"
                subtitle="Individual economic output"
                value={latestData?.gdpPerCapita ? formatCurrency(latestData.gdpPerCapita) : 'N/A'}
                growth={gdpPerCapitaGrowth}
              />
              <CardKPI
                iconName="Activity"
                title="GDP per Capita PPP"
                subtitle={`${latestData?.year} purchasing power adjusted`}
                value={latestData?.gdpPerCapitaPPP ? formatCurrency(latestData.gdpPerCapitaPPP) : 'N/A'}
              />
              <CardKPI
                iconName="Users"
                title="Population"
                subtitle={`${latestData?.year} total population`}
                value={latestData?.population ? formatNumber(latestData.population) : 'N/A'}
                growth={populationGrowth}
              />
              <CardKPI
                iconName="BarChart"
                title="Growth Rate"
                subtitle={`${analysis.latestYear} annual GDP growth`}
                value={analysis.growthRateFormatted}
              />
              <CardKPI
                iconName="PieChart"
                title="Economic Ranking"
                subtitle="Among major economies"
                value={`#${getEconomicRanking(country)}`}
              />

              {/* <CardList /> */}
            </div>

            {/* Charts Section */}
            <div className="">
              {/* Row 1: Original Line Chart and GDP Growth Bar Chart */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 mb-2">
                <CustomLineChart data={transformedData} />
                {/* <GDPGrowthBarChart data={chartData} /> */}
              </div>
            </div>
          </div>
        )}
      </main>
    </section>
  );
};

export default Development;
