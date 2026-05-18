'use client'

import { Camera, Loader2, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useRef, useState, useEffect } from 'react'
import { updateUserProfile } from '@/actions/user/update-user-profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { compressImage } from '@/utils/compress-image'

interface ProfileFormProps {
  initialName: string | null | undefined
  initialImage: string
}

export function ProfileForm({ initialName, initialImage }: ProfileFormProps) {
  const { update } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(initialName)
  const [imagePreview, setImagePreview] = useState<string | ''>(initialImage)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Limpa a URL do blob quando o componente é desmontado para evitar vazamento de memória
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('name', name || 'Usuario')

    if (selectedFile) {
      const compressedImage = await compressImage(selectedFile, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 500,
      })
      formData.append('image', compressedImage || selectedFile)
    }

    try {
      const result = await updateUserProfile(formData)

      if (result.success) {
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
        // Atualiza a sessão no client. Se sua API retornar a nova URL da imagem,
        // adicione-a aqui: await update({ name, image: result.newImageUrl })
        await update({ name })
        router.refresh()
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Erro ao atualizar perfil.',
        })
      }
    } catch (_error) {
      setMessage({ type: 'error', text: 'Ocorreu um erro inesperado.' })
    } finally {
      setIsLoading(false)
    }
  }



  // Define qual imagem será exibida (Preview > Padrão)
  const displayImage = imagePreview

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-8">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="group relative">
          <div className="relative size-32 overflow-hidden rounded-full border-4 border-slate-100 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-800">
            <img
              src={displayImage}
              alt={`Foto de perfil de ${name}`}
              className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
            />

            {/* Overlay com botão acessível */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Alterar foto de perfil"
              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
              onClick={triggerFileInput}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  triggerFileInput()
                }
              }}
            >
              <Camera className="size-6 text-white" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
            aria-hidden="true"
          />
          <div className="mt-3 text-center sm:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={triggerFileInput}
            >
              Trocar foto
            </Button>
          </div>
        </div>

        <div className="w-full flex-1 space-y-4">
          <div>
            <Label
              htmlFor="name"
              className="font-semibold text-slate-700 text-sm dark:text-slate-300"
            >
              Nome Completo
            </Label>
            <Input
              id="name"
              value={name || ''}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome"
              className="mt-1.5"
              required
            />
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-xl p-4 font-medium text-sm ${message.type === 'success'
            ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex justify-end border-slate-100 border-t pt-4 dark:border-slate-800">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full shadow-lg shadow-primary/20 sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </form>
  )
}