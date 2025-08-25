"use client"
import Link from 'next/link';
import { Home, BarChart, TrendingUp, Activity, Users, ChevronRight, Globe, ChevronLeft, ChevronLeftCircleFill, ChevronRightCircleFill, ChevronRightCircle, ChevronLeftCircle } from '@geist-ui/icons'
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const Navbar = () => {
  const pathname = usePathname();
  const isActiveLink = (href: string) => pathname === href;
  const [isOpen, setIsOpen] = useState(true);

  // Helper function to get link classes
  const getLinkClasses = (href: string) => {
    const baseClasses = "rounded-br-md rounded-md w-full flex flex-row border-l-6 mb-1 hover:text-blue-600 p-4";
    const activeClasses = "border-l-6 border-b-0 border-blue-500 bg-blue-50 text-blue-600";
    const iactiveClasses = "border-l-6 border-b-0 border-blue-50";

    return `${baseClasses} ${isActiveLink(href) ? activeClasses : iactiveClasses}`;
  };

  const size = isOpen ? "min-w-1/6" : "w-20"

  return (
    <aside className={`${size} justify-center items-center h-screen z-10 flex flex-col border-r-1 border-blue-200 rounded-b-2xl`}>
      <div className='flex flex-row w-full items-center justify-center max-h-20 min-h-20 p-4 border-b-2 border-blue-200'>
        {
          isOpen ?
            <>
              <BarChart className='mr-2 bg-blue-500 p-2 rounded' size={45} />
              <div className='flex flex-col'>
                <h1 className='inline-flex font-bold text-xl'>
                  World Bank
                </h1>
                <p className='italic text-zinc-400 text-sm'>Data Analytics</p>
              </div>
            </>
            : null
        }
        <button className={`${isOpen ? 'ml-auto' : ""} p-2 cursor-pointer`} title={isOpen ? "Close Menu" : "Open Menu"} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronLeftCircle /> : <ChevronRightCircle />}
        </button>
      </div>
      {
        isOpen ?
          (
            <section className='flex flex-col w-full'>
              <Link className={getLinkClasses("/")} href="/">
                <Home className='mr-2' />
                Overview
                {isActiveLink("/") ? <ChevronRight className='ml-auto' /> : null}
              </Link>
              <Link className={getLinkClasses("/development")} href="/development">
                <TrendingUp className='mr-2' />
                Development and Economy
                {isActiveLink("/development") ? <ChevronRight className='ml-auto' /> : null}
              </Link>
              <Link className={getLinkClasses("/environment")} href="/environment">
                <Activity className='mr-2' />
                Environment
                {isActiveLink("/environment") ? <ChevronRight className='ml-auto' /> : null}
              </Link>
              <Link className={getLinkClasses("/social")} href="/social">
                <Users className='mr-2' />
                Social Human Development
                {isActiveLink("/social") ? <ChevronRight className='ml-auto' /> : null}
              </Link>
            </section>
          ) :
          (
            <section className='flex flex-col p-2'>
              <Link title="Home" className={getLinkClasses("/")} href="/">
                <Home className='mr-2' />
              </Link>
              <Link title="Development" className={getLinkClasses("/development")} href="/development">
                <TrendingUp className='mr-2' />
              </Link>
              <Link title="Environment" className={getLinkClasses("/environment")} href="/environment">
                <Activity className='mr-2' />
              </Link>
              <Link title="Social" className={getLinkClasses("/social")} href="/social">
                <Users className='mr-2' />
              </Link>
            </section>
          )
      }
      <section className={`${isOpen ? "p-4 text-sm" : "px-1 py-2 text-xs"} flex flex-col items-center justify-center text-center border-t-2 border-t-blue-200 mt-auto italic text-zinc-400`}>
        <Globe className='mr-2' size={20} />
        <p>World Bank Open Data</p>
        <p>Analytics Dashboard v2.0</p>
      </section>
    </aside >
  )
}

export default Navbar;
