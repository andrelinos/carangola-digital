'use client'

import type { PropertyProps } from '@/_types/property'
import { propertyUpdatePrice } from '@/actions/properties/property-update-price'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { FooterEditModal } from '@/components/commons/footer-edit-modal'
import { Modal } from '@/components/ui/custom-modal'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

interface Props {
  data: PropertyProps | null
}

export function EditPropertyPrice({ data }: Props) {
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

      await propertyUpdatePrice({
        price: String(formValues.price),
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

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = event.target

    const finalValue =
      type === 'checkbox' && event.target instanceof HTMLInputElement
        ? event.target.checked
        : value

    setFormValues(prevState => {
      if (!prevState) return prevState
      return {
        ...prevState,
        [name]: finalValue,
      }
    })
  }

  return (
    <>
      <ButtonForOwnerOnly handleExecute={handleOpenModal} title="valor" />

      <Modal
        isOpen={isOpen}
        setIsOpen={onClose}
        title="Editar valor"
        description="Informe o valor relacionado"
        classname="w-full max-w-lg justify-center border-[0.5px] border-blue-300 text-zinc-700 p-6 bg-white"
      >
        <Input
          variant="default"
          name="price"
          type="number"
          title="Título da propriedade"
          placeholder="35.000,00"
          maxLength={150}
          value={formValues?.price}
          onChange={handleChange}
          className="w-full"
        />
        <FooterEditModal
          onSave={handleSavedForm}
          onClose={onClose}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </>
  )
}
