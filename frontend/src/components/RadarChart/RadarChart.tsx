import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// World Bank API configuration
const WORLD_BANK_API_BASE = 'https://api.worldbank.org/v2';

// Predefined indicators organized by domain - focused on growth/change rates
const INDICATORS = {
  economy: [
    { code: 'NY.GDP.MKTP.KD.ZG', name: 'GDP Growth Rate', unit: '%', color: '#8884d8', isGrowthRate: true },
    { code: 'NY.GDP.PCAP.CD', name: 'GDP per Capita Change', unit: '%', color: '#82ca9d', calculateGrowth: true },
    { code: 'SP.POP.GROW', name: 'Population Growth', unit: '%', color: '#ffc658', isGrowthRate: true },
    { code: 'NE.TRD.GNFS.ZS', name: 'Trade Growth', unit: '%', color: '#ff9999', calculateGrowth: true }
  ],
  environment: [
    { code: 'EN.ATM.CO2E.PC', name: 'CO2 Emissions Change', unit: '%', color: '#ff7300', calculateGrowth: true, invertGoodBad: true },
    { code: 'EG.USE.ELEC.KH.PC', name: 'Energy Use Change', unit: '%', color: '#ffbb28', calculateGrowth: true },
    { code: 'AG.LND.FRST.ZS', name: 'Forest Area Change', unit: '%', color: '#00ff00', calculateGrowth: true },
    { code: 'EN.ATM.GHGT.KT.CE', name: 'GHG Emissions Change', unit: '%', color: '#cc6600', calculateGrowth: true, invertGoodBad: true }
  ],
  social: [
    { code: 'SP.DYN.LE00.IN', name: 'Life Expectancy Change', unit: '%', color: '#8dd1e1', calculateGrowth: true },
    { code: 'SE.PRM.NENR', name: 'School Enrollment Change', unit: '%', color: '#d084d0', calculateGrowth: true },
    { code: 'SH.DYN.MORT', name: 'Infant Mortality Change', unit: '%', color: '#ff6b6b', calculateGrowth: true, invertGoodBad: true },
    { code: 'SP.URB.TOTL.IN.ZS', name: 'Urbanization Change', unit: '%', color: '#99ccff', calculateGrowth: true }
  ]
};

// Sample countries for the combobox
const SAMPLE_COUNTRIES = [
  { code: 'USA', name: 'United States' },
  { code: 'CHN', name: 'China' },
  { code: 'JPN', name: 'Japan' },
  { code: 'DEU', name: 'Germany' },
  { code: 'GBR', name: 'United Kingdom' },
  { code: 'FRA', name: 'France' },
  { code: 'BRA', name: 'Brazil' },
  { code: 'IND', name: 'India' },
  { code: 'CAN', name: 'Canada' },
  { code: 'AUS', name: 'Australia' }
];

// Country colors for comparison
const COUNTRY_COLORS = [
  { stroke: '#8884d8', fill: '#8884d8', name: 'Primary' },
  { stroke: '#82ca9d', fill: '#82ca9d', name: 'Secondary' },
  { stroke: '#ffc658', fill: '#ffc658', name: 'Tertiary' },
  { stroke: '#ff7300', fill: '#ff7300', name: 'Quaternary' },
  { stroke: '#8dd1e1', fill: '#8dd1e1', name: 'Quinary' }
];

