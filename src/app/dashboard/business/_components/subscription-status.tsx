'use client'

import { AlertTriangle, ArrowUpCircle, CheckCircle2, Crown } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SubscriptionStatusProps {
  planType: string
  status: boolean
  expiresIn: string
}

export function SubscriptionStatus({
  planType,
  status,
  expiresIn,
}: SubscriptionStatusProps) {
  const isFree = planType === 'free'

  if (status && !isFree) {
    return (
      <Card className="mb-8 border-green-100 bg-green-50/50 dark:border-green-900/20 dark:bg-green-900/10">
        <CardContent className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex rounded-full bg-green-100 p-2 dark:bg-green-900/30">
              <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-green-900 dark:text-green-100">
                  Assinatura Ativa
                </p>
                <Badge
                  variant="outline"
                  className="border-green-200 bg-green-100 font-bold text-[10px] text-green-700 uppercase"
                >
                  {planType}
                </Badge>
              </div>
              <p className="font-medium text-green-800/70 text-sm dark:text-green-300/60">
                Sua assinatura renova {expiresIn}.
              </p>
            </div>
          </div>
          <Link href="/dashboard/assinatura">
            <Button
              variant="ghost"
              size="sm"
              className="text-green-700 hover:bg-green-100 hover:text-green-800"
            >
              Gerenciar Assinatura
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'mb-8 overflow-hidden border-0 shadow-lg transition-all duration-500',
        isFree
          ? 'bg-gradient-to-r from-blue-600 to-indigo-700'
          : 'bg-gradient-to-r from-amber-500 to-orange-600'
      )}
    >
      <CardContent className="relative p-6">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 rotate-12 transform p-4 opacity-10">
          <Crown className="size-48" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-4 text-white">
            <div className="rounded-3xl bg-white/20 p-4 shadow-inner backdrop-blur-md">
              {isFree ? (
                <Crown className="size-8 text-white" />
              ) : (
                <AlertTriangle className="size-8 text-white" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-2xl uppercase leading-none tracking-tight">
                {isFree ? 'Potencialize sua Empresa' : 'Assinatura Expirada'}
              </h3>
              <p className="max-w-md font-medium text-blue-50/80 leading-snug">
                {isFree
                  ? 'Seu perfil atual é limitado. Faça o upgrade para ter acesso a galeria de fotos, redes sociais e mais destaque!'
                  : 'Seu acesso premium expirou. Renove agora para reativar todos os benefícios do seu plano.'}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-3 sm:flex-row md:w-auto">
            <Link href="/dashboard/assinatura" className="w-full sm:w-auto">
              <Button className="group w-full rounded-2xl bg-white px-8 py-6 font-black text-blue-700 uppercase tracking-wider shadow-blue-950/20 shadow-xl hover:bg-blue-50 sm:w-auto">
                <ArrowUpCircle className="mr-2 size-5 transition-transform group-hover:scale-110" />
                Upgrade Agora
              </Button>
            </Link>
            {!isFree && (
              <p className="font-bold text-white/60 text-xs uppercase tracking-widest">
                Status: Expirado {expiresIn !== 'N/A' && expiresIn}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
