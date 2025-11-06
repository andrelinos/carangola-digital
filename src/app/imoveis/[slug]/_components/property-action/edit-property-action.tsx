'use client'

import type { PropertyProps } from '@/_types/property'
import { propertyUpdateActionCard } from '@/actions/properties/property-update-action-card'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { FooterEditModal } from '@/components/commons/footer-edit-modal'
import { Modal } from '@/components/ui/custom-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

interface Props {
  data: PropertyProps | null
}

export function EditPropertyActionCard({ data }: Props) {
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

      await propertyUpdateActionCard({
        propertyId: data.id,
        propertyDocPath: data.docPath,
        actionDescription: formValues?.actionDescription,
        actionContactPhone: formValues?.actionContactPhone,
        actionContactWhatsApp: formValues?.actionContactWhatsApp,
        actionContactSocial: formValues?.actionContactSocial,
        actionContactEmail: formValues?.actionContactEmail,
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
      <ButtonForOwnerOnly handleExecute={handleOpenModal} title="contatos">
        Contatos
      </ButtonForOwnerOnly>

      <Modal
        isOpen={isOpen}
        setIsOpen={onClose}
        title="Editar contatos"
        description="Informe seus contatos"
        classname="w-full max-w-lg space-y-4 border-[0.5px] border-blue-300 text-zinc-700 p-6 bg-white"
      >
        <div className="grid grid-cols-2 gap-4">
          <Input
            variant="default"
            name="actionContactPhone"
            title="Telefone"
            placeholder="Informe seu telefone..."
            maxLength={15}
            value={formValues?.actionContactPhone ?? ''}
            onChange={handleChange}
            className="w-full"
          />
          <Input
            variant="default"
            name="actionContactWhatsApp"
            title="Whatsapp"
            placeholder="Informe seu whatsapp..."
            maxLength={15}
            value={formValues?.actionContactWhatsApp ?? ''}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <Input
          variant="default"
          type="email"
          name="actionContactEmail"
          title="E-mail"
          placeholder="Informe seu e-mail"
          maxLength={150}
          value={formValues?.actionContactEmail ?? ''}
          onChange={handleChange}
          className="w-full"
        />
        <Input
          variant="default"
          name="actionContactSocial"
          title="Rede social"
          placeholder="Informe uma rede social..."
          maxLength={150}
          value={formValues?.actionContactSocial ?? ''}
          onChange={handleChange}
          className="w-full"
        />
        <Label htmlFor="actionDescription">Descrição</Label>
        <Textarea
          id="actionDescription"
          name="actionDescription"
          title="Dê mais informações para contato"
          maxLength={300}
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
