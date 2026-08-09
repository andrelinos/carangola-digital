import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, Phone, Plus } from 'lucide-react'
import { getProfileData } from '@/app/server/get-profile-data'
import { getServicesByProfile } from '@/actions/services/get-services-by-profile'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ServicosPageProps {
  params: Promise<{ slug: string }>
}

const PRICE_TYPE_LABEL: Record<string, string> = {
  fixed: 'R$',
  from: 'A partir de',
  'on-request': 'Consultar',
}

export default async function BusinessServicosPage({
  params,
}: ServicosPageProps) {
  const { slug } = await params
  const profile = await getProfileData(slug)

  if (!profile) notFound()

  const services = await getServicesByProfile(profile.id ?? slug)

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="rounded-full bg-muted p-4">
          <Briefcase className="size-8 text-muted-foreground" />
        </div>
        <div>
          <p className="font-semibold text-foreground">
            Nenhum serviço cadastrado
          </p>
          <p className="mt-1 text-muted-foreground text-sm">
            Esta empresa ainda não publicou serviços na plataforma.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/servicos">Ver todos os serviços</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-foreground text-xl">
          Serviços oferecidos
        </h2>
        <Button asChild variant="outline" size="sm">
          <Link href="/servicos">
            <Plus className="mr-1.5 size-4" />
            Ver todos
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {services.map(service => {
          const whatsappHref = service.contactWhatsApp
            ? `https://wa.me/55${service.contactWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Vi o serviço "${service.title}" no Carangola Digital e gostaria de saber mais.`)}`
            : null

          return (
            <article
              key={service.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Thumbnail */}
              {service.thumbnailUrl && (
                <div className="aspect-video overflow-hidden rounded-lg bg-muted/40">
                  <img
                    src={service.thumbnailUrl}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div>
                <Badge variant="secondary" className="mb-1 text-xs">
                  {service.category}
                </Badge>
                <h3 className="font-semibold text-foreground leading-tight">
                  {service.title}
                </h3>
              </div>

              <div className="text-sm">
                {service.priceType === 'on-request' ? (
                  <span className="text-muted-foreground">Consultar preço</span>
                ) : (
                  <span className="font-semibold text-primary">
                    {PRICE_TYPE_LABEL[service.priceType]}{' '}
                    {service.price
                      ? `R$ ${(service.price / 100).toFixed(2).replace('.', ',')}`
                      : ''}
                  </span>
                )}
              </div>

              <div className="mt-auto flex gap-2">
                {whatsappHref && (
                  <Button size="sm" className="flex-1 text-xs" asChild>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="mr-1.5 size-3.5" />
                      Contato
                    </a>
                  </Button>
                )}
                <Button size="sm" variant="outline" className="text-xs" asChild>
                  <Link href={`/servicos/${service.slug}`}>Ver detalhes</Link>
                </Button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
