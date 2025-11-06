'use client'

import NextLink from 'next/link'

import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'

export function HeroSection() {
  return (
    <section className="bg-linear-to-br from-blue-900 to-blue-700 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-6 font-bold text-4xl md:text-5xl">
          Conecte seu negócio com{' '}
          <span className="text-blue-200">milhares de clientes</span>
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-blue-100 text-xl">
          Plataforma completa para divulgação do seu estabelecimento comercial.
          Cadastre-se, seja encontrado e aumente suas vendas.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <NextLink href="/criar">
            <Button
              size="lg"
              className="bg-white font-semibold text-primary hover:cursor-pointer hover:bg-gray-100"
            >
              Começar Gratuitamente
            </Button>
          </NextLink>
          <Link
            variant="outline"
            href="/business/andrelino"
            size="lg"
            className="h-11 border-2 border-white px-8 font-semibold text-white hover:bg-white hover:text-primary"
          >
            Ver Como Fica Seu Perfil
          </Link>
        </div>
      </div>
    </section>
  )
}
