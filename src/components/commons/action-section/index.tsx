'use client'

import NextLink from 'next/link'

import { Button } from '@/components/ui/button'

export function ActionSection() {
  return (
    <section className="bg-linear-to-br from-blue-700 to-blue-800 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-6 font-bold text-4xl md:text-5xl">
          Pronto para destacar seu negócio?
        </h1>

        <p className="mx-auto mb-8 max-w-3xl text-blue-100 text-xl">
          Faça como vários estabelecimentos da cidade que estão se destacando ao
          utilizarem nossa plataforma
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <NextLink href="/criar">
            <Button
              size="lg"
              className="bg-blue-100 font-semibold text-primary hover:cursor-pointer hover:bg-gray-100"
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
              variant="outline"
              className="h-11 border-2 border-white px-8 font-semibold text-white hover:cursor-pointer hover:bg-white hover:text-primary"
            >
              Falar com um especialista
            </Button>
          </NextLink>
        </div>
      </div>
    </section>
  )
}
