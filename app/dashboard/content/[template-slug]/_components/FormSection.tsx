"use client";
import { TEMPLATE } from '@/app/dashboard/_components/TemplateListSection';
import { Input } from "@/components/ui/input"
import React from 'react'
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { on } from 'events';
import { useState } from 'react';
import { Loader2Icon } from 'lucide-react';
interface PROPS{
    selectedTemplate?:TEMPLATE;
    UserFormInput:any;
    loading:boolean;
    cooldownRemaining?:number;
}

function FormSection({ selectedTemplate, UserFormInput, loading, cooldownRemaining = 0 }: PROPS) {
    const [formData, setFormData] = useState<any>();

    const onSubmit = async (e: any) => {
        e.preventDefault();
        try {
          await UserFormInput(formData);
        } catch {
          // Error already shown via setError in parent
        }
    }
    const handleInputChange=(e:any)=>{
        const {name,value}=e.target;
        setFormData({...formData,[name]:value});
    }
  return (
    <div className='p-5 md:p-6 rounded-2xl border border-white/10 bg-slate-950/80 shadow-xl shadow-black/40 backdrop-blur-2xl flex flex-col gap-4'>
        <div className='flex items-center gap-3'>
          <div className='inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/80 border border-white/15'>
            <Image src={selectedTemplate?.icon || '/placeholder.png'} width={32} height={32} alt='icon' />
          </div>
          <div>
            <h2 className='font-semibold text-lg md:text-xl text-white tracking-tight'>{selectedTemplate?.name}</h2>
            <p className='text-xs md:text-sm text-slate-300/80 line-clamp-2'>{selectedTemplate?.desc}</p>
          </div>
        </div>

        <form className='mt-4 space-y-5' onSubmit={onSubmit}>

            {selectedTemplate?.form?.map((item,index)=>(
                <div key={index} className='flex flex-col gap-2'>
                    <label htmlFor={item.field} className='block text-xs md:text-sm font-medium text-slate-200'>{item.label}</label>
                    {item.field=='input'? 
                    <Input name={item.name} required={item?.required}
                    onChange={handleInputChange}
                    className='bg-slate-900/70 border border-white/10 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-0 rounded-xl'
                    />
                    : item.field == 'textarea'?
                    <Textarea name={item.name} required={item?.required}
                    onChange={handleInputChange}
                    className='min-h-[140px] bg-slate-900/70 border border-white/10 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-0 rounded-xl resize-none'
                    /> : null
                }
                      
                </div>
            ))}
            <button
            type="submit"
            className='mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-300 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(16,185,129,0.45)] transition-all hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed'
            disabled={loading || cooldownRemaining > 0}
            >
                {loading && <Loader2Icon className='h-4 w-4 animate-spin' />}
                {cooldownRemaining > 0 ? `Please wait ${cooldownRemaining}s…` : 'Generate Content'}
            </button>
        </form>
    </div>
  )
}

export default FormSection