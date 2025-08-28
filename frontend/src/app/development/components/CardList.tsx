import CardKPI from "@/components/CardKPI/CardKPI"

const CardList = () => {
  return (
    <div className="flex flex-row flex-wrap w-full gap-2">
      <CardKPI
        iconName="DollarSign"
        title="GDP"
        subtitle={`${analysis.latestYear} total GDP`}
        value={analysis.latestGDPFormatted}
        growth={analysis.growthRateFormatted}
      />
      <CardKPI
        iconName="TrendingUp"
        title="GDP per Capita"
        subtitle="Individual economic output"
        value={latestData?.gdpPerCapita ? formatCurrency(latestData.gdpPerCapita) : 'N/A'}
        growth={gdpPerCapitaGrowth}
      />
      <CardKPI
        iconName="Activity"
        title="GDP per Capita PPP"
        subtitle={`${latestData?.year} purchasing power adjusted`}
        value={latestData?.gdpPerCapitaPPP ? formatCurrency(latestData.gdpPerCapitaPPP) : 'N/A'}
      />
      <CardKPI
        iconName="PieChart"
        title="Economic Ranking"
        subtitle="Among major economies"
        value={`#${getEconomicRanking(country)}`}
      />
      <CardKPI
        iconName="Users"
        title="Population"
        subtitle={`${latestData?.year} total population`}
        value={latestData?.population ? formatNumber(latestData.population) : 'N/A'}
        growth={populationGrowth}
      />
      <CardKPI
        iconName="BarChart"
        title="Growth Rate"
        subtitle={`${analysis.latestYear} annual GDP growth`}
        value={analysis.growthRateFormatted}
        growth={analysis.growthRateFormatted}
      />
    </div>
  )
}
export default CardList;
