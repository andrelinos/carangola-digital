import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { ServiceForm } from '../_components/service-form'

export default async function NewServicePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/acesso')

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="h-9 w-9">
          <Link href="/dashboard/servicos">
            <ArrowLeft className="size-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div>
          <h1 className="font-bold text-foreground text-2xl tracking-tight">
            Novo Serviço
          </h1>
          <p className="text-muted-foreground text-sm">
            Preencha as informações do serviço que você oferece.
          </p>
        </div>
      </div>

      <ServiceForm />
    </div>
  )
}
