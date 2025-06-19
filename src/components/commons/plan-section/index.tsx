import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { Check } from 'lucide-react'
import Link from 'next/link'

export function PricingPlans() {
  const plans = [
    {
      name: 'Grátis',
      price: 'R$ 0',
      period: 'Para sempre',
      popular: false,
      features: [
        'Perfil básico do estabelecimento',
        'Informações de contato',
        'Horário de funcionamento',
        'Links para 2 redes sociais',
      ],
      buttonText: 'Começar Grátis',
      buttonVariant: 'outline' as const,
      cardClass: 'bg-gray-50 border-gray-200',
    },

    {
      name: 'Pro',
      price: 'R$ 49,99',
      period: 'por ano',
      popular: true,
      features: [
        'Tudo do plano Básico',
        'Galeria com até 15 fotos',
        'Cupons e promoções QR',
        'Cardápio/catálogo digital',
        'Analytics e relatórios',
        'Prioridade no suporte',
      ],
      buttonText: 'Escolher Pro',
      buttonVariant: 'default' as const,
      cardClass:
        'bg-gradient-to-br from-gray-900 lg:-top-6 shadow-3xl to-gray-800 text-white',
    },
    {
      name: 'Básico',
      price: 'R$ 4,99',
      period: 'por mês',
      popular: false,
      features: [
        'Tudo do plano Grátis',
        'Galeria com até 5 fotos',
        'Sistema de avaliações',
        'Links para todas as redes sociais',
        'Botão de compartilhamento',
      ],
      buttonText: 'Escolher Básico',
      buttonVariant: 'default' as const,
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
            <Card key={plan.name} className={`relative ${plan.cardClass}`}>
              {plan.popular && (
                <div className="-top-4 -translate-x-1/2 absolute left-1/2 transform">
                  <span className="rounded-full bg-primary px-4 py-1 font-semibold text-sm text-white">
                    Mais Popular
                  </span>
                </div>
              )}

              <CardContent className="p-8">
                <div className="mb-8 text-center">
                  <h3
                    className={`mb-2 font-bold text-2xl ${plan.name === 'Pro' ? 'text-white' : 'text-gray-900'}`}
                  >
                    {plan.name}
                  </h3>
                  <div
                    className={`mb-1 font-bold text-4xl ${
                      plan.name === 'Pro'
                        ? 'text-white'
                        : plan.name === 'Basic'
                          ? 'text-primary'
                          : 'text-gray-900'
                    }`}
                  >
                    {plan.price}
                  </div>
                  <p
                    className={
                      plan.name === 'Pro' ? 'text-gray-300' : 'text-gray-600'
                    }
                  >
                    {plan.period}
                  </p>
                </div>

                <ul className="mb-8 space-y-4">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-center">
                      <Check className="mr-3 h-5 w-5 flex-shrink-0 text-secondary" />
                      <span
                        className={
                          plan.name === 'Pro' ? 'text-white' : 'text-gray-700'
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.name === 'Grátis' ? '/criar' : ''}>
                  <Button
                    className={`w-full ${
                      plan.name === 'Grátis'
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-800'
                        : plan.name === 'Pro'
                          ? 'bg-white text-gray-900 hover:bg-gray-100'
                          : 'bg-primary text-white hover:bg-blue-700'
                    }`}
                    disabled={plan.name !== 'Grátis'}
                    variant={plan.buttonVariant}
                  >
                    {plan.name === 'Grátis' ? plan.buttonText : 'Em breve...'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
