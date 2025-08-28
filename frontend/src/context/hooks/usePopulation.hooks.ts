// hooks/usePopulation.hooks.js
import { useState, useEffect } from 'react';

const usePopulation = (countryCode) => {
  const [populationData, setPopulationData] = useState([]);
  const [transformedData, setTransformedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() - 1);

  // Function to transform raw API data into chart-ready format
  const transformPopulationData = (data, year) => {
    if (!data || !Array.isArray(data)) return [];

    // Filter for the selected year and transform the data
    return data
      .filter(item => item.date === year.toString())
      .map(item => ({
        name: item.ageGroup,
        value: item.value,
        fill: item.fill
      }));
  };

  useEffect(() => {
    const fetchPopulationData = async () => {
      setLoading(true);
      try {
        const indicators = [
          { id: 'SP.POP.0014.TO.ZS', ageGroup: '0-14 Years', fill: '#8884d8' },
          { id: 'SP.POP.1564.TO.ZS', ageGroup: '15-64 Years', fill: '#83a6ed' },
          { id: 'SP.POP.65UP.TO.ZS', ageGroup: '65+ Years', fill: '#8dd1e1' }
        ];

        // Fetch data for all indicators
        const promises = indicators.map(indicator =>
          fetch(`https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator.id}?format=json&per_page=20`)
            .then(response => response.json())
            .then(data => {
              if (data[1]) {
                return data[1].map(item => ({
                  ...item,
                  ageGroup: indicator.ageGroup,
                  fill: indicator.fill
                }));
              }
              return [];
            })
        );

        const results = await Promise.all(promises);

        // Flatten the array and filter out null values
        const flattenedData = results.flat().filter(item => item !== null && item.value !== null);

        if (flattenedData.length > 0) {
          setPopulationData(flattenedData);

          // Transform the data for the selected year
          const transformed = transformPopulationData(flattenedData, selectedYear);
          setTransformedData(transformed);
        } else {
          setError('No population data available for this country');
        }
      } catch (err) {
        setError('Failed to fetch population data');
        console.error('Error fetching population data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (countryCode) {
      fetchPopulationData();
    }
  }, [countryCode, selectedYear]);

  // Function to change year
  const changeYear = (year) => {
    setSelectedYear(year);

    // Re-transform the data for the new year
    const transformed = transformPopulationData(populationData, year);
    setTransformedData(transformed);
  };

  // Get available years from the data
  const getAvailableYears = () => {
    if (!populationData.length) return [];

    const years = [...new Set(populationData.map(item => parseInt(item.date)))];
    return years.sort((a, b) => b - a); // Sort descending (newest first)
  };

  // Get latest year data
  const getLatestData = () => {
    if (!populationData.length) return null;

    const years = getAvailableYears();
    const latestYear = years[0] || new Date().getFullYear() - 1;

    return transformPopulationData(populationData, latestYear);
  };

  return {
    populationData,
    transformedData,
    loading,
    error,
    selectedYear,
    changeYear,
    getAvailableYears,
    getLatestData
  };
};

export default usePopulation;
