'use client'

import { Pencil, Trash2 } from 'lucide-react'

export function DashboardProfilesTable() {
  const publications = [
    {
      title: 'Casa 3 Quartos - Centro',
      category: 'Imóvel',
      status: 'Ativo',
      statusColor: 'chart-2',
      image:
        'https://placehold.co/600x400/oklch(var(--secondary))/oklch(var(--secondary-foreground))?text=Im%C3%B3vel',
    },
    {
      title: 'Desenvolvedor Web',
      category: 'Serviço',
      status: 'Pendente',
      statusColor: 'chart-1',
      image:
        'https://placehold.co/600x400/oklch(var(--chart-1))/oklch(var(--primary-foreground))?text=Servi%C3%A7o',
    },
    {
      title: 'Design de Interiores',
      category: 'Serviço',
      status: 'Expirado',
      statusColor: 'destructive',
      image:
        'https://placehold.co/600x400/oklch(var(--chart-5))/oklch(var(--primary-foreground))?text=Servi%C3%A7o',
    },
  ]

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
            {publications.map((item, index) => (
              <tr
                key={String(index)}
                className="text-foreground text-sm transition-colors hover:bg-accent/10"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt="Anúncio"
                      className="h-10 w-16 rounded-md border border-border object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.title}</p>
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
                <td className="py-4">
                  <button
                    type="button"
                    className="p-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
