'use client'

import { Instagram } from 'iconoir-react'
import { ArrowLeft, Download, Share2, Sparkles, Star } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface StickerContentProps {
  slug: string
  establishmentName: string
  logoUrl: string | null
}

export function StickerContent({
  slug,
  establishmentName,
  logoUrl,
}: StickerContentProps) {
  const stickerRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const profileUrl = `https://carangoladigital.com.br/business/${slug}`

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const htmlToImage = await import('html-to-image')
      const dataUrl = await htmlToImage.toPng(stickerRef.current!, {
        pixelRatio: 3,
        style: { transform: 'none' },
      })
      const link = document.createElement('a')
      link.download = `sticker-${slug}.png`
      link.href = dataUrl
      link.click()
      toast.success('Sticker baixado com sucesso!')
    } catch (e) {
      console.error('Erro ao gerar sticker:', e)
      toast.error('Erro ao gerar o sticker. Tente novamente.')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${establishmentName} está no Carangola Digital!`,
          text: `Conheça ${establishmentName} no Carangola Digital!`,
          url: profileUrl,
        })
      } catch {
        /* user cancelled */
      }
    } else {
      navigator.clipboard.writeText(profileUrl)
      toast.success('Link copiado para área de transferência!')
    }
  }

  const initials = establishmentName
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 size-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-20 size-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 py-10">
        {/* Back */}
        <div className="mb-10 w-full max-w-2xl">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 font-semibold text-slate-400 text-sm transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Voltar ao Dashboard
          </Link>
        </div>

        {/* Page header */}
        <div className="mb-12 w-full max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 font-black text-[11px] text-pink-400 uppercase tracking-widest backdrop-blur-sm">
            <Instagram className="size-3.5" />
            Sticker de Stories
          </div>
          <h1 className="font-black text-3xl text-white tracking-tight md:text-4xl">
            Sua arte para o{' '}
            <span className="bg-linear-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
              Instagram
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-md font-medium text-slate-400 text-sm">
            Baixe e compartilhe nos seus Stories para atrair mais clientes ao seu negócio.
          </p>
        </div>

        <div className="flex w-full max-w-2xl flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-center">
          {/* ── STICKER CANVAS (exported) ─────────────── */}
          <div className="shrink-0">
            {/* Outer glow ring */}
            <div className="relative rounded-[3rem] p-[2px]"
              style={{ background: 'linear-gradient(135deg,#ec4899,#8b5cf6,#3b82f6)' }}
            >
              <div
                ref={stickerRef}
                style={{
                  width: 320,
                  height: 568, /* 9:16 */
                  background: 'linear-gradient(160deg,#1e1b4b 0%,#1e3a8a 40%,#4c1d95 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px 28px',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '46px', // calc(3rem - 2px)
                }}
              >
                {/* Decorative circles */}
                <div style={{
                  position: 'absolute', top: '-60px', right: '-60px',
                  width: '200px', height: '200px', borderRadius: '50%',
                  background: 'rgba(139,92,246,0.25)', filter: 'blur(40px)',
                }} />
                <div style={{
                  position: 'absolute', bottom: '-40px', left: '-40px',
                  width: '180px', height: '180px', borderRadius: '50%',
                  background: 'rgba(59,130,246,0.2)', filter: 'blur(50px)',
                }} />

                {/* Stars decoration */}
                {[
                  { top: '14%', left: '12%', size: 10, opacity: 0.6 },
                  { top: '8%', right: '18%', size: 7, opacity: 0.4 },
                  { top: '22%', right: '10%', size: 5, opacity: 0.5 },
                ].map((s, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    top: s.top,
                    left: 'left' in s ? s.left : undefined,
                    right: 'right' in s ? s.right : undefined,
                    opacity: s.opacity,
                  }}>
                    <Star style={{ width: s.size, height: s.size, color: '#fde68a', fill: '#fde68a' }} />
                  </div>
                ))}

                {/* Top badge */}
                <div style={{
                  position: 'absolute', top: '28px',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '999px',
                  padding: '6px 16px',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}>
                  <Sparkles style={{ width: 11, height: 11, color: '#fde68a' }} />
                  <span style={{
                    fontFamily: 'system-ui,sans-serif',
                    fontWeight: 900, fontSize: '10px',
                    color: '#fde68a', letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}>
                    Carangola Digital
                  </span>
                </div>

                {/* Logo */}
                <div style={{
                  width: 96, height: 96, borderRadius: '24px',
                  background: 'white',
                  padding: '5px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
                  marginBottom: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', flexShrink: 0,
                }}>
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoUrl}
                      alt={establishmentName}
                      crossOrigin="anonymous"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '19px' }}
                    />
                  ) : (
                    <span style={{
                      fontFamily: 'system-ui,sans-serif', fontWeight: 900,
                      fontSize: '34px',
                      background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      {initials}
                    </span>
                  )}
                </div>

                {/* Business name — the hero */}
                <h2 style={{
                  fontFamily: 'system-ui,sans-serif', fontWeight: 900,
                  fontSize: establishmentName.length > 18 ? '22px' : establishmentName.length > 12 ? '26px' : '30px',
                  color: 'white', textAlign: 'center',
                  lineHeight: 1.05, marginBottom: '10px',
                  letterSpacing: '-0.03em',
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                }}>
                  {establishmentName}
                </h2>

                {/* "agora está no" connector */}
                <p style={{
                  fontFamily: 'system-ui,sans-serif', fontWeight: 600,
                  fontSize: '13px', color: 'rgba(255,255,255,0.55)',
                  marginBottom: '4px', textAlign: 'center', letterSpacing: '0.01em',
                }}>
                  agora está no
                </p>

                {/* Platform name — the proof */}
                <p style={{
                  fontFamily: 'system-ui,sans-serif', fontWeight: 900,
                  fontSize: '18px',
                  color: '#93c5fd',
                  marginBottom: '6px', textAlign: 'center',
                  letterSpacing: '-0.01em',
                }}>
                  Carangola Digital
                </p>

                {/* Value prop — why click */}
                <p style={{
                  fontFamily: 'system-ui,sans-serif', fontWeight: 500,
                  fontSize: '11px', color: 'rgba(255,255,255,0.4)',
                  textAlign: 'center', marginBottom: '24px',
                  lineHeight: 1.4, maxWidth: '200px',
                }}>
                  Promoções, WhatsApp e muito mais!
                </p>

                {/* CTA button */}
                <div style={{
                  background: 'linear-gradient(135deg,#ec4899,#8b5cf6)',
                  borderRadius: '999px',
                  padding: '13px 30px',
                  boxShadow: '0 8px 32px rgba(139,92,246,0.5)',
                  marginBottom: '20px',
                }}>
                  <span style={{
                    fontFamily: 'system-ui,sans-serif', fontWeight: 900,
                    fontSize: '13px', color: 'white', letterSpacing: '0.01em',
                  }}>
                    Ver perfil completo →
                  </span>
                </div>

                {/* Divider + URL */}
                <div style={{
                  position: 'absolute', bottom: '28px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                }}>
                  <div style={{ width: '40px', height: '2px', borderRadius: '99px', background: 'rgba(255,255,255,0.2)' }} />
                  <span style={{
                    fontFamily: 'system-ui,sans-serif', fontWeight: 600,
                    fontSize: '10px', color: 'rgba(255,255,255,0.35)',
                    letterSpacing: '0.06em',
                  }}>
                    carangoladigital.com.br
                  </span>
                </div>
              </div>
            </div>

            {/* Size hint */}
            <p className="mt-3 text-center font-medium text-[11px] text-slate-500">
              Formato 9:16 — ideal para Instagram Stories
            </p>
          </div>

          {/* ── RIGHT PANEL ───────────────────────────── */}
          <div className="flex w-full max-w-sm flex-col gap-6 lg:pt-4">
            {/* Info card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="mb-1 font-black text-lg text-white tracking-tight">
                {establishmentName}
              </h2>
              <p className="font-medium text-slate-400 text-xs">
                carangoladigital.com.br/business/{slug}
              </p>

              <div className="mt-5 space-y-3">
                {[
                  { emoji: '📐', text: 'Formato 9:16 otimizado para Stories' },
                  { emoji: '🖼️', text: 'PNG em alta resolução (3×)' },
                  { emoji: '✨', text: 'Logo e nome da sua empresa' },
                  { emoji: '🔗', text: 'Link direto para seu perfil' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-3">
                    <span className="text-base">{item.emoji}</span>
                    <p className="font-medium text-slate-300 text-sm">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#ec4899,#8b5cf6,#3b82f6)' }}
              >
                <span className="absolute inset-0 bg-white/0 transition-colors group-hover:bg-white/10" />
                {isDownloading ? (
                  <span className="relative flex items-center gap-2">
                    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Gerando...
                  </span>
                ) : (
                  <span className="relative flex items-center gap-2">
                    <Download className="size-4" />
                    Baixar Sticker (PNG)
                  </span>
                )}
              </button>

              <Button
                variant="outline"
                onClick={handleShare}
                className="h-12 w-full rounded-2xl border-white/10 bg-white/5 font-bold text-slate-300 text-sm backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <Share2 className="mr-2 size-4" />
                Compartilhar Link
              </Button>
            </div>

            {/* Tip */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
              <p className="font-black text-[10px] text-amber-400 uppercase tracking-widest">
                💡 Dica de uso
              </p>
              <p className="mt-1.5 font-medium text-amber-200/80 text-xs leading-relaxed">
                Salve a imagem e adicione-a ao seu Story como figurinha ou fundo.
                Marque{' '}
                <span className="font-bold text-amber-300">@carangoladigital</span>{' '}
                para aparecer nos nossos reposts!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
