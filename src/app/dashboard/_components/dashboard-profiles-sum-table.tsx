import { ExternalLink, Store } from 'lucide-react'
import Link from 'next/link'
import type { UserProfileTableData } from '@/actions/dashboard/get-user-profiles.action'

interface DashboardProfilesTableProps {
  profiles: UserProfileTableData[]
}

export function DashboardProfilesTable({
  profiles,
}: DashboardProfilesTableProps) {
  const getStatusClass = (color: StatusColor): string => {
    switch (color) {
      case 'chart-2':
        return 'bg-chart-2/20 text-chart-2'
      case 'chart-1':
        return 'bg-chart-1/20 text-chart-1'
      case 'destructive':
        return 'bg-destructive/20 text-destructive'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  type StatusColor = 'chart-2' | 'chart-1' | 'destructive' | (string & {})

  interface Publication {
    title: string
    category: string
    status: string
    statusColor: StatusColor
    image: string
  }

  const getStatusDotClass = (color: StatusColor): string => {
    switch (color) {
      case 'chart-2':
        return 'bg-chart-2'
      case 'chart-1':
        return 'bg-chart-1'
      case 'destructive':
        return 'bg-destructive'
      default:
        return 'bg-muted-foreground'
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
      <h2 className="mb-4 font-semibold text-foreground text-lg">
        Perfis gerenciados
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-border border-b">
            <tr className="text-muted-foreground text-sm">
              <th className="py-3 font-medium">Anúncio</th>
              <th className="hidden py-3 font-medium sm:table-cell">
                Categoria
              </th>
              <th className="hidden py-3 font-medium md:table-cell">Status</th>
              <th className="py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {profiles.length > 0 ? (
              profiles.map(item => (
                <tr
                  key={item.id}
                  className="text-foreground text-sm transition-colors hover:bg-accent/10"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-16 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/30">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Store className="size-5 text-muted-foreground opacity-50" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground text-xs sm:hidden">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden py-4 text-muted-foreground sm:table-cell">
                    {item.category}
                  </td>
                  <td className="hidden py-4 md:table-cell">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-medium text-xs ${getStatusClass(item.statusColor)}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${getStatusDotClass(item.statusColor)}`}
                      />
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Link
                      href={`/business/${item.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-primary/10 bg-primary/5 px-3 py-1.5 font-medium text-primary text-xs transition-colors hover:text-primary/80"
                    >
                      Visualizar/Editar
                      <ExternalLink className="size-3" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-muted-foreground text-sm italic"
                >
                  Nenhum perfil encontrado. Comece criando um novo negócio!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
