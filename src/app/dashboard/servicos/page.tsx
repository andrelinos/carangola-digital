import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import Link from 'next/link'
import { Plus, Briefcase, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { getUserServices } from '@/actions/services/get-user-services'
import { authOptions } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DeleteServiceButton } from './_components/delete-service-button'
import { ToggleServiceButton } from './_components/toggle-service-button'

const priceTypeLabel: Record<string, string> = {
  fixed: 'Fixo',
  from: 'A partir de',
  'on-request': 'Consultar',
}

export default async function DashboardServicosPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user) redirect('/acesso')

  const services = await getUserServices(user.id)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-foreground text-2xl tracking-tight">
            Meus Serviços
          </h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os serviços que você oferece na plataforma.
          </p>
        </div>
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link href="/dashboard/servicos/novo">
            <Plus className="mr-2 size-4" />
            Novo Serviço
          </Link>
        </Button>
      </div>

      {/* Table */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        {services.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="rounded-full bg-muted p-4">
              <Briefcase className="size-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Nenhum serviço cadastrado
              </p>
              <p className="mt-1 text-muted-foreground text-sm">
                Crie seu primeiro anúncio e apareça para clientes em Carangola.
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/servicos/novo">
                <Plus className="mr-2 size-4" />
                Criar Serviço
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-border border-b bg-muted/30">
                <tr className="text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Serviço</th>
                  <th className="hidden px-4 py-4 font-medium sm:table-cell">
                    Categoria
                  </th>
                  <th className="hidden px-4 py-4 font-medium md:table-cell">
                    Preço
                  </th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-4 py-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {services.map(service => (
                  <tr
                    key={service.id}
                    className="text-foreground text-sm transition-colors hover:bg-accent/10"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40">
                          {service.thumbnailUrl ? (
                            <img
                              src={service.thumbnailUrl}
                              alt={service.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Briefcase className="size-4 text-muted-foreground opacity-50" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium leading-tight">
                            {service.title}
                          </p>
                          <p className="mt-0.5 text-muted-foreground text-xs sm:hidden">
                            {service.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-4 text-muted-foreground sm:table-cell">
                      {service.category}
                    </td>
                    <td className="hidden px-4 py-4 md:table-cell">
                      {service.priceType === 'on-request' ? (
                        <span className="text-muted-foreground text-xs">
                          Consultar
                        </span>
                      ) : (
                        <span className="text-xs">
                          {priceTypeLabel[service.priceType]}{' '}
                          {service.price
                            ? `R$ ${(service.price / 100).toFixed(2).replace('.', ',')}`
                            : '—'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={service.isActive ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {service.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          asChild
                        >
                          <Link href={`/dashboard/servicos/${service.id}`}>
                            <Pencil className="size-4" />
                            <span className="sr-only">Editar</span>
                          </Link>
                        </Button>
                        <ToggleServiceButton
                          id={service.id}
                          isActive={service.isActive}
                        />
                        <DeleteServiceButton id={service.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
