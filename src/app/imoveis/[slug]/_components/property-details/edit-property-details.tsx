'use client'

import type { PropertyProps } from '@/_types/property'
import { propertyUpdateCharacteristics } from '@/actions/properties/property-update-characteristics'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { FooterEditModal } from '@/components/commons/footer-edit-modal'
import { Modal } from '@/components/ui/custom-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

interface Props {
  data: PropertyProps
}

export function EditPropertyDetails({ data }: Props) {
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

      await propertyUpdateCharacteristics({
        characteristics: {
          area: formValues?.characteristics?.area || 0,
          bedrooms: formValues?.characteristics?.bedrooms || 0,
          bathrooms: formValues?.characteristics?.bathrooms || 0,
          garageSpots: formValues?.characteristics?.garageSpots || 0,
        },
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
        : type === 'number' // Converte números
          ? Number.parseFloat(value) || 0
          : value

    setFormValues(prevState => {
      if (!prevState) return prevState

      const keys = name.split('.')

      if (keys.length > 1) {
        const [parentKey, childKey] = keys

        const parentKeyTyped = parentKey as keyof PropertyProps
        const parentObj = prevState[parentKeyTyped] as unknown as
          | Record<string, any>
          | undefined

        return {
          ...prevState,
          [parentKey]: {
            ...(parentObj || {}),
            [childKey]: finalValue,
          },
        }
      }

      return {
        ...prevState,
        [name]: finalValue,
      }
    })
  }

  return (
    <>
      <ButtonForOwnerOnly
        handleExecute={handleOpenModal}
        title="características"
      />

      <Modal
        isOpen={isOpen}
        setIsOpen={onClose}
        title="Editar características"
        description="Informe as características"
        classname="w-full max-w-lg justify-center border-[0.5px] border-blue-300 text-zinc-700 p-6 bg-white"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="area">Área (m²)</Label>
            <Input
              id="area"
              name="characteristics.area"
              type="number"
              value={formValues?.characteristics?.area ?? 0}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Quartos</Label>
            <Input
              id="bedrooms"
              name="characteristics.bedrooms"
              type="number"
              value={formValues?.characteristics?.bedrooms ?? 0}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Banheiros</Label>
            <Input
              id="bathrooms"
              name="characteristics.bathrooms"
              type="number"
              value={formValues?.characteristics?.bathrooms ?? 0}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="garageSpots">Vagas</Label>
            <Input
              id="garageSpots"
              name="characteristics.garageSpots"
              type="number"
              value={formValues?.characteristics?.garageSpots ?? 0}
              onChange={handleChange}
            />
          </div>
        </div>
        <FooterEditModal
          onSave={handleSavedForm}
          onClose={onClose}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </>
  )
}
