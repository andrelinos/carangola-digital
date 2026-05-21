import clsx from 'clsx'
import { Check, X } from 'lucide-react'
import { getServerSession } from 'next-auth/next'
import { PurchaseButtons } from '@/app/business/[slug]/compre/components/purchase-buttons'
import { verifyAdmin } from '@/app/server/verify-admin.server'
import { Card, CardContent } from '@/components/ui/card'
import { plansBusinessConfig } from '@/configs/plans-business'
import { authOptions } from '@/lib/auth'
import { formatPrice } from '@/utils/format-price'

export async function PricingPlans() {
  const session = await getServerSession(authOptions)
  const _user = session?.user
  const isAdmin = await verifyAdmin()

  const plans = [
    {
      id: 'free',
      name: plansBusinessConfig.free.title,
      price: plansBusinessConfig.free.price,
      period: 'Para sempre',
      popular: plansBusinessConfig.free.popular,
      disable: false,
      buttonText: 'Começar Grátis',
      buttonVariant: 'outline' as const,
      cardClass: 'bg-gray-50 border-gray-200',
      features: [
        { name: 'Perfil básico do estabelecimento', included: true },
        { name: `${plansBusinessConfig.free.addresses.quantity} Endereços`, included: true },
        { name: `${plansBusinessConfig.free.businessPhones.quantity} Telefones/Whatsapp`, included: true },
        { name: 'Informações de contato e horário', included: true },
        { name: 'Rota de localização no Google Maps', included: true },
      ],
    },
    {
      id: 'basic',
      name: plansBusinessConfig.basic.title,
      price: plansBusinessConfig.basic.price,
      period: 'por ano',
      popular: plansBusinessConfig.basic.popular,
      disable: false,
      buttonText: `Escolher ${plansBusinessConfig.basic.title}`,
      buttonVariant: 'default' as const,
      cardClass: 'bg-gradient-to-br from-gray-900 shadow-3xl to-gray-800 text-white',
      features: [
        { name: `${plansBusinessConfig.basic.addresses.quantity} Endereços`, included: true },
        { name: `${plansBusinessConfig.basic.businessPhones.quantity} Telefones / WhatsApp`, included: true },
        { name: 'Links para todas as redes sociais', included: true },
        { name: 'Galeria de Fotos', included: false },
        { name: 'Destaque no Topo das Buscas', included: false },
        { name: 'Selo de Empresa Verificada', included: false },
        { name: 'Página sem Concorrentes', included: false },
        { name: 'Botão de Contato Fixo', included: false },
        { name: 'Painel de Métricas', included: false },
      ],
    },
    {
      id: 'pro',
      name: plansBusinessConfig.pro.title,
      price: plansBusinessConfig.pro.price,
      period: 'por ano',
      popular: plansBusinessConfig.pro.popular,
      disable: false,
      buttonText: `Escolher ${plansBusinessConfig.pro.title}`,
      buttonVariant: 'secondary' as const,
      cardClass: 'bg-white border-2 border-primary shadow-lg',
      features: [
        {
          name: 'Destaque no Topo das Buscas',
          included: plansBusinessConfig.pro.premiumFeatures?.prioritySearch ?? true
        },
        {
          name: 'Selo de Empresa Verificada',
          included: plansBusinessConfig.pro.premiumFeatures?.verifiedBadge ?? true
        },
        {
          name: 'Página sem Concorrentes',
          included: plansBusinessConfig.pro.premiumFeatures?.hideCompetitors ?? true
        },
        {
          name: `Até ${plansBusinessConfig.pro.imageGallery?.limit || 10} Fotos na Galeria`,
          included: true
        },
        {
          name: 'Botão de Contato Fixo',
          included: plansBusinessConfig.pro.premiumFeatures?.stickyCta ?? true
        },
        {
          name: 'Painel de Métricas',
          included: plansBusinessConfig.pro.premiumFeatures?.analytics ?? true
        },
        { name: `${plansBusinessConfig.pro.addresses.quantity} Endereços`, included: true },
        { name: `${plansBusinessConfig.pro.businessPhones.quantity} Telefones / WhatsApp`, included: true },
        { name: '19 Links de Redes Sociais', included: true },
      ],
    },
  ]

  return (
    <section id="plan" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-bold text-3xl text-gray-900 md:text-4xl">
            Escolha o plano ideal para seu negócio
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 text-lg">
            Desde perfis básicos até recursos avançados de marketing e análise
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {plans.map((plan, _index) => (
            <Card
              key={plan.name}
              className={clsx(`relative ${plan.cardClass}`, {
                'lg:-top-6': plan.popular,
              })}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                  <span className="rounded-full bg-primary px-4 py-1 font-semibold text-sm">
                    Mais Popular
                  </span>
                </div>
              )}

              <CardContent className="p-8">
                <div className="mb-8 text-center">
                  <h3 className="mb-2 font-bold text-2xl">{plan.name}</h3>
                  <div className="mb-1 font-bold text-4xl">
                    {formatPrice(plan.price)}
                  </div>
                  <p className="text-sm opacity-80">{plan.period}</p>
                </div>

                <ul className="mb-8 space-y-4">
                  {plan.features.map(feature => (
                    <li
                      key={feature.name}
                      className={clsx('flex items-center', {
                        'opacity-50': !feature.included,
                      })}
                    >
                      {feature.included ? (
                        <Check className={clsx(
                          'mr-3 h-5 w-5 shrink-0',
                          plan.id === 'basic' ? 'text-green-400' : 'text-green-500'
                        )} />
                      ) : (
                        <X className="mr-3 h-5 w-5 shrink-0 text-current" />
                      )}
                      <span className={clsx('text-sm md:text-base', {
                        'line-through': !feature.included
                      })}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <PurchaseButtons
                  profileId={session?.user.myProfileLink}
                  user={session?.user}
                  plan={plan as any}
                  isAdmin={isAdmin}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}