import { RefreshCcw, Download } from '@geist-ui/icons'
import * as Icons from '@geist-ui/icons';

type TopbarProps = {
  title: string;
  subtitle: string;
  iconName: keyof typeof Icons;
  onPrint: () => void;
  onRefresh: () => void;
}

const Topbar = ({ title, subtitle, iconName, onPrint, onRefresh }: TopbarProps) => {
  const IconComponent = Icons[iconName]

  return (
    <header className='bg-white max-h-20 min-h-20 p-4 border-b-2 border-blue-200 flex flex-row rounded-br-xl'>
      <div className="">
        <h1 className="text-2xl inline-flex font-bold">
          <IconComponent className="mr-2" />
          {title}
        </h1>
        <p className='italic text-zinc-400'>{subtitle}</p>
      </div>
      <div className='flex flex-row ml-auto items-center [&>*]:hover:cursor-pointer [&>*]:mr-1'>
        <button onClick={onRefresh} className="hover:bg-blue-50 text-zinc-400 min-h-10 rounded-xl py-2 px-4 flex flex-row items-center">
          <RefreshCcw size={16} className='mr-2' />
          <p className='text-zinc-400'>Refresh</p>
        </button>
        <button onClick={onPrint} className="text-white min-h-10 font-bold text-md bg-blue-500 rounded-xl px-4 flex flex-row items-center hover:brightness-120">
          <Download size={20} className='mr-2' />
          Export
        </button>
      </div>
    </header>
  )
}

export default Topbar;
