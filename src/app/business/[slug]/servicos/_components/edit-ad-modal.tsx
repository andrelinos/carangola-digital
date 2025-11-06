// src/components/modals/EditPropertyModal.tsx
'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'

interface EditPropertyModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode // Aqui é onde o <Input>, <Textarea>, etc. entrará
  onSave: () => Promise<void> // Função assíncrona para salvar
  isSaving: boolean
}

export function EditPropertyModal({
  isOpen,
  onOpenChange,
  title,
  children,
  onSave,
  isSaving,
}: EditPropertyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* O conteúdo (formulário) é injetado aqui */}
        <div className="py-4">{children}</div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={isSaving}>
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
