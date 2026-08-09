import { redirect, notFound } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import { authOptions } from '@/lib/auth'
import type { ServiceListing } from '@/_types/service-listing'
import { Button } from '@/components/ui/button'
import { ServiceForm } from '../_components/service-form'

interface EditServicePageProps {
  params: Promise<{ id: string }>
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/acesso')

  const { id } = await params

  const doc = await db.collection('service-listings').doc(id).get()

  if (!doc.exists) notFound()

  const service = { ...doc.data(), id: doc.id } as ServiceListing

  // Ownership guard
  if (service.userId !== session.user.id) {
    redirect('/dashboard/servicos')
  }

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
            Editar Serviço
          </h1>
          <p className="text-muted-foreground text-sm">
            Atualize as informações do seu serviço.
          </p>
        </div>
      </div>

      <ServiceForm initialData={service} />
    </div>
  )
}
