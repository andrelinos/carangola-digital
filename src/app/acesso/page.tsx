import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { Suspense } from 'react'

import { Loading } from '@/components/commons/loading'
import { authOptions } from '@/lib/auth'

import SignIn from '../auth/signin/page'

export default async function Login() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (user) {
    redirect('/dashboard')
  }

  return (
    <Suspense fallback={<Loading />}>
      <main className="flex min-h-[calc(100vh-526px)] w-full flex-col justify-between px-6 py-24">
        <div className="flex w-full flex-col items-center">
          {session ? (
            <h2 className="rounded-lg pb-8 text-center font-semibold text-2xl text-zinc-600 dark:text-gray-100">
              Olá {session.user.name}, seja muito bem vindo!
            </h2>
          ) : (
            <SignIn />
          )}
        </div>
      </main>
    </Suspense>
  )
}
