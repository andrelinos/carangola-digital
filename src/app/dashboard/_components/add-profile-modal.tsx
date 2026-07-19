import Link from 'next/link'
import { useState, useTransition } from 'react'
import { createBusinessLink } from '@/actions/business/create-business-link'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { sanitizeLink } from '@/utils/sanitize-link'

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

      await createBusinessLink({ name, link, userId: id })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Criar Novo Perfil</Button>
        </DialogTrigger>
        <DialogContent className='flex max-h-[90vh] w-[95vw] flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-[425px]'>
          <div className='border-b px-6 py-5'>
            <DialogHeader>
              <DialogTitle className="text-xl">Criar Novo Perfil</DialogTitle>
              <DialogDescription>
                Preencha as informações básicas para registrar o perfil do
                negócio.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form action={formAction} className="flex flex-col overflow-hidden">
            <div className='flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6'>
              <div className="flex flex-col gap-3">
                <Label htmlFor="name" className='font-semibold text-sm'>
                  Nome do Negócio
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Padaria do João"
                  onChange={handleLinkChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-3">
                <Label
                  htmlFor="link"
                  className='flex items-center justify-between font-semibold text-sm'
                >
                  <span>Link para o negócio</span>
                  {link && (
                    <Link
                      href={`/business/${link}`}
                      target="_blank"
                      className='font-medium text-primary text-xs hover:underline'
                    >
                      Ver link gerado
                    </Link>
                  )}
                </Label>
                <Input
                  literalerror={error ? true : undefined}
                  id="link"
                  name="link"
                  value={link}
                  placeholder="padaria-do-joao"
                  onChange={handleLinkChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="targetUserId" className='font-semibold text-sm'>
                  ID do Usuário
                </Label>
                <Input
                  id="targetUserId"
                  name="targetUserId"
                  defaultValue={userId}
                  required
                />
                <span className='text-muted-foreground text-xs'>
                  Se você for o dono, não altere este campo.
                </span>
              </div>
            </div>

            <DialogFooter className='border-t bg-muted/40 px-6 py-4 sm:justify-end'>
              <Button
                className='w-full min-w-[140px] sm:w-auto'
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
