'use client'

import { Instagram } from 'iconoir-react'
import { Check, Download, MapPin, QrCode, Share2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { UserProfileTableData } from '@/actions/dashboard/get-user-profiles.action'
import { Button } from '@/components/ui/button'

interface MarketingKitProps {
  profiles: UserProfileTableData[]
}

export function MarketingKit({ profiles }: MarketingKitProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenFolder = () => {
    setIsModalOpen(true)
  }

  const handleSelectProfile = (slug: string) => {
    setIsModalOpen(false)
    router.push(`/dashboard/business/display/${slug}`)
  }

  const tools = [
    {
      title: 'QR Code da Loja',
      description:
        'Baixe o QR Code para colocar nas mesas ou no balcão da sua loja física.',
      icon: <QrCode className="size-6 text-primary" />,
      action: 'Baixar PNG',
      onClick: handleOpenFolder,
    },
    {
      title: 'Sticker de Stories',
      description:
        'Imagem personalizada "Estamos no Carangola Digital" para seu Instagram.',
      icon: <Instagram className="size-6 text-pink-500" />,
      action: 'Gerar Arte',
    },
    {
      title: 'Link de Divulgação',
      description:
        'Copie seu link curto e compartilhe em grupos de WhatsApp e redes sociais.',
      icon: <Share2 className="size-6 text-blue-500" />,
      action: 'Copiar Link',
    },
    {
      title: 'Sinalizador de Local',
      description:
        'Apareça no mapa com destaque para clientes que estão por perto.',
      icon: <MapPin className="size-6 text-emerald-500" />,
      action: 'Ver no Mapa',
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

      {/* Modal de Seleção de Perfil */}
      {isModalOpen && (
        <div className="fade-in fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200">
          <div className="zoom-in-95 w-full max-w-md animate-in overflow-hidden rounded-3xl bg-white shadow-2xl duration-200">
            <div className="flex items-center justify-between border-border border-b p-6">
              <div>
                <h3 className="font-bold text-lg">Selecionar Empresa</h3>
                <p className="text-muted-foreground text-xs">
                  Escolha qual QR Code deseja gerar
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="max-h-[60vh] space-y-2 overflow-y-auto p-4">
              {profiles.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile.slug)}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-border p-3 text-left transition-all hover:border-primary/50 hover:bg-primary/5"
                >
                  <div className="size-10 overflow-hidden rounded-xl border border-border bg-muted">
                    {profile.image ? (
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground">
                        <QrCode className="size-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm leading-tight">
                      {profile.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {profile.category}
                    </p>
                  </div>
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100">
                    <Check className="size-4 text-primary" />
                  </div>
                </button>
              ))}
              {profiles.length === 0 && (
                <p className="py-8 text-center text-muted-foreground text-sm italic">
                  Nenhuma empresa encontrada.
                </p>
              )}
            </div>

            <div className="bg-muted/30 p-6">
              <Button
                variant="outline"
                className="w-full rounded-2xl"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
