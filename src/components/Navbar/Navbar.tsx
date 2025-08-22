import Link from 'next/link';
import { Home, BarChart, TrendingUp, Activity, Users } from '@geist-ui/icons'

const Navbar = () => {
  return (
    <aside className='h-screen w-1/6 fixed z-10 left-0 top-0 flex flex-col border-r-1 border-blue-200 rounded-b-2xl'>
      <div className='flex flex-row w-full items-center max-h-20 min-h-20 p-4 border-b-2 border-blue-200'>
        <BarChart className='mr-2' size={35} />
        <div className='flex flex-col'>
          <h1 className='inline-flex font-bold'>
            World Bank
          </h1>
          <p className='italic text-gray-500'>Data Analytics</p>
        </div>
      </div>
      <section className='flex flex-col'>
        <Link className="w-full flex flex-row border-b-1 border-blue-200 hover:text-blue-600 hover:border-blue-500 p-4" href="/">
          <Home className='mr-2' />
          Overview
        </Link>
        <Link className="w-full flex flex-row border-b-1 border-blue-200 hover:text-blue-600 hover:border-blue-500 p-4" href="/development">
          <TrendingUp className='mr-2' />
          Development and Economy
        </Link>
        <Link className="w-full flex flex-row border-b-1 border-blue-200 hover:text-blue-600 hover:border-blue-500 p-4" href="/environment">
          <Activity className='mr-2' />
          Environment</Link>
        <Link className="w-full flex flex-row border-b-1 border-blue-200 hover:text-blue-600 hover:border-blue-500 p-4" href="/social">
          <Users className='mr-2' />
          Social Human Development</Link>
      </section>
    </aside>
  )
}

export default Navbar;