const WorldBankRadarChart = () => {
  const [selectedCountries, setSelectedCountries] = useState(['USA']);
  const [selectedYear, setSelectedYear] = useState(2022);
  const [comparisonYear, setComparisonYear] = useState(2021);
  const [radarData, setRadarData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Available years for selection (World Bank typically has data up to 2-3 years ago)
  const availableYears = Array.from({ length: 20 }, (_, i) => 2023 - i);

  // Enhanced mock data with multiple years
  const mockDataByYear = {
    2023: {
      'USA': {
        'NY.GDP.MKTP.KD.ZG': 2.5,
        'NY.GDP.PCAP.CD': 70248,
        'SP.POP.GROW': 0.4,
        'NE.TRD.GNFS.ZS': 27.1,
        'EN.ATM.CO2E.PC': 14.2,
        'EG.USE.ELEC.KH.PC': 12394,
        'AG.LND.FRST.ZS': 33.9,
        'EN.ATM.GHGT.KT.CE': 5981,
        'SP.DYN.LE00.IN': 78.9,
        'SE.PRM.NENR': 98.5,
        'SH.DYN.MORT': 5.8,
        'SP.URB.TOTL.IN.ZS': 82.8
      },
      'CHN': {
        'NY.GDP.MKTP.KD.ZG': 5.2,
        'NY.GDP.PCAP.CD': 12556,
        'SP.POP.GROW': 0.2,
        'NE.TRD.GNFS.ZS': 38.4,
        'EN.ATM.CO2E.PC': 8.0,
        'EG.USE.ELEC.KH.PC': 4475,
        'AG.LND.FRST.ZS': 23.3,
        'EN.ATM.GHGT.KT.CE': 12466,
        'SP.DYN.LE00.IN': 78.1,
        'SE.PRM.NENR': 99.9,
        'SH.DYN.MORT': 6.8,
        'SP.URB.TOTL.IN.ZS': 64.7
      },
      'BRA': {
        'NY.GDP.MKTP.KD.ZG': 1.2,
        'NY.GDP.PCAP.CD': 8897,
        'SP.POP.GROW': 0.8,
        'NE.TRD.GNFS.ZS': 20.7,
        'EN.ATM.CO2E.PC': 2.3,
        'EG.USE.ELEC.KH.PC': 2601,
        'AG.LND.FRST.ZS': 59.4,
        'EN.ATM.GHGT.KT.CE': 2170,
        'SP.DYN.LE00.IN': 75.9,
        'SE.PRM.NENR': 99.1,
        'SH.DYN.MORT': 13.4,
        'SP.URB.TOTL.IN.ZS': 88.0
      }
    },
    2022: {
      'USA': {
        'NY.GDP.MKTP.KD.ZG': 2.3,
        'NY.GDP.PCAP.CD': 68823,
        'SP.POP.GROW': 0.7,
        'NE.TRD.GNFS.ZS': 26.8,
        'EN.ATM.CO2E.PC': 14.8,
        'EG.USE.ELEC.KH.PC': 12156,
        'AG.LND.FRST.ZS': 33.87,
        'EN.ATM.GHGT.KT.CE': 6244,
        'SP.DYN.LE00.IN': 78.5,
        'SE.PRM.NENR': 98.2,
        'SH.DYN.MORT': 6.1,
        'SP.URB.TOTL.IN.ZS': 82.5
      },
      'CHN': {
        'NY.GDP.MKTP.KD.ZG': 4.8,
        'NY.GDP.PCAP.CD': 11819,
        'SP.POP.GROW': 0.3,
        'NE.TRD.GNFS.ZS': 35.2,
        'EN.ATM.CO2E.PC': 7.6,
        'EG.USE.ELEC.KH.PC': 4211,
        'AG.LND.FRST.ZS': 23.15,
        'EN.ATM.GHGT.KT.CE': 11891,
        'SP.DYN.LE00.IN': 77.4,
        'SE.PRM.NENR': 99.7,
        'SH.DYN.MORT': 7.2,
        'SP.URB.TOTL.IN.ZS': 63.9
      },
      'BRA': {
        'NY.GDP.MKTP.KD.ZG': 0.8,
        'NY.GDP.PCAP.CD': 8751,
        'SP.POP.GROW': 0.9,
        'NE.TRD.GNFS.ZS': 19.9,
        'EN.ATM.CO2E.PC': 2.4,
        'EG.USE.ELEC.KH.PC': 2521,
        'AG.LND.FRST.ZS': 59.7,
        'EN.ATM.GHGT.KT.CE': 2245,
        'SP.DYN.LE00.IN': 75.1,
        'SE.PRM.NENR': 98.9,
        'SH.DYN.MORT': 13.9,
        'SP.URB.TOTL.IN.ZS': 87.6
      }
    },
    2021: {
      'USA': {
        'NY.GDP.MKTP.KD.ZG': 5.7,
        'NY.GDP.PCAP.CD': 67426,
        'SP.POP.GROW': 0.8,
        'NE.TRD.GNFS.ZS': 26.2,
        'EN.ATM.CO2E.PC': 15.1,
        'EG.USE.ELEC.KH.PC': 11934,
        'AG.LND.FRST.ZS': 33.85,
        'EN.ATM.GHGT.KT.CE': 6387,
        'SP.DYN.LE00.IN': 78.2,
        'SE.PRM.NENR': 98.0,
        'SH.DYN.MORT': 6.4,
        'SP.URB.TOTL.IN.ZS': 82.2
      },
      'CHN': {
        'NY.GDP.MKTP.KD.ZG': 8.1,
        'NY.GDP.PCAP.CD': 11156,
        'SP.POP.GROW': 0.4,
        'NE.TRD.GNFS.ZS': 33.8,
        'EN.ATM.CO2E.PC': 7.4,
        'EG.USE.ELEC.KH.PC': 3996,
        'AG.LND.FRST.ZS': 23.0,
        'EN.ATM.GHGT.KT.CE': 11654,
        'SP.DYN.LE00.IN': 76.9,
        'SE.PRM.NENR': 99.5,
        'SH.DYN.MORT': 7.6,
        'SP.URB.TOTL.IN.ZS': 63.1
      },
      'BRA': {
        'NY.GDP.MKTP.KD.ZG': 1.2,
        'NY.GDP.PCAP.CD': 8535,
        'SP.POP.GROW': 1.0,
        'NE.TRD.GNFS.ZS': 19.1,
        'EN.ATM.CO2E.PC': 2.5,
        'EG.USE.ELEC.KH.PC': 2445,
        'AG.LND.FRST.ZS': 59.9,
        'EN.ATM.GHGT.KT.CE': 2334,
        'SP.DYN.LE00.IN': 74.7,
        'SE.PRM.NENR': 98.7,
        'SH.DYN.MORT': 14.3,
        'SP.URB.TOTL.IN.ZS': 87.2
      }
    }
  };

  // Helper function to calculate growth rate
  const calculateGrowthRate = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  // Helper function to normalize growth rates for radar chart
  const normalizeGrowthForRadar = (growthRate, indicator) => {
    let normalized;

    // Clamp extreme values
    const clampedRate = Math.max(-20, Math.min(20, growthRate));

    if (indicator.invertGoodBad) {
      // For indicators where negative change is good (emissions, mortality)
      if (clampedRate <= 0) {
        normalized = 50 + (Math.abs(clampedRate) / 20) * 50;
      } else {
        normalized = 50 - (clampedRate / 20) * 50;
      }
    } else {
      // For normal indicators where positive change is good
      if (clampedRate >= 0) {
        normalized = 50 + (clampedRate / 20) * 50;
      } else {
        normalized = 50 + (clampedRate / 20) * 50; // This will be < 50 for negative rates
      }
    }

    return Math.max(0, Math.min(100, normalized));
  };

  const fetchWorldBankData = async (countryCodes, currentYear, previousYear) => {
    setLoading(true);
    setError(null);

    try {
      // Get all unique indicators from all domains
      const allIndicators = Object.values(INDICATORS).flat();

      // Create a map to store data for each indicator across countries
      const indicatorMap = new Map();

      // Initialize the map with indicator names
      allIndicators.forEach(indicator => {
        indicatorMap.set(indicator.name, {
          indicator: indicator.name,
          domain: '',
          unit: indicator.unit
        });
      });

      // Process data for each country
      countryCodes.forEach((countryCode, countryIndex) => {
        const currentYearData = mockDataByYear[currentYear]?.[countryCode] || {};
        const previousYearData = mockDataByYear[previousYear]?.[countryCode] || {};

        Object.entries(INDICATORS).forEach(([domain, indicators]) => {
          indicators.forEach(indicator => {
            const currentValue = currentYearData[indicator.code];
            const previousValue = previousYearData[indicator.code];

            if (currentValue !== null && currentValue !== undefined) {
              let growthRate = 0;

              if (indicator.isGrowthRate) {
                growthRate = typeof currentValue === 'number' ? currentValue : 0;
              } else if (indicator.calculateGrowth && previousValue !== null && previousValue !== undefined) {
                growthRate = calculateGrowthRate(currentValue, previousValue);
              }

              const normalizedValue = normalizeGrowthForRadar(growthRate, indicator);

              // Get existing data for this indicator
              const indicatorData = indicatorMap.get(indicator.name);

              // Add country-specific data
              indicatorData.domain = domain.charAt(0).toUpperCase() + domain.slice(1);
              indicatorData[`value_${countryCode}`] = normalizedValue;
              indicatorData[`growthRate_${countryCode}`] = Number(growthRate.toFixed(2));
              indicatorData[`currentValue_${countryCode}`] = currentValue;
              indicatorData[`previousValue_${countryCode}`] = previousValue;
              indicatorData[`isGood_${countryCode}`] = indicator.invertGoodBad ? growthRate < 0 : growthRate > 0;
            }
          });
        });
      });

      // Convert map to array
      const processedData = Array.from(indicatorMap.values()).filter(item =>
        countryCodes.some(code => item[`value_${code}`] !== undefined)
      );

      setRadarData(processedData);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCountries.length > 0) {
      fetchWorldBankData(selectedCountries, selectedYear, comparisonYear);
    }
  }, [selectedCountries, selectedYear, comparisonYear]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg max-w-sm">
          <p className="font-semibold text-gray-800 mb-2">{data.indicator}</p>
          <div className="space-y-2">
            {selectedCountries.map((countryCode, index) => {
              const countryName = SAMPLE_COUNTRIES.find(c => c.code === countryCode)?.name || countryCode;
              const growthRate = data[`growthRate_${countryCode}`];
              const currentValue = data[`currentValue_${countryCode}`];
              const previousValue = data[`previousValue_${countryCode}`];
              const isGood = data[`isGood_${countryCode}`];
              const value = data[`value_${countryCode}`];

              if (growthRate !== undefined) {
                return (
                  <div key={countryCode} className="border-l-4 pl-2" style={{ borderColor: COUNTRY_COLORS[index]?.stroke || '#666' }}>
                    <p className="font-medium text-gray-700">{countryName}</p>
                    <p className="text-sm text-gray-600">
                      Comparing {selectedYear} vs {comparisonYear}
                    </p>
                    <p className={`text-sm ${isGood ? 'text-green-600' : 'text-red-600'}`}>
                      Growth: {growthRate > 0 ? '+' : ''}{growthRate}%
                    </p>
                    {currentValue && (
                      <div className="text-xs text-gray-600">
                        <span>{selectedYear}: {currentValue.toLocaleString()}</span>
                        {previousValue && <span> | {comparisonYear}: {previousValue.toLocaleString()}</span>}
                      </div>
                    )}
                    <p className="text-xs text-blue-600">Score: {value?.toFixed(1)}/100</p>
                  </div>
                );
              }
              return null;
            })}
          </div>
          <p className="text-gray-600 text-sm mt-2">Domain: {data.domain}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          World Bank Development Indicators - Growth Trends Radar
        </h2>

        <p className="text-gray-600 mb-4">
          This radar chart shows growth rates between {comparisonYear} and {selectedYear} across different development domains.
          Higher scores indicate positive trends (or declining negative indicators like emissions).
        </p>

        {/* Year Selection Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Year:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compare with Year:
            </label>
            <select
              value={comparisonYear}
              onChange={(e) => setComparisonYear(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableYears
                .filter(year => year !== selectedYear)
                .map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Country Selector - Multiple Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Countries for Comparison (max 5):
          </label>
          <div className="space-y-2">
            <select
              onChange={(e) => {
                const countryCode = e.target.value;
                if (countryCode && !selectedCountries.includes(countryCode) && selectedCountries.length < 5) {
                  setSelectedCountries([...selectedCountries, countryCode]);
                }
                e.target.value = '';
              }}
              className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Add a country...</option>
              {SAMPLE_COUNTRIES
                .filter(country => !selectedCountries.includes(country.code))
                .map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
            </select>

            {/* Selected Countries Display */}
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCountries.map((countryCode, index) => {
                const country = SAMPLE_COUNTRIES.find(c => c.code === countryCode);
                const color = COUNTRY_COLORS[index] || COUNTRY_COLORS[0];
                return (
                  <div
                    key={countryCode}
                    className="flex items-center gap-2 px-3 py-1 rounded-full text-sm border"
                    style={{
                      borderColor: color.stroke,
                      backgroundColor: color.fill + '20',
                      color: color.stroke
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color.stroke }}
                    />
                    <span className="font-medium">{country?.name || countryCode}</span>
                    <button
                      onClick={() => {
                        setSelectedCountries(selectedCountries.filter(c => c !== countryCode));
                      }}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-blue-600 mb-4">Loading data...</div>
        )}

        {error && (
          <div className="text-red-600 mb-4 p-3 bg-red-50 rounded">
            {error}
          </div>
        )}
      </div>

      {radarData.length > 0 && (
        <div className="h-96 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
              <PolarGrid gridType="polygon" />
              <PolarAngleAxis
                dataKey="indicator"
                tick={{ fontSize: 11, fill: '#666' }}
                className="text-xs"
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#888' }}
                tickFormatter={(value) => `${value}%`}
              />

              {/* Render a Radar component for each selected country */}
              {selectedCountries.map((countryCode, index) => {
                const color = COUNTRY_COLORS[index] || COUNTRY_COLORS[0];
                const countryName = SAMPLE_COUNTRIES.find(c => c.code === countryCode)?.name || countryCode;

                return (
                  <Radar
                    key={countryCode}
                    name={countryName}
                    dataKey={`value_${countryCode}`}
                    stroke={color.stroke}
                    fill={color.fill}
                    fillOpacity={0.1}
                    strokeWidth={2}
                    dot={{ fill: color.stroke, strokeWidth: 2, r: 4 }}
                  />
                );
              })}

              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {Object.entries(INDICATORS).map(([domain, indicators]) => (
          <div key={domain} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2 capitalize">
              {domain} Indicators
            </h3>
            <ul className="space-y-1 text-sm text-gray-600">
              {indicators.map(indicator => (
                <li key={indicator.code}>
                  • {indicator.name} ({indicator.unit})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Growth Rate Approach Benefits:</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• <strong>Comparable Scale:</strong> All values are in percentages, making cross-domain comparison meaningful</p>
          <p>• <strong>Trend Focus:</strong> Shows direction of change rather than absolute values</p>
          <p>• <strong>Smart Scoring:</strong> Negative changes in emissions/mortality are scored as positive trends</p>
          <p>• <strong>Flexible Time Periods:</strong> Compare any two years to analyze different economic cycles</p>
          <p>• <strong>API Strategy:</strong> Fetch specific years: /indicator/{`{code}`}?date={selectedYear};{comparisonYear}&format=json</p>
          <p>• <strong>Historical Analysis:</strong> Track long-term trends by comparing distant years (e.g., 2010 vs 2020)</p>
          <p>• <strong>Real-time Insights:</strong> Quickly identify which domains are improving or declining</p>
        </div>
      </div>
    </div>
  );
};

export default WorldBankRadarChart;
