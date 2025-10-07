// /app/admin/dashboard/_components/profiles-table.tsx
'use client'

import { useState, useTransition } from 'react'

import { createProfileForUser } from '@/actions/create-profile-for-user'
import { deleteProfile } from '@/actions/delete-profile.action'

import { transferProfile } from '@/actions/transfer-profile.action'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { sanitizeLink } from '@/lib/utils'
import type { Session } from 'next-auth'
import Link from 'next/link'
import { useFormState } from 'react-dom'

// Tipagem para os perfis recebidos
type Profile = {
  id: string
  name: string
  userId: string
  createdAt: number
}

interface Props {
  profiles: Profile[]
  session: Session | null
}

export function ProfilesTable({ profiles, session }: Props) {
  const [isPending, startTransition] = useTransition()
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)

  // Estados para os modais
  const [isTransferModalOpen, setTransferModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [newOwnerId, setNewOwnerId] = useState('')

  const [link, setLink] = useState('')
  const [error, setError] = useState('')
  const [primaryUserId, setPrimaryUserId] = useState('')

  const userId = session?.user?.id

  const handleTransferSubmit = () => {
    if (!selectedProfile || !newOwnerId) return

    startTransition(async () => {
      const result = await transferProfile(
        selectedProfile.id,
        selectedProfile.userId,
        newOwnerId
      )
      if (result.success) {
        alert(result.message) // Substitua por um toast/notificação
        setTransferModalOpen(false)
        setNewOwnerId('')
      } else {
        alert(`Erro: ' ${result.message}`)
      }
    })
  }

  const handleDeleteSubmit = () => {
    if (!selectedProfile) return

    startTransition(async () => {
      const result = await deleteProfile(
        selectedProfile.id,
        selectedProfile.userId
      )
      if (result.success) {
        alert(result.message) // Substitua por um toast/notificação
        setDeleteModalOpen(false)
      } else {
        alert(`Erro: ${result.message}`)
      }
    })
  }

  // const [state, formAction] = useFormState(createProfileForUser, initialState);

  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setError('')
    setLink(sanitizeLink(value))
  }

  async function formAction(formData: FormData) {
    await createProfileForUser(formData)
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        {/* --- MODAL DE CRIAÇÃO --- */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Criar Novo Perfil</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Perfil</DialogTitle>
            </DialogHeader>
            <form action={formAction}>
              <div className="flex w-full flex-col gap-2">
                <div className="flex w-full flex-col items-start gap-2">
                  <Label htmlFor="name" className="mt-4 font-semibold">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nome do estabelecimento"
                    className="col-span-3"
                    onChange={handleLinkChange}
                    required
                  />
                </div>
                <div className="flex w-full flex-col items-start gap-2">
                  <Label htmlFor="link" className="mt-4 font-semibold">
                    Link para o negócio
                  </Label>
                  <Input
                    literalerror={!!error}
                    id="link"
                    name="link"
                    value={link}
                    placeholder="nome..."
                    className="col-span-3"
                    onChange={handleLinkChange}
                    required
                  />
                </div>

                <div className="flex w-full flex-col items-start gap-2">
                  <Label htmlFor="targetUserId" className="mt-4 font-semibold">
                    ID do Usuário
                  </Label>
                  <Input
                    id="targetUserId"
                    name="targetUserId"
                    className="col-span-3"
                    defaultValue={userId}
                    required
                  />
                </div>
              </div>
              <DialogFooter className="p-4">
                <Button
                  className="w-full max-w-xs"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? 'Criando...' : 'Criar Perfil'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Link (ID)</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Dono (User ID)</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map(profile => (
              <TableRow key={profile.id}>
                <TableCell className="font-medium">
                  <Link href={`/${profile.id}`} target="_blank">
                    {profile.id}
                  </Link>
                </TableCell>
                <TableCell>{profile.name}</TableCell>
                <TableCell>{profile.userId}</TableCell>
                <TableCell>
                  {new Date(profile.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedProfile(profile)
                      setTransferModalOpen(true)
                    }}
                  >
                    Transferir
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedProfile(profile)
                      setDeleteModalOpen(true)
                    }}
                  >
                    Apagar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- MODAL DE TRANSFERÊNCIA --- */}
      <Dialog open={isTransferModalOpen} onOpenChange={setTransferModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transferir Perfil "{selectedProfile?.id}"</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Dono atual:{' '}
              <code className="rounded bg-muted p-1">
                {selectedProfile?.userId}
              </code>
            </p>
            <Label htmlFor="newOwnerId" className="mt-4 block">
              ID do Novo Dono
            </Label>
            <Input
              id="newOwnerId"
              value={newOwnerId}
              onChange={e => setNewOwnerId(e.target.value)}
              placeholder="Cole o ID do usuário de destino aqui"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancelar</Button>
            </DialogClose>
            <Button
              onClick={handleTransferSubmit}
              disabled={isPending || !newOwnerId}
            >
              {isPending ? 'Transferindo...' : 'Confirmar Transferência'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL DE CONFIRMAÇÃO PARA APAGAR --- */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p>
            Você tem certeza que deseja apagar o perfil{' '}
            <strong>{selectedProfile?.id}</strong>?
            <br />
            Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancelar</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDeleteSubmit}
              disabled={isPending}
            >
              {isPending ? 'Apagando...' : 'Sim, apagar perfil'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
