'use client'

import { Check, Copy, ShareAndroid } from 'iconoir-react'
import { X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  FacebookIcon,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share'

import { Modal } from '@/components/ui/custom-modal'
import { cn } from '@/lib/utils'

export function ShareButton() {
  const path = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const shareUrl =
    typeof window !== 'undefined'
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
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>

          <div className="mb-8">
            <h2 className="font-bold text-2xl text-slate-900 tracking-tight dark:text-white">
              Compartilhar Perfil
            </h2>
            <p className="mt-1 font-medium text-slate-500 text-sm leading-relaxed">
              Espalhe a novidade! Escolha como deseja compartilhar este negócio.
            </p>
          </div>

          <div className="mb-10 flex justify-center gap-6">
            <FacebookShareButton
              url={shareUrl}
              className="transition-transform hover:scale-110 active:scale-95"
              onClick={handleShareClick}
            >
              <FacebookIcon size={64} round />
            </FacebookShareButton>

            <WhatsappShareButton
              url={shareUrl}
              className="transition-transform hover:scale-110 active:scale-95"
              onClick={handleShareClick}
            >
              <WhatsappIcon size={64} round />
            </WhatsappShareButton>

            <button
              type="button"
              onClick={() => {
                handleCopy()
                // No fechamento automático para dar feedback do "Copiado!"
              }}
              className={cn(
                'flex size-[64px] items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-110 active:scale-95',
                isCopied
                  ? 'bg-emerald-500 shadow-emerald-200'
                  : 'bg-slate-800 shadow-slate-200 dark:bg-slate-700'
              )}
            >
              {isCopied ? (
                <Check className="size-7" />
              ) : (
                <Copy className="size-7" />
              )}
            </button>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="link-direto"
              className="px-1 font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]"
            >
              Link Direto
            </label>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-800">
              <span className="flex-1 truncate font-bold text-slate-600 text-xs dark:text-slate-400">
                {shareUrl}
              </span>
              <button
                id="link-direto"
                type="button"
                onClick={handleCopy}
                className="whitespace-nowrap font-black text-[11px] text-blue-600 uppercase tracking-tighter hover:text-blue-700 dark:text-blue-400"
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
