'use client'

import { usePathname } from 'next/navigation'
import {
  FacebookIcon,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share'

import { Check, Copy, ShareAndroid } from 'iconoir-react'
import { useState } from 'react'

import { Modal } from '@/components/ui/custom-modal'
import { cn } from '@/lib/utils'

export function ShareButton() {
  const path = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${path}` 
    : `https://carangoladigital.com.br${path}`

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-50 p-4 font-bold text-slate-600 ring-1 ring-slate-200 transition-all hover:bg-slate-100 active:scale-95 dark:bg-slate-900/40 dark:text-slate-400 dark:ring-slate-700"
      >
        <ShareAndroid className="size-5" />
        <span>Compartilhar</span>
      </button>

      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Compartilhar Perfil"
        description="Espalhe a novidade! Escolha como deseja compartilhar este negócio."
        classname="max-w-md bg-card border-none shadow-2xl rounded-[2.5rem]"
      >
        <div className="flex flex-col gap-8 py-6">
          <div className="flex justify-center gap-6">
            <FacebookShareButton url={shareUrl} className="transition-transform hover:scale-110">
              <FacebookIcon size={56} round />
            </FacebookShareButton>
            <WhatsappShareButton url={shareUrl} className="transition-transform hover:scale-110">
              <WhatsappIcon size={56} round />
            </WhatsappShareButton>
            
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "flex size-[56px] items-center justify-center rounded-full text-white transition-all hover:scale-110",
                isCopied ? "bg-emerald-500" : "bg-slate-800 dark:bg-slate-700"
              )}
            >
              {isCopied ? <Check className="size-6" /> : <Copy className="size-6" />}
            </button>
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3 pr-4 ring-1 ring-slate-200 dark:bg-slate-900/50 dark:ring-slate-800">
               <span className="flex-1 truncate text-xs text-muted-foreground font-medium">
                {shareUrl}
              </span>
              <button 
                onClick={handleCopy}
                className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline"
              >
                {isCopied ? 'Copiado!' : 'Copiar Link'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
