'use client'

import type { ListingType, PropertyProps } from '@/_types/property'
import { propertyUpdateInfoDetails } from '@/actions/properties/property-update-infoDetails'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { FooterEditModal } from '@/components/commons/footer-edit-modal'
import { Modal } from '@/components/ui/custom-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { listingTypes, propertyTypes } from '@/configs/properties'
import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

interface Props {
  data: PropertyProps | null
}

export function EditPropertyInfo({ data }: Props) {
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

      await propertyUpdateInfoDetails({
        infoDetails: {
          type: formValues.type,
          listingType: formValues.listingType,
          yearBuilt: String(formValues?.yearBuilt) ?? '',
          cep: formValues.cep,
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

  function handleSelectChange(
    field: keyof PropertyProps,
    value: string | ListingType
  ) {
    setFormValues(prevState => {
      if (!prevState) return prevState
      return {
        ...prevState,
        [field]: value as any,
      }
    })
  }

  return (
    <>
      <ButtonForOwnerOnly handleExecute={handleOpenModal} title="Status" />

      <Modal
        isOpen={isOpen}
        setIsOpen={onClose}
        title="Endereço do Imóvel"
        description="Informe o endereço"
        classname="w-full max-w-lg justify-center border-[0.5px] border-blue-300 text-zinc-700 p-6 bg-white"
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Campo Tipo */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              name="type"
              value={formValues?.type}
              onValueChange={value => handleSelectChange('type', value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campo Finalidade */}
          <div className="space-y-2">
            <Label htmlFor="listingType">Finalidade</Label>
            <Select
              name="listingType"
              value={formValues?.listingType}
              onValueChange={value => handleSelectChange('listingType', value)}
            >
              <SelectTrigger id="listingType">
                <SelectValue placeholder="Selecione a finalidade" />
              </SelectTrigger>
              <SelectContent>
                {listingTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campo Ano de Construção */}
          <div className="space-y-2">
            <Label htmlFor="yearBuilt">Ano de Construção</Label>
            <Input
              id="yearBuilt"
              name="yearBuilt"
              type="number"
              value={formValues?.yearBuilt ?? ''}
              placeholder="Ex: 2010"
              onChange={handleChange}
            />
          </div>

          {/* Campo CEP */}
          <div className="space-y-2">
            <Label htmlFor="zipCode">CEP</Label>
            <Input
              id="cep"
              name="cep"
              type="number"
              value={formValues?.cep}
              placeholder="Ex: 36800-000"
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
