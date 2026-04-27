'use client'

import { useState } from 'react'
import { Download, QrCode, Share2, MapPin, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Instagram } from 'iconoir-react'
import type { UserProfileTableData } from '@/actions/dashboard/get-user-profiles.action'
import { useRouter } from 'next/navigation'

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
      description: 'Baixe o QR Code para colocar nas mesas ou no balcão da sua loja física.',
      icon: <QrCode className="size-6 text-primary" />,
      action: 'Baixar PNG',
      onClick: handleOpenFolder
    },
    {
      title: 'Sticker de Stories',
      description: 'Imagem personalizada "Estamos no Carangola Digital" para seu Instagram.',
      icon: <Instagram className="size-6 text-pink-500" />,
      action: 'Gerar Arte',
    },
    {
      title: 'Link de Divulgação',
      description: 'Copie seu link curto e compartilhe em grupos de WhatsApp e redes sociais.',
      icon: <Share2 className="size-6 text-blue-500" />,
      action: 'Copiar Link',
    },
    {
      title: 'Sinalizador de Local',
      description: 'Apareça no mapa com destaque para clientes que estão por perto.',
      icon: <MapPin className="size-6 text-emerald-500" />,
      action: 'Ver no Mapa',
    }
  ]

  return (
    <>
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Kit de Crescimento</h2>
            <p className="text-muted-foreground text-sm">Ferramentas para atrair mais clientes fora do portal.</p>
          </div>
          <div className="bg-primary/10 text-primary text-[10px] font-bold uppercase px-2 py-1 rounded-full">
            Merchant Tools
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group">
              <div className="size-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                {tool.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{tool.title}</h4>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{tool.description}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-[10px] font-bold rounded-lg border-dashed"
                  onClick={tool.onClick}
                >
                  <Download className="size-3 mr-1" />
                  {tool.action}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal de Seleção de Perfil */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Selecionar Empresa</h3>
                <p className="text-xs text-muted-foreground">Escolha qual QR Code deseja gerar</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile.slug)}
                  className="w-full flex items-center gap-4 p-3 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group text-left"
                >
                  <div className="size-10 rounded-xl bg-muted overflow-hidden border border-border">
                    {profile.image ? (
                      <img src={profile.image} alt={profile.name} className="size-full object-cover" />
                    ) : (
                      <div className="size-full flex items-center justify-center text-muted-foreground">
                        <QrCode className="size-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm leading-tight">{profile.name}</p>
                    <p className="text-[10px] text-muted-foreground">{profile.category}</p>
                  </div>
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Check className="size-4 text-primary" />
                  </div>
                </button>
              ))}
              {profiles.length === 0 && (
                <p className="text-center py-8 text-sm text-muted-foreground italic">Nenhuma empresa encontrada.</p>
              )}
            </div>

            <div className="p-6 bg-muted/30">
              <Button variant="outline" className="w-full rounded-2xl" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
