import React, { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import '@toast-ui/editor/dist/toastui-editor.css'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { fromString } from '@iarna/rtf-to-html'
import type { Editor as EditorType } from '@toast-ui/react-editor'

// Dynamically import the Editor component
const Editor = dynamic(() => import('@toast-ui/react-editor').then(mod => mod.Editor), { ssr: false })

interface props {
  aiOutput: string  
} 

function OutputSection({ aiOutput }: props) {
  const editorRef = useRef<EditorType>(null);

  useEffect(() => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      
      
      fromString(aiOutput, (err, aiOutput1) => {
        if (err) {
          console.error('Failed to parse RTF:', err);
          return;
        }
         editorInstance.setMarkdown(aiOutput);
        //editorInstance.setHTML(aiOutput1);
      });
    }
  }, [aiOutput]);

  return (
    <div className='rounded-2xl border border-white/10 bg-slate-950/80 shadow-xl shadow-black/40 backdrop-blur-2xl overflow-hidden'>
      <div className='flex justify-between items-center px-4 py-3 border-b border-white/10'>
        <h2 className='font-semibold text-sm md:text-base text-white'>Your Result</h2>
        <Button 
          className='flex gap-2 cursor-pointer rounded-full bg-slate-800 hover:bg-slate-700 text-white border border-white/10 px-3 py-1.5 h-auto text-xs md:text-sm' 
          onClick={() => navigator.clipboard.writeText(aiOutput)}
        >
          <Copy className='w-4 h-4' />
          Copy
        </Button>
      </div>
      <Editor
        ref={editorRef}
        initialValue="Your Result will be displayed here"
        initialEditType="wysiwyg"
        previewStyle="vertical"
        height="540px"
        useCommandShortcut={true}
        onChange={() => console.log(editorRef.current?.getInstance().getMarkdown())}
      />
    </div>
  )
}

export default OutputSection

