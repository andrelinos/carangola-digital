'use client'

import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'

interface Props {
  onClose?: () => void
  onSave?: () => void
  isSubmitting?: boolean
}

export function FooterEditModal({ onSave, onClose, isSubmitting }: Props) {
  return (
    <footer className="flex w-full justify-end gap-4 pt-6 text-base">
      <button
        type="button"
        className="font-bold hover:cursor-pointer"
        onClick={onClose}
      >
        Voltar
      </button>
      {onSave && (
        <Button
          onClick={onSave}
          disabled={isSubmitting}
          className="min-w-[120px] font-bold disabled:hover:cursor-not-allowed"
        >
          {isSubmitting ? <LoaderCircle className="animate-spin" /> : 'Salvar'}
        </Button>
      )}
    </footer>
  )
}
