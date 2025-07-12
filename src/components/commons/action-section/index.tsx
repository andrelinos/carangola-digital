'use client'

import NextLink from 'next/link'

import { Button } from '@/components/ui/button'

export function ActionSection() {
  return (
    <section className="bg-gradient-to-br from-primary to-blue-700 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-6 font-bold text-4xl md:text-5xl">
          Pronto para destacar seu negócio?
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-blue-100 text-xl">
          Junte-se a milhares de estabelecimentos que já utilizam nossa
          plataforma
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
          <NextLink
            href="https://instagram.com/carangoladigital"
            target="_blank"
          >
            <Button
              size="lg"
              className="bg-white font-semibold text-primary hover:cursor-pointer hover:bg-gray-100"
            >
              Falar com um especialista
            </Button>
          </NextLink>
        </div>
      </div>
    </section>
  )
}
