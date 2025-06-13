'use client'

import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'
import { toast } from 'sonner'

import type { AdminsProfileProps } from '@/_types/profile-data'
import { manageAdminToProfile } from '@/actions/manage-admins'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { RemoveAdminFromManagerProfile } from './delete'

interface Props {
  profileId: string
  admins: AdminsProfileProps[]
}

export function FormManage({ profileId, admins }: Props) {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newAdminUID, setNewAdminUID] = useState('')
  const [error, setError] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  function onClose() {
    setIsOpen(false)
  }

  async function handleAddAdmin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('profileId', profileId)
      formData.append('userUID', newAdminUID)

      await manageAdminToProfile(formData)
      toast.success('Redes sociais salvas com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar as redes sociais.')
      return false
    } finally {
      startTransition(() => {
        setIsSubmitting(false)
        onClose()

        router.refresh()
      })
    }

    setIsSubmitting(false)
    // onClose()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-8 font-bold text-3xl">Painel de Controle</h1>
      <section className="mb-8 flex w-full max-w-md flex-col rounded bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl">Administradores atuais do seu perfil</h2>
        {admins.length > 0 ? (
          <div>
            {admins.map((admin, index) => (
              <div
                key={String(index)}
                className="flex w-full items-center justify-between px-4 py-1 hover:bg-zinc-200"
              >
                <div>
                  <p>{admin.name}</p>
                  <p className="text-xs text-zinc-400">- {admin.email}</p>
                </div>
                <RemoveAdminFromManagerProfile adminUID={admin.userId} />
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhum administrador cadastrado.</p>
        )}
      </section>
      <section className="w-full max-w-md rounded bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl">Adicionar Administrador</h2>
        <form onSubmit={handleAddAdmin} className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="Digite o UID do novo administrador"
            value={newAdminUID}
            onChange={e => setNewAdminUID(e.target.value)}
          />
          <Button type="submit">Adicionar</Button>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </form>
      </section>
    </div>
  )
}
