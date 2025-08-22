import { RefreshCw } from '@geist-ui/icons'
import * as Icons from '@geist-ui/icons';

type TopbarProps = {
  title: string;
  subtitle: string;
  iconName: keyof typeof Icons;
}

const Topbar = ({ title, subtitle, iconName }: TopbarProps) => {
  const IconComponent = Icons[iconName]

  return (
    <header className='bg-white max-h-24 p-4 border-b-2 border-zinc-200 flex flex-row'>
      <div className="">
        <h1 className="inline-flex font-bold">
          <IconComponent className="mr-2" />
          {title}
        </h1>
        <p className='italic text-gray-500'>{subtitle}</p>
      </div>
      <button className="ml-auto border-1 border-zinc-300 rounded-2xl py-2 px-4 flex flex-row items-center">
        <span className='text-md'>Refresh</span>
        <RefreshCw size={16} className='ml-2' />
      </button>
    </header>
  )
}

export default Topbar;
