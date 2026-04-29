'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Camera, Loader2, Save, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateUserProfile } from '@/actions/user/update-user-profile'

import { compressImage } from '@/utils/compress-image'

interface ProfileFormProps {
  initialName?: string
  initialImage?: string
}

export function ProfileForm({ initialName, initialImage }: ProfileFormProps) {
  const { update } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(initialName || '')
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage || null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('name', name)
    
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
        // Atualiza a sessão no client para refletir imediatamente no header
        await update({ name }) 
        router.refresh()
      } else {
        setMessage({ type: 'error', text: result.error || 'Erro ao atualizar perfil.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ocorreu um erro inesperado.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-xl">
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
        <div className="relative group">
          <div className="size-32 rounded-full overflow-hidden border-4 border-slate-100 bg-slate-100 dark:border-slate-800 dark:bg-slate-800 shadow-sm relative">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <User className="size-12 opacity-50" />
              </div>
            )}
            
            <div 
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="text-white size-6" />
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="mt-3 text-center sm:hidden">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
            >
              Trocar foto
            </Button>
          </div>
        </div>

        <div className="flex-1 w-full space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Nome Completo
            </Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="mt-1.5"
              required
            />
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
          {message.text}
        </div>
      )}

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto shadow-lg shadow-primary/20">
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
