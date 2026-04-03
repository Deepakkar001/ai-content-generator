"use client";

import React, { useState } from 'react'
import SideNav from './_components/SideNav';
import Header from './_components/Header';
import { UserSubscriptionContext } from '../(context)/UserSubscriptionContext';

function layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const [UserSubscription,setUserSubscription]=useState<boolean>(false);
  return (
    <UserSubscriptionContext.Provider value={{UserSubscription,setUserSubscription}}>
      <div className='flex h-screen w-full max-w-[100vw] overflow-hidden bg-slate-100'>
        {/* Sidebar: in-flow so main column gets correct width (no overlap / horizontal scroll) */}
        <aside className='hidden md:flex h-full w-64 shrink-0 flex-col z-20'>
          <SideNav/>
        </aside>
        {/* Main content */}
        <div className='flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden'>
          <Header/>
          <div className='min-w-0 flex-1'>
            {children}
          </div>
        </div>
      </div>
    </UserSubscriptionContext.Provider>
  )
}

export default layout