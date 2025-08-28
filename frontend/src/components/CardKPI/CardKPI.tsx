import useDevelopment from '@/app/development/hooks/useDevelopment.hooks';
import { getCountryName } from '@/app/development/types/types';
import * as Icons from '@geist-ui/icons';

type CardProps = {
  title: string,
  subtitle: string,
  value: string,
  growth?: string,
  iconName: keyof typeof Icons,
}

const CardKPI = ({ title, subtitle, value, iconName, growth }: CardProps) => {
  const IconComponent = Icons[iconName]
  const isGrowing = growth ? parseFloat(growth.replace("%", "")) > 0 : false

  return (
    <div className="flex flex-col grow max-w-65 justify-center p-4 bg-white shadow-md shadow-blue-200 h-30 rounded-2xl">
      <div className="flex flex-row justify-center w-full items-center border-b-1 border-gray-200">
        <IconComponent className="w-1/4" size={40} />
        <div className="flex flex-col m-2 w-3/4">
          {/* <h1 className="text-sm font-bold text-zinc-400">{getCountryName(country)}</h1> */}
          <h1 className="text-sm font-bold text-zinc-400">{title}</h1>
          {/* <p className="text-xs text-zinc-400">{title}</p> */}
          <p className="font-bold text-md mt-1">{value}</p>
        </div>
      </div>
      <div className='flex flex-row p-1 items-center'>
        <p className="text-zinc-400 text-xs mt-2">{subtitle}</p>
        {
          growth &&
          <p className={`${isGrowing ? "bg-green-200 text-green-600" : "bg-red-200 text-red-600"} ml-auto text-xs text-center p-1 px-2 rounded-xl items-center`}>
            {growth}
          </p>
        }
      </div>
    </div>
  )
}

export default CardKPI;
