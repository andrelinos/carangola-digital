import { ArrowRight, Briefcase, Phone } from 'lucide-react'
import Link from 'next/link'
import { getPaginatedServices } from '@/actions/services/get-paginated-services'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const PRICE_TYPE_LABEL: Record<string, string> = {
  fixed: 'R$',
  from: 'A partir de',
  'on-request': 'Consultar',
}
90
export async function ServicesCTA() {
  const { services } = await getPaginatedServices(null, null, 4)

  if (services.length === 0) return null

  return (
    <section className="bg-linear-to-br from-primary/5 via-background to-background py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className='mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary text-sm'>
              <Briefcase className="size-3.5" />
              Marketplace de Serviços
            </div>
            <h2 className="font-bold text-3xl tracking-tight">
              Serviços em Destaque
            </h2>
            <p className="mt-2 text-muted-foreground">
              Profissionais locais prontos para te atender.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/servicos">
              Ver todos
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(service => {
            const whatsappHref = service.contactWhatsApp
              ? `https://wa.me/55${service.contactWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Vi o serviço "${service.title}" no Carangola Digital e gostaria de saber mais.`)}`
              : null

            return (
              <article
                key={service.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Thumbnail */}
                <div className="aspect-video overflow-hidden bg-muted/40">
                  {service.thumbnailUrl ? (
                    <img
                      src={service.thumbnailUrl}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Briefcase className="size-10 text-muted-foreground/20" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <Badge variant="secondary" className="mb-1.5 text-xs">
                      {service.category}
                    </Badge>
                    <Link
                      href={`/servicos/${service.slug}`}
                      className="font-semibold text-foreground leading-tight hover:text-primary"
                    >
                      {service.title}
                    </Link>
                  </div>

                  <div className="text-sm">
                    {service.priceType === 'on-request' ? (
                      <span className="text-muted-foreground">
                        Consultar preço
                      </span>
                    ) : (
                      <span className="font-semibold text-primary">
                        {PRICE_TYPE_LABEL[service.priceType]}{' '}
                        {service.price
                          ? `R$ ${(service.price / 100).toFixed(2).replace('.', ',')}`
                          : ''}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto">
                    {whatsappHref ? (
                      <Button size="sm" className="w-full text-xs" asChild>
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Phone className="mr-1.5 size-3.5" />
                          Entrar em Contato
                        </a>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs"
                        asChild
                      >
                        <Link href={`/servicos/${service.slug}`}>
                          Ver detalhes
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
