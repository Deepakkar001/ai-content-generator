"use client"
import React from 'react'
import Image from 'next/image'
import { FileClock, Home, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
// import UsageTrack from './UsageTrack'

function SideNav() {
  const MenuList = [
    {
      name: 'Home',
      icon: Home,
      path: '/dashboard'
    },
    {
      name: 'History',
      icon: FileClock,
      path: '/dashboard/history'
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/dashboard/settings'
    },
  ]

  const path = usePathname();

  return (
    <div className='h-full w-full p-5 border-r border-white/10 bg-slate-950/95 backdrop-blur-xl flex flex-col'>
      <div 
        className='flex justify-center items-center mb-6 cursor-pointer' 
        onClick={() => window.location.href = '/'}
      >
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={120} height={100} style={{ width: 'auto', height: 'auto' }} />
        </div>
      </div>
      <hr className='my-4 border-white/10' />
      <div className='flex-1 mt-4 space-y-1'>
        {MenuList.map((menu, index) => (
          <Link href={menu.path} key={index}>
            <div
              className={`flex gap-2 p-3 rounded-xl cursor-pointer items-center transition-all duration-200
              text-white/70 hover:text-white
              border border-transparent hover:border-white/10 hover:bg-white/5
              ${path === menu.path && 'bg-slate-900 text-white border-emerald-400/60 shadow-[0_0_0_1px_rgba(45,212,191,0.45)]'}`}
            >
              <menu.icon className={`h-5 w-5 ${path === menu.path ? 'text-emerald-200' : 'text-white/60 group-hover:text-white'}`} />
              <h2 className='text-sm font-medium tracking-wide'>{menu.name}</h2>
            </div>
          </Link>
        ))}
      </div>
      <div className='mb-4'>
        {/* <UsageTrack/> */}
      </div>
    </div>
  )
}

export default SideNav