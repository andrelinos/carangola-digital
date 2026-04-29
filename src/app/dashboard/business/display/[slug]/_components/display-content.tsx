'use client'

import { Check, Copy, Printer, Smartphone, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface DisplayContentProps {
  slug: string
  establishmentName: string
}

export function DisplayContent({
  slug,
  establishmentName,
}: DisplayContentProps) {
  const [copied, setCopied] = useState(false)
  const profileUrl = `https://carangoladigital.com.br/business/${slug}`

  const handlePrint = () => {
    window.print()
  }

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      toast.success('Link copiado!')
      setTimeout(() => setCopied(false), 2000)
    } catch (_err) {
      toast.error('Erro ao copiar link')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 font-sans text-slate-900 antialiased md:p-8 print:bg-white print:p-0">
      {/* Menu de Ações (Escondido na Impressão) */}
      <div className="fixed top-6 right-6 z-50 flex gap-3 print:hidden">
        <Button
          variant="outline"
          className="rounded-2xl border-slate-200 bg-white/80 shadow-sm backdrop-blur-md"
          onClick={handleCopyLink}
        >
          {copied ? (
            <Check className="mr-2 size-4 text-green-600" />
          ) : (
            <Copy className="mr-2 size-4" />
          )}
          {copied ? 'Copiado' : 'Copiar Link'}
        </Button>
        <Button
          className="rounded-2xl bg-primary shadow-lg shadow-primary/20 hover:bg-primary/90"
          onClick={handlePrint}
        >
          <Printer className="mr-2 size-4" />
          Imprimir
        </Button>
      </div>

      <div className="fade-in slide-in-from-bottom-8 flex w-full max-w-2xl animate-in flex-col items-center gap-10 duration-700">
        {/* Cabeçalho */}
        <header className="space-y-4 text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 font-black text-primary text-xs uppercase tracking-wider">
            <Smartphone className="size-3" />
            Loja Oficial
          </div>
          <h1 className="font-black text-5xl text-slate-950 uppercase leading-none tracking-tighter md:text-7xl">
            {establishmentName}
          </h1>
          <div className="mx-auto flex max-w-lg items-center justify-center gap-3 text-slate-600">
            <p className="font-semibold text-lg leading-tight opacity-70 md:text-xl">
              Escaneie o QR Code abaixo para ver nossas ofertas exclusivas ou
              chamar no WhatsApp!
            </p>
          </div>
        </header>

        {/* Card Central (O Foco) */}
        <main className="relative aspect-square w-full max-w-sm">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 opacity-30 blur-[100px]"></div>
          <div className="group relative flex flex-col items-center justify-center gap-8 rounded-[3.5rem] border border-slate-100 bg-white p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
            {/* QR Code Real com Logo */}
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl bg-white p-2 transition-transform duration-500 group-hover:scale-[1.02]">
              <QRCodeSVG
                value={profileUrl}
                size={512}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: '/logo-blue.svg',
                  x: undefined,
                  y: undefined,
                  height: 80,
                  width: 80,
                  excavate: true,
                }}
                className="h-full w-full"
              />
            </div>

            <div className="flex flex-col items-center gap-2">
              <p className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">
                Aponte sua câmera
              </p>
              <div className="h-1.5 w-12 rounded-full bg-primary"></div>
            </div>

            <Sparkles className="absolute -top-6 -right-6 size-16 animate-pulse text-yellow-400" />
          </div>
        </main>

        {/* Rodapé/Branding */}
        <footer className="space-y-6 pt-8 text-center">
          <div className="flex items-center justify-center gap-4 opacity-40">
            <div className="h-px w-12 bg-slate-400"></div>
            <span className="font-bold text-slate-500 text-xs uppercase tracking-widest">
              Carangola Digital
            </span>
            <div className="h-px w-12 bg-slate-400"></div>
          </div>

          <div className="print:hidden">
            <Link
              href="/dashboard"
              className="inline-flex items-center font-black text-primary text-xs uppercase tracking-tight hover:underline"
            >
              ← Voltar para o Dashboard
            </Link>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body {
            background: white !important;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
          }
          .min-h-screen {
            min-height: 100vh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .fixed { display: none !important; }
        }
      `}</style>
    </div>
  )
}
