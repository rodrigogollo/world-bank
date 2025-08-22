"use client"
import Topbar from "@/components/Topbar/Topbar";
import useDevelopment from "./hooks/useDevelopment.hooks";
import CustomLineChart from "@/components/CustomLineChart/CustomLineChart";

const Development = () => {
  const { gdp, loading } = useDevelopment();

  // Transform the GDP data for the chart
  const transformGDPData = (gdpData) => {
    if (!gdpData || !Array.isArray(gdpData)) return [];
    return gdpData
      .filter(item => item.value !== null) // Filter out null values
      .map(item => ({
        year: item.date,
        "GDP (in trillion USD)": (item.value / 1000000000000).toFixed(2), // Convert to trillions and round to 2 decimals
        "GDP (raw)": item.value // Keep raw value for tooltip if needed
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year)); // Sort by year ascending
  };

  const transformedData = transformGDPData(gdp);

  if (loading) return <div>Loading GDP data...</div>;

  return (
    <>
      <Topbar iconName={"TrendingUp"} title="Development & Economy" subtitle="Comprehensive economic indicators and GDP analysis across major economies" />
      <section className="">
        <CustomLineChart data={transformedData} />
      </section>
      <ul className="p-10">
        <li>GDP and Population</li>
        <li>Poverty</li>
        <li>Inflation</li>
        <li>Trade</li>
      </ul>
    </>
  );
};

export default Development;
