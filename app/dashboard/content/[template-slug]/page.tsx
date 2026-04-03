"use client"
import React, { useState, useEffect } from 'react'
import FormSection from './_components/FormSection'
import OutputSection from './_components/OutputSection'
import Templates from '@/app/(data)/Templates'
import { TEMPLATE } from '../../_components/TemplateListSection'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { generateContent, isGeminiConfigured } from '@/utils/geminiClient'
import { use } from 'react'
import { db } from '@/utils/db'
import { AIOutput } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'

interface PROPS {
  params: Promise<{
    'template-slug': string
  }>
}

function CreateNewContent(props: PROPS) {
  const params = use(props.params)
  const selectedTemplate: TEMPLATE | undefined = Templates?.find((item) => item.slug == params['template-slug'])
   
  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [geminiConfigured, setGeminiConfigured] = useState<boolean | null>(null);
  const promptCacheRef = React.useRef<{ key: string; value: string; ts: number } | null>(null);
  const CACHE_TTL_MS = 5 * 60 * 1000;

  useEffect(() => {
    if (cooldownUntil <= Date.now()) {
      setCooldownSeconds(0);
      return;
    }
    const update = () => {
      const left = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
      setCooldownSeconds(left);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [cooldownUntil]);

  useEffect(() => {
    isGeminiConfigured().then(setGeminiConfigured);
  }, []);

  const {user}=useUser();


  const SaveInDb = async (formData: any, slug: string, aiOutput: string) => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      throw new Error('User email is required');
    }
    const result = await db.insert(AIOutput).values({
      formData: JSON.stringify(formData),
      templateSlug: slug,
      aiResponse: aiOutput,
      createdBy: user.primaryEmailAddress.emailAddress,
      createdAt: moment().format('DD/MM/yyyy')
    });
    console.log(result);
  }

  // Parse "retry in X.XXs" from Gemini 429 errors for backoff
  const parseRetryAfterSeconds = (message: string): number | null => {
    const match = message.match(/retry in (\d+(?:\.\d+)?)\s*s/i);
    return match ? Math.min(60, Math.ceil(parseFloat(match[1]))) : null;
  };

  const callGeminiWithRetry = async (prompt: string, maxRetries = 3): Promise<string> => {
    const cache = promptCacheRef.current;
    if (cache && cache.key === prompt && Date.now() - cache.ts < CACHE_TTL_MS) {
      return cache.value;
    }
    let lastErr: unknown;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const text = await generateContent(prompt);
        promptCacheRef.current = { key: prompt, value: text, ts: Date.now() };
        return text;
      } catch (err: any) {
        lastErr = err;
        const is429 = err?.isRateLimit || err?.message?.includes('429') || err?.message?.includes('quota');
        if (!is429 || attempt === maxRetries) throw err;
        const waitSec = err?.retryAfterSeconds ?? parseRetryAfterSeconds(err?.message ?? '') ?? 45;
        const backoffSec = Math.min(90, waitSec);
        setError(`Free tier limit reached. Auto-retrying in ${backoffSec}s…`);
        await new Promise((r) => setTimeout(r, backoffSec * 1000));
      }
    }
    throw lastErr;
  };

  const GenerateAIContent = async (formData: any) => {
    if (Date.now() < cooldownUntil) return;
    if (loading) return; // guard: only one request at a time
    setLoading(true);
    setError(null);
    try {
      if (!selectedTemplate) {
        throw new Error('Selected template is undefined.');
      }
      const FinalAIPrompt = JSON.stringify(formData) + ',' + selectedTemplate.aiPrompt;
      const outputText = await callGeminiWithRetry(FinalAIPrompt);
      setError(null); // clear any "Retrying in Xs…" message
      setAiOutput(outputText);
      await SaveInDb(formData, selectedTemplate.slug, outputText);
      setCooldownUntil(Date.now() + 15_000); // throttle: 15s cooldown after success
    } catch (err: any) {
      const msg = err?.message ?? '';
      const isQuotaError = err?.isRateLimit || msg.includes('429') || msg.includes('quota') || msg.includes('Quota exceeded');
      if (!isQuotaError) console.error('Error generating AI content:', err);
      else console.warn('Gemini API: rate limit / quota exceeded.');
      if (msg.includes('OPENAI_API_KEY') || msg.includes('GEMINI_API_KEY') || msg.includes('not set on server')) {
        setError('Add OPENAI_API_KEY (OpenAI) or GEMINI_API_KEY (Google) to .env.local and restart the dev server. Keys: platform.openai.com or aistudio.google.com');
      } else if (msg.includes('NEXT_PUBLIC_DRIZZLE_DB_URL')) {
        setError('Database URL is missing. Add NEXT_PUBLIC_DRIZZLE_DB_URL to .env.local and restart the dev server.');
      } else if (isQuotaError) {
        setError('Free tier limit reached. Please wait 1–2 minutes (or try again tomorrow) and click Generate again. See https://ai.google.dev/gemini-api/docs/rate-limits');
      } else if (msg.includes('No model available') || msg.includes('503')) {
        setError('No Gemini model worked for your API key. Check quota at https://aistudio.google.com and try again later.');
      } else {
        setError(msg || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-6 md:px-8 md:py-10'>
      <div className='max-w-6xl mx-auto'>
        <Link  href={"/dashboard"}>
          <Button className='cursor-pointer inline-flex items-center gap-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white border border-white/10 shadow-sm shadow-black/40 px-4 py-2'>
            <ArrowLeft className='h-4 w-4' /> 
            <span className='text-xs md:text-sm'>Back to templates</span>
          </Button>
        </Link>
      {geminiConfigured === false && (
        <div className='mt-4 mb-4 p-4 rounded-xl bg-amber-500/10 text-amber-100 border border-amber-500/40 text-xs md:text-sm'>
          Add <code className='font-mono bg-black/5 px-1 rounded'>OPENAI_API_KEY</code> (ChatGPT) or <code className='font-mono bg-black/5 px-1 rounded'>GEMINI_API_KEY</code> to <code className='font-mono bg-black/5 px-1 rounded'>.env.local</code> and restart. Get keys at{' '}
          <a href='https://platform.openai.com/api-keys' target='_blank' rel='noopener noreferrer' className='underline'>OpenAI</a>
          {' or '}
          <a href='https://aistudio.google.com/apikey' target='_blank' rel='noopener noreferrer' className='underline'>Google AI Studio</a>.
        </div>
      )}
      {error && (
        <div className='mb-4 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-xs md:text-sm'>
          {error}
        </div>
      )}
      <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6'>
        <FormSection
          selectedTemplate={selectedTemplate}
          UserFormInput={(v: any) => GenerateAIContent(v)}
          loading={loading}
          cooldownRemaining={cooldownSeconds}
        />
        <div className='col-span-1 md:col-span-2'>
          <OutputSection aiOutput={aiOutput} />
        </div>
      </div>
      </div>
    </div>
  )
}

export default CreateNewContent
