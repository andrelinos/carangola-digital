'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, Calendar, Wallet, CheckCircle2, AlertTriangle, CreditCard, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/utils/format-price'
import { cn } from '@/lib/utils'

interface CurrentPlanProps {
  planType: string
  status: boolean
  expiresIn: string
  price: number
}

export function CurrentPlan({ planType, status, expiresIn, price }: CurrentPlanProps) {
  const isFree = planType === 'free'

  return (
    <Card className="mb-12 overflow-hidden border-none shadow-2xl bg-white rounded-[2.5rem]">
      <CardHeader className={cn(
        "p-8 text-white relative overflow-hidden",
        status ? "bg-primary" : "bg-destructive"
      )}>
        {/* Abstract shapes for premium feel */}
        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/3 -translate-y-1/3">
           <ShieldCheck className="size-64" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                    <CreditCard className="size-6 text-white" />
                 </div>
                 <h2 className="text-3xl font-black uppercase tracking-tighter italic">Detalhes da Assinatura</h2>
              </div>
              <p className="text-white/70 font-medium tracking-tight">Gerencie seu nível de visibilidade na plataforma</p>
           </div>
           
           <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/20 self-start md:self-auto">
              <div className={cn("size-3 rounded-full animate-pulse", status ? "bg-green-400" : "bg-yellow-400")} />
              <span className="text-sm font-bold uppercase tracking-widest">{status ? 'Assinatura Ativa' : 'Requer Atenção'}</span>
           </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           {/* Plan Type */}
           <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400">
                 <CheckCircle2 className="size-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Plano Atual</span>
              </div>
              <div className="space-y-1">
                 <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{planType}</h3>
                 <Badge variant="outline" className={cn(
                    "px-3 py-1 font-bold text-[10px] uppercase tracking-wider",
                    isFree ? "text-slate-400 border-slate-200" : "text-primary border-primary/20 bg-primary/5"
                 )}>
                    {isFree ? 'Nível Básico' : 'Destaque Premium'}
                 </Badge>
              </div>
           </div>

           {/* Value / Investment */}
           <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400">
                 <Wallet className="size-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Investimento</span>
              </div>
              <div className="space-y-1">
                 <p className="text-4xl font-black text-slate-900 tracking-tighter">
                    {price > 0 ? formatPrice(price) : 'Grátis'}
                 </p>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {isFree ? 'Vitalício • Sem cobrança' : 'Renovação anual'}
                 </p>
              </div>
           </div>

           {/* Expiration / Status */}
           <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400">
                 <Calendar className="size-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Status de Validade</span>
              </div>
              <div className="space-y-1">
                 <div className="flex items-center gap-2">
                    {status ? (
                       <p className="text-2xl font-black text-slate-900 tracking-tight">Expira em {expiresIn}</p>
                    ) : (
                       <p className="text-2xl font-black text-destructive tracking-tight uppercase italic">{expiresIn}</p>
                    )}
                 </div>
                 <p className={cn(
                    "text-xs font-bold uppercase tracking-widest",
                    status ? "text-green-600" : "text-amber-600 animate-pulse"
                 )}>
                    {status ? 'Pagamento processado com sucesso' : 'Realize o upgrade para continuar'}
                 </p>
              </div>
           </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center gap-6 group hover:border-primary/20 transition-colors">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 group-hover:bg-primary/10 transition-colors">
               <ArrowRight className="size-6 text-primary" />
            </div>
            <div>
               <p className="text-sm font-black text-slate-950 uppercase tracking-tight">Deseja mudar de plano?</p>
               <p className="text-xs font-medium text-slate-500">Explore as opções de upgrade abaixo para aumentar sua visibilidade e alcançar mais clientes em Carangola.</p>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
