// ./delete-confirmation-modal.tsx
'use client'

import { Button } from '@/components/ui/button'
import { AlertTriangle, X } from 'lucide-react'

interface DeletePropertyModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  propertyName: string
}

export function DeletePropertyModal({
  isOpen,
  onClose,
  onConfirm,
  propertyName,
}: DeletePropertyModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Conteúdo do Modal */}
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-slate-100">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Confirmar Exclusão
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            title="Fechar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Corpo */}
        <div className="my-6">
          <p className="text-slate-600 dark:text-slate-300">
            Tem certeza que deseja excluir permanentemente o imóvel:
          </p>
          <p className="mt-2 font-semibold text-slate-800 dark:text-slate-100">
            &quot;{propertyName}&quot;?
          </p>
          <p className="mt-4 font-medium text-red-600 text-sm dark:text-red-400">
            Esta ação não pode ser desfeita.
          </p>
        </div>

        {/* Rodapé / Ações */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 text-white shadow-sm hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Sim, Excluir
          </Button>
        </div>
      </div>
    </div>
  )
}
