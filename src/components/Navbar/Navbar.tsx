"use client"
import Link from 'next/link';
import { Home, BarChart, TrendingUp, Activity, Users } from '@geist-ui/icons'
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const isActiveLink = (href: string) => pathname === href;

  // Helper function to get link classes
  const getLinkClasses = (href: string) => {
    const baseClasses = "w-full flex flex-row border-b-1 border-blue-200 hover:text-blue-600 hover:border-blue-500 p-4";
    const activeClasses = "border-l-6 border-l-blue-500 bg-blue-50 text-blue-600";

    return `${baseClasses} ${isActiveLink(href) ? activeClasses : ""}`;
  };

  return (
    <aside className='h-screen w-1/6 fixed z-10 left-0 top-0 flex flex-col border-r-1 border-blue-200 rounded-b-2xl'>
      <div className='flex flex-row w-full items-center max-h-20 min-h-20 p-4 border-b-2 border-blue-200'>
        <BarChart className='mr-2 bg-blue-500 p-2 rounded' size={45} />
        <div className='flex flex-col'>
          <h1 className='inline-flex font-bold text-xl'>
            World Bank
          </h1>
          <p className='italic text-gray-500 text-sm'>Data Analytics</p>
        </div>
      </div>
      <section className='flex flex-col'>
        <Link className={getLinkClasses("/")} href="/">
          <Home className='mr-2' />
          Overview
        </Link>
        <Link className={getLinkClasses("/development")} href="/development">
          <TrendingUp className='mr-2' />
          Development and Economy
        </Link>
        <Link className={getLinkClasses("/environment")} href="/environment">
          <Activity className='mr-2' />
          Environment</Link>
        <Link className={getLinkClasses("/social")} href="/social">
          <Users className='mr-2' />
          Social Human Development</Link>
      </section>
    </aside>
  )
}

export default Navbar;
