'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, ChevronRight, AlertCircle, Sparkles } from 'lucide-react'
import { calculateProfileCompleteness } from '@/utils/profile-completeness'
import type { ProfileDataProps } from '@/_types/profile-data'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ProfileCompletenessCardProps {
  profile?: ProfileDataProps
}

export function ProfileCompletenessCard({ profile }: ProfileCompletenessCardProps) {
  // Se não houver perfil, usamos um mock para demonstração
  const mockProfile: Partial<ProfileDataProps> = {
    businessDescription: 'Uma descrição curta',
    category: 'Restaurante',
    businessPhones: [{ phone: '123', nameContact: 'Teste', isWhatsapp: true, isOnlyWhatsapp: false, title: 'WhatsApp' }],
    openingHours: {} as any
  }

  const { totalScore, items } = calculateProfileCompleteness((profile || mockProfile) as ProfileDataProps)

  const pendingItems = items.filter(item => !item.isComplete)
  const nextTarget = pendingItems[0]

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm overflow-hidden relative group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles className="size-24 text-primary rotate-12" />
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
        {/* Circular Progress */}
        <div className="relative size-32 flex-shrink-0">
          <svg className="size-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/20"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="58"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="364.4"
              initial={{ strokeDashoffset: 364.4 }}
              animate={{ strokeDashoffset: 364.4 - (364.4 * totalScore) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-primary"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{totalScore}%</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Completo</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Força do seu Perfil</h3>
            <p className="text-muted-foreground text-sm">
              Perfis completos aparecem até <span className="text-primary font-bold">3x mais</span> nas buscas dos clientes.
            </p>
          </div>

          {nextTarget ? (
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Próximo passo:</p>
                  <p className="text-sm text-foreground/80">Adicione seu <span className="font-bold lowercase">{nextTarget.label}</span> para ganhar +{nextTarget.score}%.</p>
                </div>
                <Button size="sm" asChild className="rounded-xl h-8">
                  <Link href={`/dashboard/business/edit`}>
                    Corrigir
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-green-500/10 rounded-2xl p-4 border border-green-500/20">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-green-500" />
                <p className="text-sm font-semibold text-green-700">Incrível! Seu perfil está nota 10.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Dots / Steps */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {item.isComplete ? (
              <CheckCircle2 className="size-4 text-green-500 flex-shrink-0" />
            ) : (
              <div className="size-4 rounded-full border-2 border-muted flex-shrink-0" />
            )}
            <span className={`text-xs truncate ${item.isComplete ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
