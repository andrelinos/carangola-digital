'use client'

import { Flash, MapPin, ProfileCircle } from 'iconoir-react'

export function BenefitsSection() {
  return (
    <section className="bg-gradient-to-br from-zinc-50 to-white py-20 ">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-bold text-3xl text-gray-900 md:text-4xl">
            Por que escolher o Carangola Digital?
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 text-lg">
            Ferramentas profissionais para destacar seu negócio e atrair mais
            clientes
          </p>
        </div>

        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex w-[228px] flex-col items-center gap-2 p-2">
            <span className="mb-3 flex size-14 items-center justify-center rounded-lg bg-blue-100">
              <Flash className="size-10 text-blue-800" />
            </span>
            <span className="font-semibold text-xl">Rápido de configurar</span>
            <p>Cadastre seu negócio em minutos e comece a receber clientes</p>
          </div>

          <div className="flex w-[228px] flex-col items-center gap-2 p-2">
            <span className="mb-3 flex size-14 items-center justify-center rounded-lg bg-green-100">
              <ProfileCircle className="size-10 text-green-800" />
            </span>
            <span className="font-semibold text-xl">Responsivo</span>
            <p>Seu perfil fica perfeito em qualquer dispositivo</p>
          </div>

          <div className="flex w-[228px] flex-col items-center gap-2 p-2">
            <span className="mb-3 flex size-14 items-center justify-center rounded-lg bg-yellow-100">
              <ProfileCircle className="size-10 text-yellow-800" />
            </span>
            <span className="font-semibold text-xl">Analytics Detalhado</span>
            <p>Acompanhe visualizações, cliques e engajamento</p>
          </div>

          <div className="flex w-[228px] flex-col items-center gap-2 p-2">
            <span className="mb-3 flex size-14 items-center justify-center rounded-lg bg-purple-100">
              <MapPin className="size-10 text-purple-600" />
            </span>
            <span className="font-semibold text-xl">Localização GPS</span>
            <p>Seus clientes terão a rota exata do seu estabelecimento</p>
          </div>
        </div>
      </div>
    </section>
  )
}
