"use client"
import dynamic from "next/dynamic";

// Dynamically import Recharts components with SSR disabled
const LineChart = dynamic(() => import('recharts').then(mod => ({ default: mod.LineChart })), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => ({ default: mod.Line })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => ({ default: mod.Tooltip })), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => ({ default: mod.Legend })), { ssr: false });

const CustomLineChart = ({ data, width = 600, height = 400, xDataKey = "year", yLabel = "GDP (Trillion USD)", lineDataKey = "GDP (in trillion USD)", lineColor = "#8884d8" }) => {
  // Custom tooltip to show formatted values
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border-1 border-blue-500 rounded p-4">
          <p>{`Year: ${label}`}</p>
          <p className="text-blue-600">
            {`GDP: $${data[lineDataKey]} trillion USD`}
          </p>
        </div >
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return <div>No data available for chart</div>;
  }

  return (
    <div className="flex m-8 p-8 bg-white shadow-xl shadow-blue-200 rounded-2xl w-full max-w-2xl h-96">
      <LineChart width={width} height={height} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xDataKey}
          interval="preserveStartEnd"
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          label={{ value: yLabel, angle: -90, position: 'insideLeft' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey={lineDataKey}
          stroke={lineColor}
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </div>
  );
};

export default CustomLineChart;
