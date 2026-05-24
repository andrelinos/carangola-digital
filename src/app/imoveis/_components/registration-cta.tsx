'use client'

import { Home, Key, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import { manageAuth } from '@/actions/manage-auth'
import { Button } from '@/components/ui/button'

interface RegistrationCTAProps {
  hasSession: boolean;
}

export function RegistrationCTA({ hasSession }: RegistrationCTAProps) {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-16 text-primary-foreground shadow-2xl lg:px-24 lg:py-24">
        {/* Background design elements */}
        <div className="absolute -top-24 -right-24 size-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-black/10 blur-3xl" />

        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <h2 className="font-bold text-3xl lg:text-5xl lg:leading-tight">
              Anuncie seu imóvel com facilidade!
            </h2>
            <p className="mt-6 max-w-xl text-lg text-primary-foreground/80 lg:text-xl">
              Alcance milhares de pessoas que buscam imóveis em Carangola todos os dias. Alugue ou venda mais rápido.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
                <TrendingUp className="size-5" />
                <span className="font-medium text-sm">Mais Visibilidade</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Users className="size-5" />
                <span className="font-medium text-sm">Contatos Diretos</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Key className="size-5" />
                <span className="font-medium text-sm">Gestão Descomplicada</span>
              </div>
            </div>

            <div className="mt-12">
              {hasSession ? (
                <Button
                  asChild
                  size="lg"
                  className="h-16 rounded-2xl bg-white px-10 font-bold text-primary text-xl shadow-xl transition-all hover:scale-105 hover:bg-zinc-100 active:scale-95"
                >
                  <Link href="/dashboard/imoveis">Anunciar agora gratuitamente</Link>
                </Button>
              ) : (
                <form action={manageAuth}>
                  <Button
                    size="lg"
                    className="h-16 rounded-2xl bg-white px-10 font-bold text-primary text-xl shadow-xl transition-all hover:scale-105 hover:bg-zinc-100 active:scale-95"
                  >
                    Anunciar agora gratuitamente
                  </Button>
                </form>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative mx-auto size-[400px] rounded-full border-8 border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
              <div className="flex size-full items-center justify-center rounded-full bg-white p-12 shadow-inner">
                <Home className="size-32 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
