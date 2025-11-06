'use client'

import { useState, useTransition } from 'react'

import { deleteProfile } from '@/actions/business/delete-profile.action'

import { transferProfile } from '@/actions/business/transfer-profile.action'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

import type { ProfileDataProps } from '@/_types/profile-data'
import type { Session } from 'next-auth'
import Link from 'next/link'
import { toast } from 'sonner'
import { AddProfileModal } from './add-profile-modal'

interface Props {
  properties: ProfileDataProps[]
  session: Session | null
}

export function PropertiesTable({ properties, session }: Props) {
  const [isPending, startTransition] = useTransition()
  const [selectedProfile, setSelectedProfile] =
    useState<ProfileDataProps | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [isTransferModalOpen, setTransferModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [newOwnerId, setNewOwnerId] = useState('')

  const handleTransferSubmit = () => {
    if (!selectedProfile || !newOwnerId) return
    setIsLoading(true)

    startTransition(async () => {
      const result = await transferProfile(
        selectedProfile?.id ?? '',
        selectedProfile.userId,
        newOwnerId
      )
      if (result.success) {
        toast.success(result.message)
        setTransferModalOpen(false)
        setNewOwnerId('')
      } else {
        toast.error(`Erro: ' ${result.message}`)
      }
    })
    setIsLoading(false)
  }

  const handleDeleteSubmit = () => {
    if (!selectedProfile) return
    setIsLoading(true)

    startTransition(async () => {
      const result = await deleteProfile(
        selectedProfile?.id ?? '',
        selectedProfile.userId
      )
      if (result.success) {
        alert(result.message)
        setDeleteModalOpen(false)
      } else {
        alert(`Erro: ${result.message}`)
      }
    })

    setIsLoading(false)
  }

  return (
    <div className="container">
      <div className="w-full ">
        <div className="flex items-end gap-4 py-4">
          <div className="flex-1">
            <Label htmlFor="search">Pesquisar</Label>
            <Input id="search" type="search" className="h-10" />
          </div>
          <AddProfileModal userId={session?.user.id} />
        </div>
        <div className="size-full max-h-[62vh] overflow-y-auto">
          <Table className="w-full rounded-md border">
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
              {properties.map(profile => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">
                    <Link href={`/business/${profile.slug}`} target="_blank">
                      {profile.id}
                    </Link>
                  </TableCell>
                  <TableCell>{profile.name}</TableCell>
                  <TableCell>{profile.userId}</TableCell>
                  <TableCell>
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <div className="flex flex-col gap-2">
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
                        className="text-rose-400"
                        onClick={() => {
                          setSelectedProfile(profile)
                          setDeleteModalOpen(true)
                        }}
                      >
                        Apagar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* --- MODAL DE TRANSFERÊNCIA --- */}
      <Dialog open={isTransferModalOpen} onOpenChange={setTransferModalOpen}>
        <DialogContent className="overflow-y-auto py-8">
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
    </div>
  )
}
