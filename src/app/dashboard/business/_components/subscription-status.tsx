'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Crown, AlertTriangle, CheckCircle2, ArrowUpCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SubscriptionStatusProps {
  planType: string
  status: boolean
  expiresIn: string
}

export function SubscriptionStatus({ planType, status, expiresIn }: SubscriptionStatusProps) {
  const isFree = planType === 'free'
  
  if (status && !isFree) {
    return (
      <Card className="mb-8 border-green-100 bg-green-50/50 dark:border-green-900/20 dark:bg-green-900/10">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
              <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-green-900 dark:text-green-100">Assinatura Ativa</p>
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 uppercase text-[10px] font-bold">
                  {planType}
                </Badge>
              </div>
              <p className="text-sm text-green-800/70 dark:text-green-300/60 font-medium">
                Sua assinatura renova {expiresIn}.
              </p>
            </div>
          </div>
          <Link href="/dashboard/assinatura">
            <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800 hover:bg-green-100">
              Gerenciar Assinatura
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(
      "mb-8 overflow-hidden border-0 shadow-lg transition-all duration-500",
      isFree ? "bg-gradient-to-r from-blue-600 to-indigo-700" : "bg-gradient-to-r from-amber-500 to-orange-600"
    )}>
      <CardContent className="p-6 relative">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/4 -translate-y-1/4 rotate-12">
          <Crown className="size-48" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 text-white">
            <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md shadow-inner">
               {isFree ? <Crown className="size-8 text-white" /> : <AlertTriangle className="size-8 text-white" />}
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black tracking-tight leading-none uppercase">
                {isFree ? "Potencialize sua Empresa" : "Assinatura Expirada"}
              </h3>
              <p className="text-blue-50/80 font-medium max-w-md leading-snug">
                {isFree 
                  ? "Seu perfil atual é limitado. Faça o upgrade para ter acesso a galeria de fotos, redes sociais e mais destaque!" 
                  : "Seu acesso premium expirou. Renove agora para reativar todos os benefícios do seu plano."}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
             <Link href="/dashboard/assinatura" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-black px-8 py-6 rounded-2xl shadow-xl shadow-blue-950/20 group uppercase tracking-wider">
                  <ArrowUpCircle className="mr-2 size-5 group-hover:scale-110 transition-transform" />
                  Upgrade Agora
                </Button>
             </Link>
             {!isFree && (
                <p className="text-xs text-white/60 font-bold uppercase tracking-widest">
                  Status: Expirado {expiresIn !== 'N/A' && expiresIn}
                </p>
             )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
