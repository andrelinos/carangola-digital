import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Briefcase,
  MapPin,
  Star,
  ArrowLeft,
  Building2,
  Eye,
} from 'lucide-react'
import { getServiceBySlug } from '@/actions/services/get-service-by-slug'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ServicePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug, false)

  if (!service) {
    return { title: 'Serviço não encontrado | Carangola Digital' }
  }

  return {
    title: `${service.title} | Serviços em Carangola`,
    description: service.description.slice(0, 160),
    alternates: {
      canonical: `https://carangoladigital.com.br/servicos/${slug}`,
    },
  }
}

const PRICE_TYPE_LABEL: Record<string, string> = {
  fixed: 'Preço fixo',
  from: 'A partir de',
  'on-request': 'Consultar preço',
}

const SERVICE_AREA_LABEL: Record<string, string> = {
  local: 'Apenas no local do prestador',
  citywide: 'Em toda a cidade de Carangola',
  'home-service': 'Atendimento a domicílio',
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params
  const service = await getServiceBySlug(slug, true)

  if (!service) notFound()

  const whatsappHref = service.contactWhatsApp
    ? `https://wa.me/55${service.contactWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Vi seu anúncio "${service.title}" no Carangola Digital e gostaria de saber mais.`)}`
    : null

  const hasImages = service.images && service.images.length > 0
  const coverImage = service.thumbnailUrl ?? service.images?.[0]?.url

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Back */}
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-6">
          <Link href="/servicos">
            <ArrowLeft className="mr-1.5 size-4" />
            Voltar para serviços
          </Link>
        </Button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Cover image */}
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted/40">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={service.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Briefcase className="size-16 text-muted-foreground/20" />
                </div>
              )}
            </div>

            {/* Gallery */}
            {hasImages && service.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {service.images.slice(0, 4).map((img, i) => (
                  <div
                    key={img.path}
                    className="aspect-square overflow-hidden rounded-lg border border-border bg-muted/30"
                  >
                    <img
                      src={img.url}
                      alt={`${service.title} - foto ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Title and badges */}
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{service.category}</Badge>
                {service.isHighlighted && (
                  <Badge className="bg-amber-500 text-white">⭐ Destaque</Badge>
                )}
              </div>
              <h1 className="font-bold text-foreground text-3xl tracking-tight">
                {service.title}
              </h1>
            </div>

            {/* Description */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-3 font-semibold text-foreground">
                Sobre o serviço
              </h2>
              <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Price card */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="mb-1 text-muted-foreground text-sm">
                {PRICE_TYPE_LABEL[service.priceType]}
              </p>
              {service.priceType !== 'on-request' && service.price ? (
                <p className="font-bold text-3xl text-primary">
                  R${' '}
                  {(service.price / 100)
                    .toFixed(2)
                    .replace('.', ',')}
                </p>
              ) : (
                <p className="font-semibold text-foreground text-xl">
                  A combinar
                </p>
              )}

              {whatsappHref ? (
                <Button className="mt-4 w-full" size="lg" asChild>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Entrar em Contato
                  </a>
                </Button>
              ) : (
                <Button className="mt-4 w-full" size="lg" disabled>
                  Sem contato disponível
                </Button>
              )}
            </div>

            {/* Details */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 font-semibold text-foreground text-sm uppercase tracking-wider">
                Detalhes
              </h3>
              <ul className="flex flex-col gap-3 text-sm">
                <li className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{SERVICE_AREA_LABEL[service.serviceArea]}</span>
                </li>
                {service.neighborhood && (
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <Building2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>Bairro: {service.neighborhood}</span>
                  </li>
                )}
                <li className="flex items-start gap-2 text-muted-foreground">
                  <Eye className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{service.totalVisits} visualizações</span>
                </li>
                {service.reviewCount > 0 && service.rating && (
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <Star className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    <span>
                      {service.rating.toFixed(1)} ({service.reviewCount}{' '}
                      avaliações)
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
