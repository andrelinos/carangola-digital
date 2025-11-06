import { PurchaseButtons } from '@/app/business/[slug]/compre/components/purchase-buttons'
import { Card, CardContent } from '@/components/ui/card'
import { authOptions } from '@/lib/auth'
import { formatPrice } from '@/utils/format-price'
import clsx from 'clsx'

import { Check } from 'lucide-react'
import { getServerSession } from 'next-auth/next'

export async function PricingPlans() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  const plans = [
    {
      id: 'free',
      name: 'Grátis',
      price: 0,
      period: 'Para sempre',
      popular: false,
      disable: false,
      features: [
        'Perfil básico do estabelecimento',
        'Informações de contato',
        'Horário de funcionamento',
        'Links para 2 redes sociais',
        '2 Telefones/Whatsapp',
        'Rota de localização no Google Maps',
      ],
      buttonText: 'Começar Grátis',
      buttonVariant: 'outline' as const,
      cardClass: 'bg-gray-50 border-gray-200',
    },
    {
      id: 'basic',
      name: 'Básico',
      price: 25,
      period: 'por mês',
      popular: true,
      disable: false,
      features: [
        'Tudo do plano Grátis',
        'Links para todas as redes sociais',
        'Até 15 telefones/whatsapp',
        'Botão de compartilhamento',
        'Suporte técnico',
      ],
      buttonText: 'Escolher Básico',
      buttonVariant: 'default' as const,
      cardClass:
        'bg-gradient-to-br from-gray-900  shadow-3xl to-gray-800 text-white',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 49.99,
      period: 'por ano',
      popular: false,
      disable: false,
      features: [
        'Tudo do plano Básico',
        'Galeria com até 15 fotos',
        'Cupons e promoções QR',
        'Cardápio/catálogo digital',
        'Analytics e relatórios',
        'Prioridade no suporte',
      ],
      buttonText: 'Em breve...',
      buttonVariant: 'secondary' as const,
      cardClass: 'bg-white border-2 border-primary shadow-lg',
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
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={clsx(`relative ${plan.cardClass}`, {
                'lg:-top-6': plan.popular,
              })}
            >
              {plan.popular && (
                <div className="-top-4 -translate-x-1/2 absolute left-1/2 transform">
                  <span className="rounded-full bg-primary px-4 py-1 font-semibold text-sm">
                    Mais Popular
                  </span>
                </div>
              )}

              <CardContent className="p-8">
                <div className="mb-8 text-center">
                  <h3 className={'mb-2 font-bold text-2xl'}>{plan.name}</h3>
                  <div className={'mb-1 font-bold text-4xl'}>
                    {formatPrice(plan.price)}
                  </div>
                  <p>{plan.period}</p>
                </div>

                <ul className="mb-8 space-y-4">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-center">
                      <Check className="mr-3 h-5 w-5 flex-shrink-0 text-current" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <PurchaseButtons
                  profileId={session?.user.myProfileLink}
                  user={session?.user}
                  plan={plan}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
