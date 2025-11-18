import { createBusinessLink } from '@/actions/business/create-business-link'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { sanitizeLink } from '@/utils/sanitize-link'

import { useState, useTransition } from 'react'

interface Props {
  userId?: string
}

export function AddProfileModal({ userId }: Props) {
  const [isPending] = useTransition()
  const [link, setLink] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setError('')
    setLink(sanitizeLink(value))
  }

  async function formAction(formData: FormData) {
    try {
      setIsLoading(true)

      const nameValue = formData.get('name')
      const userIdValue = formData.get('targetUserId') ?? userId

      const name =
        typeof nameValue === 'string'
          ? nameValue.trim()
          : String(nameValue ?? '')
      const id =
        typeof userIdValue === 'string'
          ? userIdValue.trim()
          : String(userIdValue ?? '')

      if (!name) {
        throw new Error('O campo name é obrigatório')
      }

      console.log('DOIS :: ', name, link, id)

      await createBusinessLink({ name, link, userId: id })
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Criar Novo Perfil</Button>
        </DialogTrigger>
        <DialogContent className="mt-8">
          <DialogHeader>
            <DialogTitle>Criar Novo Perfil</DialogTitle>
          </DialogHeader>
          <form
            action={formAction}
            className="max-h-[90vh] overflow-y-auto py-8"
          >
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
      {isLoading && <Loading />}
    </div>
  )
}
