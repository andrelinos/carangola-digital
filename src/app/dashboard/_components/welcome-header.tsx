'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Plus, Store, Building2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function WelcomeHeader() {
  const { data: session } = useSession()
  const displayName = session?.user?.name || session?.user?.email || 'Visitante'

  console.log("displayName", session?.user)

  const today = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Olá, {displayName}! 👋
        </h1>
        <p className="text-muted-foreground flex items-center gap-2 mt-1 lowercase first-letter:uppercase">
          <Calendar className="size-4" />
          {today}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button asChild variant="outline" className="rounded-xl border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all">
          <Link href="/dashboard/business" className="flex items-center gap-2">
            <Plus className="size-4" />
            <Store className="size-4 text-primary" />
            <span>Novo Negócio</span>
          </Link>
        </Button>
        <Button asChild className="rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
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
