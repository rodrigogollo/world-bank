import Topbar from "@/components/Topbar/Topbar";

const Environment = () => {
  return (
    <>
      <Topbar iconName={"Activity"} title="Environmental Indicators" subtitle="Climate change metrics, renewable energy adoption, and forest coverage analysis" />
      <h1>🌱 Environment</h1>
      <ul>
        <li>Carbon Emissions</li>
        <li>Renewable Energy</li>
        <li>Forest Area</li>
      </ul>
    </>
  )
}
export default Environment;
