'use client'

import {
  Camera,
  CheckCircle2,
  Loader2,
  Save,
  User,
  XCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'

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

  const [name, setName] = useState(initialName ?? '')
  const [imagePreview, setImagePreview] = useState(initialImage)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const triggerFileInput = () => fileInputRef.current?.click()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name?.trim()) {
      setMessage({ type: 'error', text: 'O nome não pode ficar em branco.' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('name', name.trim())

    if (selectedFile) {
      try {
        const compressed = await compressImage(selectedFile, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 500,
        })
        formData.append('image', compressed || selectedFile)
      } catch {
        formData.append('image', selectedFile)
      }
    }

    try {
      const result = await updateUserProfile(formData)

      if (result.success) {
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
        await update({ name: name.trim() })
        setSelectedFile(null)
        router.refresh()
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Erro ao atualizar perfil.',
        })
      }
    } catch {
      setMessage({ type: 'error', text: 'Ocorreu um erro inesperado.' })
    } finally {
      setIsLoading(false)
    }
  }

  const hasChanges =
    name?.trim() !== (initialName ?? '').trim() || selectedFile !== null

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Avatar section */}
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <div className="relative size-36 overflow-hidden rounded-[2rem] border-4 border-white bg-slate-100 shadow-xl ring-2 ring-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:ring-slate-700">
            <img
              src={imagePreview}
              alt={`Foto de ${name || 'usuário'}`}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
            {/* Camera overlay */}
            <button
              type="button"
              aria-label="Alterar foto de perfil"
              onClick={triggerFileInput}
              className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity hover:opacity-100 focus:opacity-100"
            >
              <Camera className="size-6 text-white" />
              <span className="font-bold text-[10px] text-white uppercase tracking-wider">
                Alterar
              </span>
            </button>
          </div>

          {/* "new photo" indicator dot */}
          {selectedFile && (
            <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900">
              <Camera className="size-3 text-white" />
            </span>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
            aria-hidden="true"
          />
        </div>

        {/* Name + caption */}
        <div className="flex w-full flex-col gap-5">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <User className="size-4 text-slate-400" />
              <Label
                htmlFor="name"
                className="font-black text-[10px] text-slate-500 uppercase tracking-widest dark:text-slate-400"
              >
                Nome de Exibição
              </Label>
            </div>
            <Input
              id="name"
              value={name ?? ''}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome completo"
              className="h-12 rounded-2xl border-slate-200 bg-slate-50 font-medium text-slate-900 shadow-sm transition-all focus:border-blue-400 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
              maxLength={80}
            />
            <p className="mt-1.5 ml-1 font-medium text-[11px] text-slate-400">
              Este é o nome que outros usuários verão na plataforma.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <p className="font-black text-[10px] text-slate-400 uppercase tracking-widest dark:text-slate-500">
              Foto de Perfil
            </p>
            <p className="mt-1 font-medium text-slate-500 text-sm dark:text-slate-400">
              Clique na foto para substituí-la. Formatos aceitos: JPG, PNG,
              WEBP. Tamanho máximo recomendado: 2 MB.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={triggerFileInput}
              className="mt-3 rounded-xl border-slate-200 font-bold text-xs dark:border-slate-700"
            >
              <Camera className="mr-1.5 size-3.5" />
              Escolher nova foto
            </Button>
          </div>
        </div>
      </div>

      {/* Feedback message */}
      {message && (
        <div
          className={`flex items-center gap-3 rounded-2xl p-4 font-medium text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="size-5 shrink-0" />
          ) : (
            <XCircle className="size-5 shrink-0" />
          )}
          {message.text}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-slate-100 border-t pt-6 dark:border-slate-800">
        {hasChanges ? (
          <p className="font-medium text-[11px] text-amber-600 dark:text-amber-400">
            ● Você tem alterações não salvas
          </p>
        ) : (
          <p className="font-medium text-[11px] text-slate-400">
            Nenhuma alteração pendente
          </p>
        )}
        <Button
          type="submit"
          disabled={isLoading || !hasChanges}
          className="h-11 rounded-2xl px-6 font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all disabled:opacity-40"
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
