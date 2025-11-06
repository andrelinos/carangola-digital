'use client'

import type { PropertyProps } from '@/_types/property'
import { propertyUpdateStatus } from '@/actions/properties/property-update-status'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { FooterEditModal } from '@/components/commons/footer-edit-modal'
import { Modal } from '@/components/ui/custom-modal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

interface Props {
  data: PropertyProps | null
}

export function EditPropertyStatus({ data }: Props) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formValues, setFormValues] = useState<PropertyProps | null>(data)

  function handleOpenModal() {
    setIsOpen(true)
  }

  function onClose() {
    setIsOpen(false)
  }

  async function handleSavedForm() {
    setIsSubmitting(true)

    try {
      if (!formValues || !data) {
        throw Error
      }

      await propertyUpdateStatus({
        status: formValues.status,
        propertyId: data.id,
      })
    } catch {
      //
    } finally {
      setIsSubmitting(false)

      startTransition(() => {
        setIsSubmitting(false)
        router.refresh()
        onClose()
      })
    }
  }

  function handleChange(value: string) {
    setFormValues(prevState => {
      if (!prevState) return prevState
      return {
        ...prevState,
        status: value,
      }
    })
  }

  return (
    <>
      <ButtonForOwnerOnly handleExecute={handleOpenModal} title="status" />

      <Modal
        isOpen={isOpen}
        setIsOpen={onClose}
        title="Editar status"
        description="Informe o status da propriedade"
        classname="w-full max-w-lg justify-center border-[0.5px] border-blue-300 text-zinc-700 p-6 bg-white"
      >
        <Select
          name="status"
          value={formValues?.status}
          onValueChange={handleChange as any}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Disponível">Disponível</SelectItem>
            <SelectItem value="Vendido">Vendido</SelectItem>
            <SelectItem value="Alugado">Alugado</SelectItem>
            <SelectItem value="Reservado">Reservado</SelectItem>
          </SelectContent>
        </Select>
        <FooterEditModal
          onSave={handleSavedForm}
          onClose={onClose}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </>
  )
}
