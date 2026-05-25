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
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Background Decor */}
      <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.06]">
        <Sparkles className="size-40 rotate-12 text-primary" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Circular Progress */}
        <div className="relative flex size-[120px] shrink-0 items-center justify-center rounded-full bg-background shadow-inner">
          <svg className="absolute inset-0 size-full -rotate-90 drop-shadow-sm">
            <title>Progresso do Perfil</title>
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/30"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="52"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="326.7" // 2 * PI * 52
              initial={{ strokeDashoffset: 326.7 }}
              animate={{ strokeDashoffset: 326.7 - (326.7 * totalScore) / 100 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="text-primary"
              strokeLinecap="round"
            />
          </svg>
          <div className="flex flex-col items-center justify-center">
            <span className="font-black text-3xl text-primary">
              {totalScore}%
            </span>
            <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
              Concluído
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="w-full flex-1 space-y-5 text-center">
          <div>
            <h3 className="font-black text-foreground text-xl tracking-tight">
              Força do seu Perfil
            </h3>
            <p className="mx-auto mt-1 max-w-xs font-medium text-muted-foreground text-sm">
              Perfis completos aparecem até{' '}
              <span className="font-bold text-primary">3x mais</span> nas buscas
              dos clientes.
            </p>
          </div>

          {nextTarget ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left transition-colors hover:bg-primary/10">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-full bg-primary/20 p-2">
                    <AlertCircle className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">
                      Próximo passo sugerido:
                    </p>
                    <p className="mt-0.5 font-medium text-muted-foreground text-sm">
                      Adicione seu{' '}
                      <span className="font-bold text-foreground lowercase">
                        {nextTarget.label}
                      </span>{' '}
                      para ganhar +{nextTarget.score}%.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  asChild
                  className="h-10 w-full rounded-xl font-bold shadow-sm"
                >
                  <Link
                    href={`/business/${(profile || mockProfile)?.slug || ''}?edit=${nextTarget.id}`}
                  >
                    Completar Agora
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-left">
              <div className="flex items-center gap-3">
                <div className="shrink-0 rounded-full bg-green-500/20 p-2">
                  <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-bold text-green-800 text-sm dark:text-green-300">
                    Incrível! Seu perfil está nota 10.
                  </p>
                  <p className="font-medium text-green-700/80 text-xs dark:text-green-400/80">
                    Você preencheu todas as informações importantes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Dots / Steps */}
      <div className="mt-8 grid grid-cols-2 gap-2 sm:gap-3">
        {items.map((item, idx) => (
          <div
            key={String(idx)}
            className={`flex items-center gap-2 rounded-xl border p-2.5 transition-colors ${
              item.isComplete
                ? 'border-primary/20 bg-primary/5 dark:bg-primary/10'
                : 'border-border bg-background'
            }`}
          >
            {item.isComplete ? (
              <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
                <CheckCircle2 className="size-3.5 text-primary" />
              </div>
            ) : (
              <div className="size-5 shrink-0 rounded-full border-2 border-muted bg-background shadow-inner" />
            )}
            <span
              className={`truncate text-xs ${
                item.isComplete
                  ? 'font-bold text-foreground'
                  : 'font-medium text-muted-foreground'
              }`}
              title={item.label}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
