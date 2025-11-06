interface Props {
  title: string
  value: string
  change: string
  icon: string
  iconClass: string
}

export function DashboardCard({
  title,
  value,
  change,
  icon,
  iconClass,
}: Props) {
  return (
    <article className="cursor-pointer rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/20">
      <div className="flex items-center justify-between">
        <span className="font-medium text-muted-foreground text-sm">
          {title}
        </span>
        <span className={iconClass}>{icon}</span>
      </div>
      <div className="mt-4">
        <span className="font-bold text-3xl text-foreground">{value}</span>
        {change && (
          <p className="mt-1 text-muted-foreground text-xs">{change}</p>
        )}
      </div>
    </article>
  )
}
