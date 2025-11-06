import { InfoCircle } from 'iconoir-react'
import { Phone, Search } from 'lucide-react'
import Link from 'next/link'

/*
================================================================================
COMPONENTE 4: Seção de Utilidade Pública
================================================================================
*/
const communityFeatures = [
  {
    title: 'Telefones Úteis',
    description:
      'Acesse rapidamente telefones de emergência, saúde e serviços públicos.',
    href: '/telefones-uteis',
    icon: Phone,
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Achados e Perdidos',
    description: 'Perdeu ou encontrou algo? Ajude a comunidade local.',
    href: '/achados-e-perdidos',
    icon: Search,
    color: 'text-green-600 dark:text-green-400',
  },
  {
    title: 'Como Funciona',
    description: 'Veja como é fácil encontrar ou anunciar em nossa plataforma.',
    href: '/como-funciona',
    icon: InfoCircle,
    color: 'text-yellow-600 dark:text-yellow-400',
  },
]

export function CommunityFeatures() {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-center font-bold text-3xl text-slate-900 dark:text-slate-100">
          Sua Central de Utilidade
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {communityFeatures.map(feature => (
            <div
              key={feature.title}
              className="rounded-lg bg-white p-6 text-center shadow-md dark:bg-slate-800"
            >
              <feature.icon
                className={`mx-auto mb-4 h-12 w-12 ${feature.color}`}
              />
              <h3 className="mb-2 font-semibold text-slate-900 text-xl dark:text-slate-100">
                {feature.title}
              </h3>
              <p className="mb-6 text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
              <Link
                href={feature.href}
                className="font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Acessar Agora &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
