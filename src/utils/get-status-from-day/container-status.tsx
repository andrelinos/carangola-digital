import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface Props {
  status:
    | 'open'
    | 'closed'
    | 'undefinedTime'
    | 'permanentlyClosed'
    | 'onVacation'
    | 'onHolidayBreak'
  children: ReactNode
}

const badgeConfig = {
  open: {
    dot: 'bg-emerald-500',
    ping: 'bg-emerald-400',
    label: 'Aberto',
    labelClass: 'text-emerald-700 dark:text-emerald-400',
    subClass: 'text-slate-500 dark:text-slate-400',
  },
  closed: {
    dot: 'bg-rose-500',
    ping: 'bg-rose-400',
    label: 'Fechado',
    labelClass: 'text-rose-600 dark:text-rose-400',
    subClass: 'text-slate-500 dark:text-slate-400',
  },
  undefinedTime: {
    dot: 'bg-amber-500',
    ping: 'bg-amber-400',
    label: 'Horário indefinido',
    labelClass: 'text-amber-700 dark:text-amber-400',
    subClass: 'text-slate-500 dark:text-slate-400',
  },
  permanentlyClosed: {
    dot: 'bg-slate-500',
    ping: 'bg-slate-400',
    label: 'Fechado permanentemente',
    labelClass: 'text-slate-700 dark:text-slate-300',
    subClass: 'text-slate-500 dark:text-slate-400',
  },
  onVacation: {
    dot: 'bg-blue-500',
    ping: 'bg-blue-400',
    label: 'Em férias',
    labelClass: 'text-blue-700 dark:text-blue-400',
    subClass: 'text-slate-500 dark:text-slate-400',
  },
  onHolidayBreak: {
    dot: 'bg-purple-500',
    ping: 'bg-purple-400',
    label: 'Feriado',
    labelClass: 'text-purple-700 dark:text-purple-400',
    subClass: 'text-slate-500 dark:text-slate-400',
  },
}

function extractSubtext(children: ReactNode): {
  primary: string
  sub: ReactNode | null
} {
  if (typeof children !== 'string') {
    // Se for JSX (ReactNode com partes), tenta extrair pela string completa
    return { primary: '', sub: children }
  }
  const separators = [' - Abre', ' - Fecha', ' - abre', ' - fecha']
  for (const sep of separators) {
    const idx = children.indexOf(sep)
    if (idx !== -1) {
      return {
        primary: children.slice(0, idx),
        sub: children.slice(idx + 3), // remove " - "
      }
    }
  }
  return { primary: children, sub: null }
}

export function ContainerStatus({ status, children }: Props) {
  const config = badgeConfig[status]

  const isStringChild = typeof children === 'string'
  const { primary, sub } = isStringChild
    ? extractSubtext(children)
    : { primary: '', sub: children }

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2">
        <span className="relative flex size-2.5 shrink-0">
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              config.ping
            )}
          />
          <span
            className={cn(
              'relative inline-flex size-2.5 rounded-full',
              config.dot
            )}
          />
        </span>
        <span className={cn('font-semibold text-sm', config.labelClass)}>
          {isStringChild && primary ? primary : config.label}
        </span>
      </div>

      {sub && (
        <p className={cn('pl-4 text-xs leading-snug', config.subClass)}>
          {sub}
        </p>
      )}
    </div>
  )
}
