import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: ReactNode
  iconClass?: string
  sparkline?: number[]
}

export function DashboardCard({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  iconClass,
  sparkline = [10, 15, 8, 20, 25, 22, 30], // Default mock data
}: Props) {
  return (
    <article className="cursor-pointer rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-center justify-between">
        <span className="font-medium text-muted-foreground text-sm">
          {title}
        </span>
        <div className={cn('rounded-lg bg-muted/50 p-2', iconClass)}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <span className="font-bold text-3xl text-foreground tracking-tight">
            {value}
          </span>
          {change && (
            <p
              className={cn(
                'mt-1 flex items-center gap-1 font-bold text-xs',
                trend === 'up'
                  ? 'text-emerald-500'
                  : trend === 'down'
                    ? 'text-rose-500'
                    : 'text-muted-foreground'
              )}
            >
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {change}
            </p>
          )}
        </div>

        {/* Small Sparkline */}
        <div className="flex h-10 w-20 items-end gap-0.5 opacity-50 transition-opacity group-hover:opacity-100">
          {sparkline.map((h, i) => (
            <div
              key={i}
              className={cn(
                'w-1.5 rounded-full bg-primary',
                i === sparkline.length - 1 && 'animate-pulse bg-primary'
              )}
              style={{ height: `${(h / Math.max(...sparkline)) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </article>
  )
}
