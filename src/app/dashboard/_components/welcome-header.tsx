'use client'

import { Building2, Calendar, Plus, Store } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function WelcomeHeader() {
  const { data: session } = useSession()
  const displayName = session?.user?.name || session?.user?.email || 'Visitante'

  console.log('displayName', session?.user)

  const today = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  return (
    <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="font-bold text-3xl text-foreground tracking-tight">
          Olá, {displayName}! 👋
        </h1>
        <p className="mt-1 flex items-center gap-2 text-muted-foreground lowercase first-letter:uppercase">
          <Calendar className="size-4" />
          {today}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          asChild
          variant="outline"
          className="rounded-xl border-2 border-dashed transition-all hover:border-primary/50 hover:bg-primary/5"
        >
          <Link href="/dashboard/business" className="flex items-center gap-2">
            <Plus className="size-4" />
            <Store className="size-4 text-primary" />
            <span>Novo Negócio</span>
          </Link>
        </Button>
        <Button
          asChild
          className="rounded-xl shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30"
        >
          <Link href="/dashboard/imoveis" className="flex items-center gap-2">
            <Plus className="size-4" />
            <Building2 className="size-4" />
            <span>Anunciar Imóvel</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
