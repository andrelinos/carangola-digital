import { ReactNode } from 'react'
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
  sparkline = [10, 15, 8, 20, 25, 22, 30] // Default mock data
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
      <div className="mt-4 flex items-end justify-between">
        <div>
          <span className="font-bold text-3xl text-foreground tracking-tight">{value}</span>
          {change && (
            <p className={cn(
              "mt-1 text-xs flex items-center gap-1 font-bold",
              trend === 'up' ? "text-emerald-500" : trend === 'down' ? "text-rose-500" : "text-muted-foreground"
            )}>
              {trend === 'up' && "↑"}
              {trend === 'down' && "↓"}
              {change}
            </p>
          )}
        </div>

        {/* Small Sparkline */}
        <div className="h-10 w-20 flex items-end gap-0.5 opacity-50 group-hover:opacity-100 transition-opacity">
          {sparkline.map((h, i) => (
            <div 
              key={i} 
              className={cn("w-1.5 rounded-full bg-primary", i === sparkline.length -1 && "bg-primary animate-pulse")} 
              style={{ height: `${(h / Math.max(...sparkline)) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </article>
  )
}
