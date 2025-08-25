"use client"
import dynamic from "next/dynamic";

// Dynamically import Recharts components with SSR disabled
const BarChart = dynamic(() => import('recharts').then(mod => ({ default: mod.BarChart })), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => ({ default: mod.Bar })), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => ({ default: mod.AreaChart })), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => ({ default: mod.Area })), { ssr: false });
const ComposedChart = dynamic(() => import('recharts').then(mod => ({ default: mod.ComposedChart })), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => ({ default: mod.Line })), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => ({ default: mod.PieChart })), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => ({ default: mod.Pie })), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => ({ default: mod.Cell })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => ({ default: mod.Tooltip })), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => ({ default: mod.Legend })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })), { ssr: false });

// 1. GDP Growth Rate Bar Chart
export const GDPGrowthBarChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border-2 border-blue-500 rounded p-4 shadow-lg">
          <p className="font-semibold">{`Year: ${label}`}</p>
          <p className="text-blue-600">
            {`GDP Growth: ${data.gdpGrowthRate?.toFixed(2) || 'N/A'}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return <div className="text-center p-4">No growth data available</div>;
  }

  return (
    <div className="flex flex-col my-8 p-8 bg-white shadow-xl shadow-blue-200 rounded-2xl  h-96">
      <h3 className="text-xl font-semibold mb-4 text-center">GDP Growth Rate Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis label={{ value: 'Growth Rate (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="gdpGrowthRate"
            fill="#3b82f6"
            name="GDP Growth Rate (%)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 2. Population Growth Area Chart
export const PopulationAreaChart = ({ data }) => {
  const formatPopulation = (value) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    return value?.toLocaleString();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border-2 border-green-500 rounded p-4 shadow-lg">
          <p className="font-semibold">{`Year: ${label}`}</p>
          <p className="text-green-600">
            {`Population: ${formatPopulation(data.population)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return <div className="text-center p-4">No population data available</div>;
  }

  return (
    <div className="flex flex-col my-8 p-8 bg-white shadow-xl shadow-green-200 rounded-2xl ">
      <h3 className="text-xl font-semibold mb-4 text-center">Population Trend</h3>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis
            label={{ value: 'Population', angle: -90, position: 'insideLeft' }}
            tickFormatter={formatPopulation}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="population"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.6}
            name="Population"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// 3. GDP vs GDP Per Capita Composed Chart
export const GDPComposedChart = ({ data }) => {
  const formatGDP = (value) => {
    if (value >= 1000000000000) {
      return `$${(value / 1000000000000).toFixed(1)}T`;
    } else if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }
    return `$${value}`;
  };

  const formatGDPPerCapita = (value) => {
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border-2 border-purple-500 rounded p-4 shadow-lg">
          <p className="font-semibold">{`Year: ${label}`}</p>
          <p className="text-blue-600">
            {`GDP: ${formatGDP(data.gdp)}`}
          </p>
          <p className="text-purple-600">
            {`GDP per Capita: ${formatGDPPerCapita(data.gdpPerCapita)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return <div className="text-center p-4">No GDP data available</div>;
  }

  return (
    <div className="flex flex-col my-8 p-8 bg-white shadow-xl shadow-purple-200 rounded-2xl ">
      <h3 className="text-xl font-semibold mb-4 text-center">GDP vs GDP Per Capita</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis
            yAxisId="left"
            label={{ value: 'GDP (Trillions)', angle: -90, position: 'insideLeft' }}
            tickFormatter={formatGDP}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: 'GDP per Capita ($)', angle: 90, position: 'insideRight' }}
            tickFormatter={formatGDPPerCapita}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="gdp"
            fill="#3b82f6"
            name="Total GDP"
            fillOpacity={0.7}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="gdpPerCapita"
            stroke="#8b5cf6"
            strokeWidth={3}
            name="GDP per Capita"
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// 4. Economic Indicators Pie Chart (Latest Year)
export const EconomicIndicatorsPie = ({ data, country }) => {
  if (!data || data.length === 0) {
    return <div className="text-center p-4">No data available for pie chart</div>;
  }

  const latestData = data[0];

  // Create pie data for economic breakdown (this is illustrative - you can customize)
  const pieData = [
    {
      name: 'GDP per Capita',
      value: latestData.gdpPerCapita ? Math.round(latestData.gdpPerCapita / 1000) : 0,
      color: '#3b82f6'
    },
    {
      name: 'GDP per Capita PPP',
      value: latestData.gdpPerCapitaPPP ? Math.round(latestData.gdpPerCapitaPPP / 1000) : 0,
      color: '#10b981'
    }
  ].filter(item => item.value > 0);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white border-2 border-gray-300 rounded p-4 shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p style={{ color: data.color }}>
            {`Value: $${data.value}K`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col my-8 p-8 bg-white shadow-xl shadow-orange-200 rounded-2xl  max-w-md">
      <h3 className="text-xl font-semibold mb-4 text-center">
        Economic Indicators ({latestData.year})
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// 5. Multi-Country Comparison Bar Chart (you can extend this for multiple countries)
export const CountryComparisonChart = ({ countries, latestYear }) => {
  // This would need data from multiple countries - placeholder structure
  const comparisonData = countries?.map(country => ({
    country: country.name,
    gdp: country.gdp,
    gdpPerCapita: country.gdpPerCapita,
    population: country.population
  })) || [];

  if (!comparisonData || comparisonData.length === 0) {
    return (
      <div className="flex flex-col my-8 p-8 bg-white shadow-xl shadow-red-200 rounded-2xl ">
        <h3 className="text-xl font-semibold mb-4 text-center">Country Comparison</h3>
        <div className="text-center p-8">
          <p className="text-gray-500">Multi-country comparison requires additional data</p>
          <p className="text-sm text-gray-400 mt-2">This chart will show comparisons when multiple country data is loaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col my-8 p-8 bg-white shadow-xl shadow-red-200 rounded-2xl ">
      <h3 className="text-xl font-semibold mb-4 text-center">
        Country Comparison ({latestYear})
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={comparisonData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="country" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="gdpPerCapita" fill="#3b82f6" name="GDP per Capita" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
