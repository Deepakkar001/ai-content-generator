import React from 'react'
import { TEMPLATE } from './TemplateListSection'
import Image from 'next/image'
import Link from 'next/link'
function TemplateCard(item:TEMPLATE) {
  return (
    <Link href={'/dashboard/content/'+item?.slug}>
    <div className='group px-4 py-4 md:px-5 md:py-5 rounded-2xl border border-white/5 bg-slate-900/70 shadow-sm shadow-black/50 flex flex-col gap-3 cursor-pointer transition duration-300 hover:-translate-y-1.5 hover:border-emerald-300/50 hover:shadow-[0_18px_45px_rgba(16,185,129,0.35)]'>
        <div className="inline-flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl bg-slate-800/80 border border-white/10">
          <Image src={item.icon} alt='icon' width={28} height={28}/>
        </div>
        <h2 className='font-semibold text-sm md:text-base text-white tracking-tight'>{item.name}</h2>
        <p className='text-xs md:text-sm text-slate-300/80 line-clamp-3 leading-relaxed'>{item.desc}</p>
    </div>
    </Link>
  )
}

export default TemplateCard