'use client'

import type { CheckedState } from '@radix-ui/react-checkbox'
import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import type { PropertyProps } from '@/_types/property'
import { propertyUpdateFeatures } from '@/actions/properties/property-update-features'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { FooterEditModal } from '@/components/commons/footer-edit-modal'
import { Checkbox } from '@/components/ui/checkbox'
import { Modal } from '@/components/ui/custom-modal'
import { Label } from '@/components/ui/label'
import { featuresItems } from '@/configs/properties'

interface Props {
  data: PropertyProps | null
}

export function EditPropertyFeatures({ data }: Props) {
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

      await propertyUpdateFeatures({
        features: formValues.features || [],
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

  function handleFeatureCheckedChange(featureValue: string) {
    return (checked: CheckedState) => {
      const isChecked = typeof checked === 'boolean' ? checked : false

      setFormValues(prevState => {
        if (!prevState) return prevState

        const prevFeatures = (prevState.features as string[]) || []

        let newFeatures: string[]

        if (isChecked) {
          newFeatures = [...prevFeatures, featureValue]
        } else {
          newFeatures = prevFeatures.filter(
            prevFeature => prevFeature !== featureValue
          )
        }

        return {
          ...prevState,
          features: newFeatures,
        }
      })
    }
  }

  return (
    <>
      <ButtonForOwnerOnly
        handleExecute={handleOpenModal}
        title="diferenciais"
      />

      <Modal
        isOpen={isOpen}
        setIsOpen={onClose}
        title="Editar diferenciais"
        description="Informe os diferenciais"
        classname="w-full max-w-lg justify-center border-[0.5px] border-blue-300 text-zinc-700 p-6 bg-white"
      >
        <div className="grid grid-cols-2 gap-4">
          {featuresItems.map(feature => (
            <div key={feature} className="flex items-center gap-2">
              <Checkbox
                id={feature}
                name={feature}
                value={feature}
                checked={formValues?.features?.includes(feature)}
                onCheckedChange={handleFeatureCheckedChange(feature)}
              />
              <Label htmlFor={feature} className="font-normal">
                {feature}
              </Label>
            </div>
          ))}
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
