'use client'

import { usePathname } from 'next/navigation'
import {
  FacebookIcon,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share'

import { Check, Copy, ShareAndroid } from 'iconoir-react'
import { X } from 'lucide-react'
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

  const handleShareClick = () => {
    // Pequeno delay para garantir que o compartilhamento inicie antes do modal fechar
    setTimeout(() => setIsOpen(false), 100)
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
        classname="max-w-md bg-white dark:bg-slate-900 border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden"
      >
        <div className="relative p-8">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Compartilhar Perfil</h2>
            <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">
              Espalhe a novidade! Escolha como deseja compartilhar este negócio.
            </p>
          </div>

          <div className="flex justify-center gap-6 mb-10">
            <div onClick={handleShareClick}>
              <FacebookShareButton url={shareUrl} className="transition-transform hover:scale-110 active:scale-95">
                <FacebookIcon size={64} round />
              </FacebookShareButton>
            </div>
            
            <div onClick={handleShareClick}>
              <WhatsappShareButton url={shareUrl} className="transition-transform hover:scale-110 active:scale-95">
                <WhatsappIcon size={64} round />
              </WhatsappShareButton>
            </div>
            
            <button
              type="button"
              onClick={() => {
                handleCopy()
                // No fechamento automático para dar feedback do "Copiado!"
              }}
              className={cn(
                "flex size-[64px] items-center justify-center rounded-full text-white transition-all hover:scale-110 active:scale-95 shadow-lg",
                isCopied ? "bg-emerald-500 shadow-emerald-200" : "bg-slate-800 dark:bg-slate-700 shadow-slate-200"
              )}
            >
              {isCopied ? <Check className="size-7" /> : <Copy className="size-7" />}
            </button>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
              Link Direto
            </label>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-800">
               <span className="flex-1 truncate text-xs text-slate-600 dark:text-slate-400 font-bold">
                {shareUrl}
              </span>
              <button 
                onClick={handleCopy}
                className="text-[11px] font-black uppercase tracking-tighter text-blue-600 hover:text-blue-700 dark:text-blue-400 whitespace-nowrap"
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

