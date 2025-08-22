"use client"
import Topbar from "@/components/Topbar/Topbar";
import useDevelopment from "./hooks/useDevelopment.hooks";
import dynamic from "next/dynamic";

// Dynamically import Recharts components with SSR disabled
const LineChart = dynamic(() => import('recharts').then(mod => ({ default: mod.LineChart })), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => ({ default: mod.Line })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => ({ default: mod.Tooltip })), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => ({ default: mod.Legend })), { ssr: false });

const Development = () => {
  const { gdp, loading, error } = useDevelopment();

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

  // Custom tooltip to show formatted values
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '5px',
          padding: '10px'
        }}>
          <p>{`Year: ${label}`}</p>
          <p style={{ color: '#8884d8' }}>
            {`GDP: $${data["GDP (in trillion USD)"]} trillion USD`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div>Loading GDP data...</div>;
  if (error) return <div>Error loading GDP data: {error}</div>;

  return (
    <>
      <Topbar iconName={"TrendingUp"} title="Development & Economy" subtitle="Comprehensive economic indicators and GDP analysis across major economies" />
      <section className="flex flex-col w-[60%] bg-white p-8 border-0 rounded-2xl m-4">
        {transformedData.length > 0 ? (
          <LineChart width={600} height={400} data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              label={{ value: 'GDP (Trillion USD)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="GDP (in trillion USD)"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        ) : (
          <div>No GDP data available</div>
        )}
      </section>

      <ul className="p-10">
        <li>GDP and Population</li>
        <li>Poverty</li>
        <li>Inflation</li>
        <li>Trade</li>
      </ul>
    </>
  )
}

export default Development;
