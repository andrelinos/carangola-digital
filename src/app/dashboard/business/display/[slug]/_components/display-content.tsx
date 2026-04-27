'use client'

import { QrCode, Smartphone, Sparkles, Printer, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { QRCodeSVG } from 'qrcode.react'

interface DisplayContentProps {
  slug: string
  establishmentName: string
}

export function DisplayContent({ slug, establishmentName }: DisplayContentProps) {
  const [copied, setCopied] = useState(false)
  const profileUrl = `https://carangoladigital.com.br/business/${slug}`

  const handlePrint = () => {
    window.print()
  }

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      toast.success("Link copiado!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Erro ao copiar link")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8 font-sans antialiased text-slate-900 print:bg-white print:p-0">

      {/* Menu de Ações (Escondido na Impressão) */}
      <div className="fixed top-6 right-6 flex gap-3 z-50 print:hidden">
        <Button variant="outline" className="rounded-2xl bg-white/80 backdrop-blur-md shadow-sm border-slate-200" onClick={handleCopyLink}>
          {copied ? <Check className="size-4 mr-2 text-green-600" /> : <Copy className="size-4 mr-2" />}
          {copied ? "Copiado" : "Copiar Link"}
        </Button>
        <Button className="rounded-2xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90" onClick={handlePrint}>
          <Printer className="size-4 mr-2" />
          Imprimir
        </Button>
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Cabeçalho */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider mb-2">
            <Smartphone className="size-3" />
            Loja Oficial
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 uppercase leading-none">
            {establishmentName}
          </h1>
          <div className="flex items-center justify-center gap-3 text-slate-600 max-w-lg mx-auto">
            <p className="text-lg md:text-xl font-semibold leading-tight opacity-70">
              Escaneie o QR Code abaixo para ver nossas ofertas exclusivas ou chamar no WhatsApp!
            </p>
          </div>
        </header>

        {/* Card Central (O Foco) */}
        <main className="relative w-full aspect-square max-w-sm">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-30 animate-pulse"></div>
          <div className="relative bg-white rounded-[3.5rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col items-center justify-center gap-8 group">

            {/* QR Code Real com Logo */}
            <div className="w-full aspect-square bg-white rounded-3xl flex items-center justify-center p-2 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
              <QRCodeSVG
                value={profileUrl}
                size={512}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "/logo-blue.svg",
                  x: undefined,
                  y: undefined,
                  height: 80,
                  width: 80,
                  excavate: true,
                }}
                className="w-full h-full"
              />
            </div>

            <div className="flex flex-col items-center gap-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aponte sua câmera</p>
              <div className="h-1.5 w-12 bg-primary rounded-full"></div>
            </div>

            <Sparkles className="absolute -top-6 -right-6 size-16 text-yellow-400 animate-pulse" />
          </div>
        </main>

        {/* Rodapé/Branding */}
        <footer className="text-center space-y-6 pt-8">
          <div className="flex items-center justify-center gap-4 opacity-40">
            <div className="h-px w-12 bg-slate-400"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Carangola Digital
            </span>
            <div className="h-px w-12 bg-slate-400"></div>
          </div>

          <div className="print:hidden">
            <Link href="/dashboard" className="inline-flex items-center text-xs text-primary font-black hover:underline uppercase tracking-tight">
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
