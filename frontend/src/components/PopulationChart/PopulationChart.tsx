"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamically import Recharts components with SSR disabled
const RadialBarChart = dynamic(() => import('recharts').then(mod => ({ default: mod.RadialBarChart })), { ssr: false });
const RadialBar = dynamic(() => import('recharts').then(mod => ({ default: mod.RadialBar })), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => ({ default: mod.Legend })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => ({ default: mod.Tooltip })), { ssr: false });

const PopulationChart = ({
  data,
  year: propYear,
  onYearChange
}) => {
  const [selectedYear, setSelectedYear] = useState(propYear || new Date().getFullYear() - 1);

  // Generate year options (last 10 years)
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear - 1; year >= currentYear - 10; year--) {
    yearOptions.push(year);
  }

  // Handle year change
  const handleYearChange = (year) => {
    setSelectedYear(year);
    if (onYearChange) {
      onYearChange(year);
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-800">{payload[0].payload.name}</p>
          <p className="text-blue-600">{`${payload[0].value.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col my-4 p-6 bg-white shadow-xl shadow-blue-100 rounded-2xl h-96 justify-center items-center">
        <h3 className="text-xl font-semibold mb-4 text-center">Population Distribution by Age</h3>
        <p className="text-gray-500">No population data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col my-4 p-6 bg-white shadow-xl shadow-blue-100 rounded-2xl h-96">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Population Distribution by Age</h3>
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(parseInt(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {yearOptions.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="10%"
          outerRadius="80%"
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            minAngle={15}
            label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
            background
            clockWise
            dataKey="value"
          />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            wrapperStyle={{
              right: 0,
              top: '50%',
              transform: 'translate(0, -50%)',
              lineHeight: '24px',
              fontSize: '12px'
            }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PopulationChart;
