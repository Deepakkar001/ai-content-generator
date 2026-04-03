"use client"
import { UserProfile } from '@clerk/nextjs'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

function Settings() {
  return (
    <div className='min-h-screen w-full px-4 py-6 md:px-8 md:py-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-start justify-center'>
        <UserProfile 
          routing="path" 
          path="/dashboard/settings"
          appearance={{
            elements: {
              rootBox: "w-full max-w-5xl mx-auto",
              card: "border border-white/10 bg-slate-950/80 shadow-2xl shadow-black/40 rounded-3xl backdrop-blur-2xl",
              headerTitle: "text-xl md:text-2xl font-semibold text-white",
              headerSubtitle: "text-xs md:text-sm text-slate-300",
              navbar: "bg-gradient-to-b from-slate-950/70 to-slate-900/70 border-r border-white/10 rounded-l-3xl px-5",
              navbarItem: "text-sm text-slate-300 hover:text-white data-[active=true]:text-emerald-300 data-[active=true]:bg-slate-900/80 data-[active=true]:border data-[active=true]:border-emerald-400/60 rounded-xl px-3 py-2",
              navbarItemIcon: "h-4 w-4",
              formButtonPrimary: "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium rounded-full px-4 py-2 shadow-md shadow-emerald-500/40",
              formFieldLabel: "text-xs font-medium text-slate-300",
              formFieldInput: "bg-slate-900/60 border border-white/10 text-sm text-white rounded-xl focus:border-emerald-400 focus:ring-0",
              scrollBox: "bg-slate-950/40 rounded-3xl",
              profileSectionPrimaryButton: "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium rounded-full",
              profileSectionSecondaryButton: "bg-transparent border border-white/15 text-slate-200 hover:bg-white/5 rounded-full",
              dividerLine: "bg-white/10",
            }
          }}
        />
    </div>
  )
}

export default Settings 