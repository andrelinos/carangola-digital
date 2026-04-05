import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  value: string
  change?: string
  icon: ReactNode
  iconClass?: string
}

export function DashboardCard({
  title,
  value,
  change,
  icon,
  iconClass,
}: Props) {
  return (
    <article className="cursor-pointer rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-center justify-between">
        <span className="font-medium text-muted-foreground text-sm">
          {title}
        </span>
        <div className={cn("p-2 rounded-lg bg-muted/50", iconClass)}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <span className="font-bold text-3xl text-foreground tracking-tight">{value}</span>
        {change && (
          <p className="mt-1 text-muted-foreground text-xs flex items-center gap-1 font-medium italic">
            {change}
          </p>
        )}
      </div>
    </article>
  )
}
