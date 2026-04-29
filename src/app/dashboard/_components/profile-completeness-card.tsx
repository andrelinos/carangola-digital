'use client'

import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import type { ProfileDataProps } from '@/_types/profile-data'
import { Button } from '@/components/ui/button'
import { calculateProfileCompleteness } from '@/utils/profile-completeness'

interface ProfileCompletenessCardProps {
  profile?: ProfileDataProps
}

export function ProfileCompletenessCard({
  profile,
}: ProfileCompletenessCardProps) {
  // Se não houver perfil, usamos um mock para demonstração
  const mockProfile: Partial<ProfileDataProps> = {
    businessDescription: 'Uma descrição curta',
    category: 'Restaurante',
    businessPhones: [
      {
        phone: '123',
        nameContact: 'Teste',
        isWhatsapp: true,
        isOnlyWhatsapp: false,
        title: 'WhatsApp',
      },
    ],
    openingHours: {} as any,
  }

  const { totalScore, items } = calculateProfileCompleteness(
    (profile || mockProfile) as ProfileDataProps
  )

  const pendingItems = items.filter(item => !item.isComplete)
  const nextTarget = pendingItems[0]

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
        <Sparkles className="size-24 rotate-12 text-primary" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row">
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
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="text-primary"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-bold text-3xl">{totalScore}%</span>
            <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-tighter">
              Completo
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="font-bold text-xl tracking-tight">
              Força do seu Perfil
            </h3>
            <p className="text-muted-foreground text-sm">
              Perfis completos aparecem até{' '}
              <span className="font-bold text-primary">3x mais</span> nas buscas
              dos clientes.
            </p>
          </div>

          {nextTarget ? (
            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 size-5 text-primary" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">Próximo passo:</p>
                  <p className="text-foreground/80 text-sm">
                    Adicione seu{' '}
                    <span className="font-bold lowercase">
                      {nextTarget.label}
                    </span>{' '}
                    para ganhar +{nextTarget.score}%.
                  </p>
                </div>
                <Button size="sm" asChild className="h-8 rounded-xl">
                  <Link
                    href={`/business/${(profile || mockProfile)?.slug || ''}?edit=${nextTarget.id}`}
                  >
                    Corrigir
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-green-500" />
                <p className="font-semibold text-green-700 text-sm">
                  Incrível! Seu perfil está nota 10.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Dots / Steps */}
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {item.isComplete ? (
              <CheckCircle2 className="size-4 flex-shrink-0 text-green-500" />
            ) : (
              <div className="size-4 flex-shrink-0 rounded-full border-2 border-muted" />
            )}
            <span
              className={`truncate text-xs ${item.isComplete ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
