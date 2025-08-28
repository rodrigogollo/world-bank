"use client"

import WorldBankRadarChart from "@/components/RadarChart/RadarChart";
import Topbar from "@/components/Topbar/Topbar";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState()
  useEffect(() => {
    const getBack = async () => {
      const res = await fetch("/api/hello");
      const data = await res.json();
      console.log("data backend", data);
      setData(data);
    }
    getBack();
  }, [])
  return (
    <>
      <Topbar iconName="Home" title="World Bank Data Analytics" subtitle="Comprehensive global economic and development insights" />
      <WorldBankRadarChart />
    </>
  );
}
