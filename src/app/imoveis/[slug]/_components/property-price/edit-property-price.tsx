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

  const [displayPrice, setDisplayPrice] = useState(() => {
    if (data?.price) {
      const inReais = Number(data.price) / 100
      return inReais.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    }
    return ''
  })

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
        price: formValues.price,
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

  function handlePriceChange(event: React.ChangeEvent<HTMLInputElement>) {
    const onlyDigits = event.target.value.replace(/\D/g, '')

    if (!onlyDigits) {
      setDisplayPrice('')
      setFormValues(prev =>
        prev
          ? {
              ...prev,
              price: 0,
            }
          : prev
      )
      return
    }

    const numericValue = Number(onlyDigits) / 100
    const formatted = numericValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

    setDisplayPrice(formatted)
    setFormValues(prev =>
      prev
        ? {
            ...prev,
            price: Number(onlyDigits),
          }
        : prev
    )
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
          type="text"
          title="Valor da propriedade"
          placeholder="35.000,00"
          maxLength={20}
          value={displayPrice}
          onChange={handlePriceChange}
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
