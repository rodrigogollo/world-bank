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
import PopulationChart from "@/components/PopulationChart/PopulationChart";
import usePopulation from "@/context/hooks/usePopulation.hooks";
import useGDP from "@/context/hooks/useGDP.hooks";

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
    transformedData,
    analysis,
    gdpPerCapitaGrowth,
    latestData
  } = useGDP();

  const {
    transformedData: populationData,
    loading: populationLoading,
    selectedYear: populationYear,
    changeYear: changePopulationYear,
    getAvailableYears
  } = usePopulation(country);

  const getEconomicRanking = (countryCode: string) => {
    const rankings = {
      'US': 1, 'CN': 2, 'JP': 3, 'DE': 4, 'IN': 5, 'BR': 6, 'RU': 7
    };
    return rankings[countryCode] || 'N/A';
  };

  // Filter processedData to only include years with complete data for charts
  const chartData = processedData.filter(item =>
    item.gdp && item.population && item.gdpPerCapita
  );

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle: `
      @media print {
        @page { 
          margin: 0; 
        }
      }
      body {
        -webkit-print-color-adjust: economy;
         color: black !important;
      }
    `,
  });

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
              {/* <CardKPI */}
              {/*   iconName="DollarSign" */}
              {/*   title="GDP" */}
              {/*   subtitle={`${analysis.latestYear} total GDP`} */}
              {/*   value={analysis.latestGDPFormatted} */}
              {/*   growth={analysis.growthRateFormatted} */}
              {/* /> */}
              {/* <CardKPI */}
              {/*   iconName="TrendingUp" */}
              {/*   title="GDP per Capita" */}
              {/*   subtitle="Individual economic output" */}
              {/*   value={latestData?.gdpPerCapita ? formatCurrency(latestData.gdpPerCapita) : 'N/A'} */}
              {/*   growth={gdpPerCapitaGrowth} */}
              {/* /> */}
              {/* <CardKPI */}
              {/*   iconName="Activity" */}
              {/*   title="GDP per Capita PPP" */}
              {/*   subtitle={`${latestData?.year} purchasing power adjusted`} */}
              {/*   value={latestData?.gdpPerCapitaPPP ? formatCurrency(latestData.gdpPerCapitaPPP) : 'N/A'} */}
              {/* /> */}
              {/* <CardKPI */}
              {/*   iconName="Users" */}
              {/*   title="Population" */}
              {/*   subtitle={`${latestData?.year} total population`} */}
              {/*   value={latestData?.population ? formatNumber(latestData.population) : 'N/A'} */}
              {/*   growth={populationGrowth} */}
              {/* /> */}
              {/* <CardKPI */}
              {/*   iconName="BarChart" */}
              {/*   title="Growth Rate" */}
              {/*   subtitle={`${analysis.latestYear} annual GDP growth`} */}
              {/*   value={analysis.growthRateFormatted} */}
              {/* /> */}
              {/* <CardKPI */}
              {/*   iconName="PieChart" */}
              {/*   title="Economic Ranking" */}
              {/*   subtitle="Among major economies" */}
              {/*   value={`#${getEconomicRanking(country)}`} */}
              {/* /> */}

              {/* <CardList /> */}
            </div>

            {/* Charts Section */}
            <div className="">
              {/* Row 1: Original Line Chart and GDP Growth Bar Chart */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 mb-2">
                <div className="col-span-2">
                  <CustomLineChart data={transformedData} />
                </div>
                {/* <GDPGrowthBarChart data={chartData} /> */}
                <PopulationChart
                  data={populationData}
                  year={populationYear}
                  onYearChange={changePopulationYear}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </section>
  );
};

export default Development;
