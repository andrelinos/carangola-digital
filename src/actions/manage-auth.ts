'use server'

import { redirect } from 'next/navigation'

export async function manageAuth(formData: FormData) {
  const mode = String(formData.get('mode') || 'signin')

  if (mode === 'signout') {
    return redirect('/api/auth/signout?callbackUrl=/')
  }

  return redirect('/acesso')
}
