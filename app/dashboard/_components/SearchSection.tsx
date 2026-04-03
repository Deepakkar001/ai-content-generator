import React from 'react'
import { Search } from 'lucide-react'
function SearchSection({onSearchInput}:any) {
  return (
    <div className='min-w-0 px-4 py-10 sm:px-6 md:px-8 md:py-12 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center text-white border-b border-white/10'>
        <div className="w-full max-w-4xl text-center space-y-2">
          <h2 className='text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight'>Browse All Templates</h2>
          <p className='mx-auto max-w-xl text-xs md:text-sm text-white/65'>Find the right building block for your next piece and stay in your flow.</p>
        </div>

        <div className='w-full flex justify-center mt-6 md:mt-8'>
            <div className='flex gap-3 items-center px-4 py-3 md:px-5 md:py-3.5 rounded-full w-full max-w-2xl bg-slate-900/80 border border-emerald-400/20 backdrop-blur-2xl shadow-[0_18px_45px_rgba(15,23,42,0.85)]'>
                <Search className='text-emerald-300 h-4 w-4 md:h-5 md:w-5'/>
                <input
                  type="text"
                  placeholder='Search templates by name'
                  onChange={(event)=>onSearchInput(event.target.value)}
                  className='flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none'
                />
            </div>
        </div>
    </div>
  )
}

export default SearchSection