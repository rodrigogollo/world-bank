"use client"
import { useEffect, useState } from "react";

const useDevelopment = () => {
  const [gdp, setGdp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gdpData, setGdpData] = useState();

  useEffect(() => {
    const getGDPbyCountry = async (country: string) => {
      setLoading(true)
      const res = await fetch(`https://api.worldbank.org/v2/country/${country}/indicator/NY.GDP.MKTP.CD?format=json`)
      const data = await res.json();
      console.log("data", data)
      setGdp(data[1]);
      setLoading(false)
    }
    getGDPbyCountry("BR");
  }, [])

  useEffect(() => {

  }, [gdp])



  return {
    gdp,
    loading
  }
}

export default useDevelopment;
