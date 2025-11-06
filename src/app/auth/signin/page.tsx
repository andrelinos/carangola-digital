import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { Loading } from '@/components/commons/loading'

import { authOptions } from '@/lib/auth'
import { ButtonProvider } from './components/button-provider'

export default async function SignIn() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="container mx-auto flex h-[calc(100vh-240px)] w-full flex-col items-center justify-center">
        <h2 className="font-semibold text-3xl">Olá, seja muito bem vindo!</h2>
        <div className="flex w-full flex-col items-center gap-6">
          <span className="pt-2">
            Para continuar, você precisa acessar sua conta
          </span>

          <h2 className="font-medium text-3xl text-muted-foreground">
            Acesse sua conta
          </h2>
          <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg border p-6">
            <h2 className="font-medium">Acesso via rede social</h2>

            <ButtonProvider title="Google" provider="google" />
          </div>
        </div>
      </div>
    </Suspense>
  )
}
