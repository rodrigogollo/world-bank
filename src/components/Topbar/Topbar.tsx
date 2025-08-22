import { RefreshCcw, Download } from '@geist-ui/icons'
import * as Icons from '@geist-ui/icons';

type TopbarProps = {
  title: string;
  subtitle: string;
  iconName: keyof typeof Icons;
}

const Topbar = ({ title, subtitle, iconName }: TopbarProps) => {
  const IconComponent = Icons[iconName]

  return (
    <header className='bg-white max-h-20 min-h-20 p-4 border-b-2 border-blue-200 flex flex-row rounded-br-xl'>
      <div className="">
        <h1 className="text-2xl inline-flex font-bold">
          <IconComponent className="mr-2" />
          {title}
        </h1>
        <p className='italic text-gray-500'>{subtitle}</p>
      </div>
      <div className='flex flex-row ml-auto items-center font-semibold'>
        <button className="text-gray-500 min-h-10 rounded-2xl py-2 px-4 flex flex-row items-center">
          <RefreshCcw size={16} className='mr-2' />
          <p className=''>Refresh</p>
        </button>
        <button className="text-white min-h-10 font-bold text-md bg-blue-500 rounded-xl px-4 flex flex-row items-center">
          <Download size={20} className='mr-2' />
          Export
        </button>
      </div>
    </header>
  )
}

export default Topbar;
