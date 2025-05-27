'use client'

import { EditPencil } from 'iconoir-react'
import { useParams, useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import type { ProfileDataProps } from '@/_types/profile-data'

import { createBusinessOpeningHours } from '@/actions/create-business-opening-hours'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { TextArea } from '@/components/ui/text-area'

type DaySchedule = {
  opening: string
  closing: string
  closed: boolean
}

type WeeklySchedule = Record<string, DaySchedule>

const WEEK_DAY_TRANSLATIONS: Record<string, string> = {
  Monday: 'Segunda-feira',
  Tuesday: 'Terça-feira',
  Wednesday: 'Quarta-feira',
  Thursday: 'Quinta-feira',
  Friday: 'Sexta-feira',
  Saturday: 'Sábado',
  Sunday: 'Domingo',
}

const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

interface Props {
  profileData: ProfileDataProps
}

const initialSchedule: WeeklySchedule = {
  // Monday: { opening: '08:00', closing: '18:00', closed: false },
  // Tuesday: { opening: '08:00', closing: '18:00', closed: false },
  // Wednesday: { opening: '08:00', closing: '18:00', closed: false },
  // Thursday: { opening: '08:00', closing: '18:00', closed: false },
  // Friday: { opening: '08:00', closing: '18:00', closed: false },
  // Saturday: { opening: '08:00', closing: '13:00', closed: false },
  // Sunday: { opening: '', closing: '', closed: true },
} as WeeklySchedule

export function EditBusinessOpeningHours({ profileData }: Props) {
  const router = useRouter()
  const { profileId } = useParams() as { profileId: string }

  const weekSchedule =
    (profileData.openingHours?.openingHours &&
      (profileData.openingHours?.openingHours as unknown as WeeklySchedule)) ||
    undefined

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openingHours, setOpeningHours] = useState<WeeklySchedule>(
    weekSchedule || initialSchedule
  )
  const [description, setDescription] = useState('')

  function handleOpenModal() {
    setIsOpen(!isOpen)
  }

  function onClose() {
    setIsOpen(false)
  }

  function handleChange(
    day: keyof WeeklySchedule,
    field: keyof DaySchedule,
    value: string | boolean
  ) {
    setOpeningHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }))
  }

  async function handleSaveOpeningHours() {
    setIsSubmitting(true)

    try {
      const formData = new FormData()

      formData.append('profileId', profileId)
      formData.append('openingHours', JSON.stringify(openingHours))
      formData.append('description', description)

      await createBusinessOpeningHours(formData)
    } catch (error) {
      console.error('Erro ao salvar:', error)
    } finally {
      startTransition(() => {
        setIsSubmitting(false)
        onClose()

        router.refresh()
      })
    }
  }

  return (
    <>
      <ButtonForOwnerOnly handleExecute={handleOpenModal}>
        <EditPencil className="size-4 transition-all duration-300 hover:scale-150 hover:cursor-pointer" />
      </ButtonForOwnerOnly>

      <Modal
        isOpen={isOpen}
        setIsOpen={onClose}
        title="Definir horário de funcionamento"
        description="Defina seu horário de funcionamento"
        classname="w-full max-w-[638px] justify-center rounded-2xl border-[0.5px] border-blue-300 text-zinc-700 bg-white p-6"
      >
        <div className="items-end-safe lg:fex-row flex max-h-[90vh] w-full flex-col gap-4 overflow-y-auto py-6">
          {WEEK_DAYS.map(day => (
            <div
              key={day}
              className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row lg:items-center "
            >
              <span className="flex items-center justify-start font-bold">
                {WEEK_DAY_TRANSLATIONS[day]}:
              </span>
              <div className="flex w-full flex-1 items-end gap-2 text-zinc-700 lg:max-w-96">
                <div
                  className="mx-auto flex w-[90%] justify-between gap-2 lg:w-fit lg:items-end"
                  style={{
                    pointerEvents: openingHours[day]?.closed ? 'none' : 'auto',
                    opacity: openingHours[day]?.closed ? 0.5 : 1,
                  }}
                >
                  <Input
                    variant="ghost"
                    type="time"
                    title="Aberto"
                    value={openingHours[day]?.opening}
                    onChange={e => handleChange(day, 'opening', e.target.value)}
                    disabled={openingHours[day]?.closed}
                  />
                  <Input
                    variant="ghost"
                    type="time"
                    title="Fecha"
                    value={openingHours[day]?.closing}
                    onChange={e => handleChange(day, 'closing', e.target.value)}
                    disabled={openingHours[day]?.closed}
                  />
                  <span className="flex flex-col items-center justify-end gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={openingHours[day]?.closed}
                      onChange={e =>
                        handleChange(day, 'closed', e.target.checked)
                      }
                    />
                    Fechado
                  </span>
                </div>
              </div>
            </div>
          ))}

          <TextArea
            variant="ghost"
            title="Breves descrições"
            placeholder="Adicione descrições sobre o horário de funcionamento"
            className="h-28"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <footer className="flex justify-end gap-4">
            <button type="button" className="font-bold" onClick={onClose}>
              Voltar
            </button>
            <Button onClick={handleSaveOpeningHours} disabled={isSubmitting}>
              Salvar
            </Button>
          </footer>
        </div>
      </Modal>
    </>
  )
}
