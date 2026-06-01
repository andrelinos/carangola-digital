'use client'

import { Instagram } from 'iconoir-react'
import { Check, Download, MapPin, QrCode, Search, Share2, X, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import type { UserProfileTableData } from '@/actions/dashboard/get-user-profiles.action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// ── Reusable modal with search ────────────────────────────────────────────────

interface SelectBusinessModalProps {
  open: boolean
  onClose: () => void
  onSelect: (slug: string) => void
  profiles: UserProfileTableData[]
  title: string
  description: string
  accentClass?: string
  checkIcon: React.ReactNode
}

function SelectBusinessModal({
  open,
  onClose,
  onSelect,
  profiles,
  title,
  description,
  accentClass = 'hover:border-primary/50 hover:bg-primary/5',
  checkIcon,
}: SelectBusinessModalProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return profiles
    return profiles.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    )
  }, [profiles, query])

  if (!open) return null

  function handleClose() {
    setQuery('')
    onClose()
  }

  function handleSelect(slug: string) {
    setQuery('')
    onSelect(slug)
  }

  return (
    <div className="fade-in fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200">
      <div className="zoom-in-95 w-full max-w-md animate-in overflow-hidden rounded-3xl bg-white shadow-2xl duration-200 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-border border-b p-6">
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-muted-foreground text-xs">{description}</p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-2 transition-colors hover:bg-muted"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search */}
        <div className="border-border border-b px-4 py-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Buscar empresa ou categoria..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="h-9 rounded-xl pl-9 text-sm"
            />
          </div>
        </div>

        {/* List */}
        <div className="max-h-[50vh] space-y-2 overflow-y-auto p-4">
          {filtered.map(profile => (
            <button
              key={profile.id}
              onClick={() => handleSelect(profile.slug)}
              className={`group flex w-full items-center gap-4 rounded-2xl border border-border p-3 text-left transition-all ${accentClass}`}
            >
              <div className="size-10 overflow-hidden rounded-xl border border-border bg-muted">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center font-bold text-lg text-muted-foreground">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-sm leading-tight">
                  {profile.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {profile.category}
                </p>
              </div>
              <div className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                {checkIcon}
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <p className="py-8 text-center text-muted-foreground text-sm italic">
              {query
                ? `Nenhum resultado para "${query}"`
                : 'Nenhuma empresa encontrada.'}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="bg-muted/30 p-4">
          <Button
            variant="outline"
            className="w-full rounded-2xl"
            onClick={handleClose}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Reusable modal for Properties ─────────────────────────────────────────────

interface SelectPropertyModalProps {
  open: boolean
  onClose: () => void
  onSelect: (slug: string) => void
  properties: any[]
  title: string
  description: string
  accentClass?: string
  checkIcon: React.ReactNode
}

function SelectPropertyModal({
  open,
  onClose,
  onSelect,
  properties,
  title,
  description,
  accentClass = 'hover:border-primary/50 hover:bg-primary/5',
  checkIcon,
}: SelectPropertyModalProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return properties
    return properties.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.type?.toLowerCase().includes(q)
    )
  }, [properties, query])

  if (!open) return null

  function handleClose() {
    setQuery('')
    onClose()
  }

  function handleSelect(slug: string) {
    setQuery('')
    onSelect(slug)
  }

  return (
    <div className="fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200">
      <div className="zoom-in-95 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl duration-200 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-border border-b p-6">
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-muted-foreground text-xs">{description}</p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-2 transition-colors hover:bg-muted"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search */}
        <div className="border-border border-b px-4 py-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Buscar imóvel..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="h-9 rounded-xl pl-9 text-sm"
            />
          </div>
        </div>

        {/* List */}
        <div className="max-h-[50vh] space-y-2 overflow-y-auto p-4">
          {filtered.map(property => (
            <button
              key={property.id}
              onClick={() => handleSelect(property.slug)}
              className={`group flex w-full items-center gap-4 rounded-2xl border border-border p-3 text-left transition-all ${accentClass}`}
            >
              <div className="size-10 overflow-hidden rounded-xl border border-border bg-muted">
                {property.image ? (
                  <img
                    src={property.image}
                    alt={property.title}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center font-bold text-lg text-muted-foreground">
                    <Home className="size-4" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-sm leading-tight">
                  {property.title}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {property.type === 'rent' ? 'Aluguel' : 'Venda'}
                </p>
              </div>
              <div className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                {checkIcon}
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <p className="py-8 text-center text-muted-foreground text-sm italic">
              {query
                ? `Nenhum resultado para "${query}"`
                : 'Nenhum imóvel encontrado.'}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="bg-muted/30 p-4">
          <Button
            variant="outline"
            className="w-full rounded-2xl"
            onClick={handleClose}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface MarketingKitProps {
  profiles: UserProfileTableData[]
  properties?: any[]
}

export function MarketingKit({ profiles, properties = [] }: MarketingKitProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isStickerModalOpen, setIsStickerModalOpen] = useState(false)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [isPropertyMapModalOpen, setIsPropertyMapModalOpen] = useState(false)

  const handleSelectProfile = (slug: string) => {
    setIsModalOpen(false)
    router.push(`/dashboard/business/display/${slug}`)
  }

  const handleSelectProfileSticker = (slug: string) => {
    setIsStickerModalOpen(false)
    router.push(`/dashboard/business/sticker/${slug}`)
  }

  const handleSelectProfileMap = (slug: string) => {
    setIsMapModalOpen(false)
    router.push(`/dashboard/business/beacon/${slug}`)
  }

  const handleSelectPropertyMap = (slug: string) => {
    setIsPropertyMapModalOpen(false)
    router.push(`/dashboard/imoveis/beacon/${slug}`)
  }

  const handleSelectProfileLink = (slug: string) => {
    setIsLinkModalOpen(false)
    navigator.clipboard.writeText(
      `https://carangoladigital.com.br/business/${slug}`
    )
    toast.success('Link copiado para a área de transferência!')
  }

  const tools = [
    {
      title: 'QR Code da Loja',
      description:
        'Baixe o QR Code para colocar nas mesas ou no balcão da sua loja física.',
      icon: <QrCode className="size-6 text-primary" />,
      action: 'Baixar PNG',
      onClick: () => setIsModalOpen(true),
    },
    {
      title: 'Sticker de Stories',
      description:
        'Imagem personalizada "Estamos no Carangola Digital" para seu Instagram.',
      icon: <Instagram className="size-6 text-pink-500" />,
      action: 'Gerar Arte',
      onClick: () => setIsStickerModalOpen(true),
    },
    {
      title: 'Link de Divulgação',
      description:
        'Copie seu link curto e compartilhe em grupos de WhatsApp e redes sociais.',
      icon: <Share2 className="size-6 text-blue-500" />,
      action: 'Copiar Link',
      onClick: () => setIsLinkModalOpen(true),
    },
    {
      title: 'Sinalizador de Empresa',
      description:
        'Apareça no mapa com destaque para clientes que estão por perto.',
      icon: <MapPin className="size-6 text-emerald-500" />,
      action: 'Ver no Mapa',
      onClick: () => setIsMapModalOpen(true),
    },
    {
      title: 'Sinalizador de Imóvel',
      description:
        'Destaque seu imóvel no mapa interativo para atrair clientes da região.',
      icon: <Home className="size-6 text-amber-500" />,
      action: 'Ver no Mapa',
      onClick: () => setIsPropertyMapModalOpen(true),
    },
  ]

  return (
    <>
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-xl tracking-tight">
              Kit de Crescimento
            </h2>
            <p className="text-muted-foreground text-sm">
              Ferramentas para atrair mais clientes fora do portal.
            </p>
          </div>
          <div className="rounded-full bg-primary/10 px-2 py-1 font-bold text-[10px] text-primary uppercase">
            Merchant Tools
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {tools.map((tool, idx) => (
            <div
              key={idx}
              className="group flex gap-4 rounded-2xl border border-border p-4 transition-all hover:border-primary/30 hover:bg-primary/5"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted/50 transition-transform group-hover:scale-110">
                {tool.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{tool.title}</h4>
                <p className="mb-3 line-clamp-2 text-muted-foreground text-xs">
                  {tool.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 rounded-lg border-dashed font-bold text-[10px]"
                  onClick={tool.onClick}
                >
                  <Download className="mr-1 size-3" />
                  {tool.action}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SelectBusinessModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectProfile}
        profiles={profiles}
        title="Selecionar Empresa"
        description="Escolha qual QR Code deseja gerar"
        accentClass="hover:border-primary/50 hover:bg-primary/5"
        checkIcon={
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
            <Check className="size-4 text-primary" />
          </div>
        }
      />

      <SelectBusinessModal
        open={isStickerModalOpen}
        onClose={() => setIsStickerModalOpen(false)}
        onSelect={handleSelectProfileSticker}
        profiles={profiles}
        title="Selecionar Empresa"
        description="Escolha para qual empresa gerar o Sticker de Stories"
        accentClass="hover:border-pink-300 hover:bg-pink-50 dark:hover:border-pink-800 dark:hover:bg-pink-900/20"
        checkIcon={
          <div className="flex size-8 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/40">
            <Check className="size-4 text-pink-600 dark:text-pink-400" />
          </div>
        }
      />

      <SelectBusinessModal
        open={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSelect={handleSelectProfileLink}
        profiles={profiles}
        title="Selecionar Empresa"
        description="Escolha de qual empresa você deseja copiar o link"
        accentClass="hover:border-blue-300 hover:bg-blue-50 dark:hover:border-blue-800 dark:hover:bg-blue-900/20"
        checkIcon={
          <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
            <Share2 className="size-4 text-blue-600 dark:text-blue-400" />
          </div>
        }
      />

      <SelectBusinessModal
        open={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelect={handleSelectProfileMap}
        profiles={profiles}
        title="Selecionar Empresa"
        description="Escolha qual empresa visualizar no mapa"
        accentClass="hover:border-emerald-300 hover:bg-emerald-50 dark:hover:border-emerald-800 dark:hover:bg-emerald-900/20"
        checkIcon={
          <div className="flex size-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
            <MapPin className="size-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        }
      />

      <SelectPropertyModal
        open={isPropertyMapModalOpen}
        onClose={() => setIsPropertyMapModalOpen(false)}
        onSelect={handleSelectPropertyMap}
        properties={properties}
        title="Selecionar Imóvel"
        description="Escolha qual imóvel visualizar no mapa"
        accentClass="hover:border-amber-300 hover:bg-amber-50 dark:hover:border-amber-800 dark:hover:bg-amber-900/20"
        checkIcon={
          <div className="flex size-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
            <Home className="size-4 text-amber-600 dark:text-amber-400" />
          </div>
        }
      />
    </>
  )
}
