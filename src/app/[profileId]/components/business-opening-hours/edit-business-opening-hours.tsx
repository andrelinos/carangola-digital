'use client'

import { LightBulbOn, Plus, Trash } from 'iconoir-react'
import { useParams, useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import type { ProfileDataProps } from '@/_types/profile-data'

import { createBusinessOpeningHours } from '@/actions/create-business-opening-hours'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import clsx from 'clsx'
import { toast } from 'sonner'

// 1. ATUALIZAÇÃO DO TIPO PARA SUPORTAR MÚLTIPLOS INTERVALOS
type TimeInterval = {
  opening: string
  closing: string
}

type DaySchedule = {
  opening: string
  closing: string
  closed: boolean
  intervals: TimeInterval[]
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

const exampleSchedule: WeeklySchedule = {
  Monday: {
    opening: '08:00',
    closing: '18:00',
    closed: false,
    intervals: [
      { opening: '08:00', closing: '12:00' },
      { opening: '14:00', closing: '18:00' },
    ],
  },
  Tuesday: {
    opening: '08:00',
    closing: '18:00',
    closed: false,
    intervals: [{ opening: '08:00', closing: '18:00' }],
  },
  Wednesday: {
    opening: '08:00',
    closing: '18:00',
    closed: false,
    intervals: [{ opening: '08:00', closing: '18:00' }],
  },
  Thursday: {
    opening: '08:00',
    closing: '18:00',
    closed: false,
    intervals: [{ opening: '08:00', closing: '18:00' }],
  },
  Friday: {
    opening: '08:00',
    closing: '18:00',
    closed: false,
    intervals: [{ opening: '08:00', closing: '18:00' }],
  },
  Saturday: {
    opening: '08:00',
    closing: '13:00',
    closed: false,
    intervals: [{ opening: '08:00', closing: '13:00' }],
  },
  Sunday: { opening: '', closing: '', closed: true, intervals: [] },
}

// Função para inicializar o estado garantindo que `intervals` exista
const initializeSchedule = (schedule?: WeeklySchedule): WeeklySchedule => {
  if (!schedule) return {}

  const newSchedule: WeeklySchedule = {}
  for (const day of WEEK_DAYS) {
    const dayData = schedule[day]
    if (dayData) {
      newSchedule[day] = {
        ...dayData,
        // Garante que `intervals` seja um array, usando os dados antigos se for o caso
        intervals:
          Array.isArray(dayData.intervals) && dayData.intervals.length > 0
            ? dayData.intervals
            : !dayData.closed
              ? [{ opening: dayData.opening, closing: dayData.closing }]
              : [],
      }
    }
  }
  return newSchedule
}

export function EditBusinessOpeningHours({ profileData }: Props) {
  const router = useRouter()
  const { profileId } = useParams() as { profileId: string }

  const initialSchedule = initializeSchedule(
    profileData.openingHours as unknown as WeeklySchedule | undefined
  )

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openingHours, setOpeningHours] =
    useState<WeeklySchedule>(initialSchedule)

  function handleOpenModal() {
    setIsOpen(!isOpen)
  }

  function onClose() {
    setIsOpen(false)
  }

  function handleClosedChange(day: keyof WeeklySchedule, isChecked: boolean) {
    setOpeningHours(prev => {
      const currentDay = prev[day] ?? { closed: false, intervals: [] }

      return {
        ...prev,
        [day]: {
          ...currentDay,
          closed: isChecked,
          intervals: isChecked
            ? []
            : currentDay?.intervals.length > 0
              ? currentDay.intervals
              : [{ opening: '08:00', closing: '18:00' }],
        },
      }
    })
  }

  function handleIntervalChange(
    day: keyof WeeklySchedule,
    index: number,
    field: 'opening' | 'closing',
    value: string
  ) {
    const updatedIntervals = [...(openingHours[day]?.intervals || [])]
    updatedIntervals[index] = { ...updatedIntervals[index], [field]: value }

    setOpeningHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        intervals: updatedIntervals,
      },
    }))
  }

  function addInterval(day: keyof WeeklySchedule) {
    const newIntervals = [
      ...(openingHours[day]?.intervals || []),
      { opening: '', closing: '' },
    ]
    setOpeningHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        intervals: newIntervals,
      },
    }))
  }

  function removeInterval(day: keyof WeeklySchedule, index: number) {
    const updatedIntervals = [...(openingHours[day]?.intervals || [])].filter(
      (_, i) => i !== index
    )
    setOpeningHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        intervals: updatedIntervals,
      },
    }))
  }

  async function handleSaveOpeningHours() {
    setIsSubmitting(true)
    try {
      const finalSchedule: WeeklySchedule = { ...openingHours }

      // 2. LÓGICA DE RETROCOMPATIBILIDADE ANTES DE SALVAR
      for (const day in finalSchedule) {
        const daySchedule = finalSchedule[day]
        if (
          !daySchedule.closed &&
          daySchedule.intervals &&
          daySchedule.intervals.length > 0
        ) {
          // Ordena os intervalos pelo horário de abertura
          const sortedIntervals = [...daySchedule.intervals].sort((a, b) =>
            a.opening.localeCompare(b.opening)
          )

          daySchedule.intervals = sortedIntervals
          // Define `opening` e `closing` para manter a compatibilidade
          daySchedule.opening = sortedIntervals[0].opening
          daySchedule.closing =
            sortedIntervals[sortedIntervals.length - 1].closing
        } else {
          // Limpa os campos se estiver fechado
          daySchedule.opening = ''
          daySchedule.closing = ''
          daySchedule.intervals = []
        }
      }

      const formData = new FormData()
      formData.append('profileId', profileId)
      formData.append('openingHours', JSON.stringify(finalSchedule))

      await createBusinessOpeningHours(formData)
      toast.success('Horário de funcionamento salvo com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar horário de funcionamento.')
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
        Editar
      </ButtonForOwnerOnly>

      <Modal
        isOpen={isOpen}
        setIsOpen={onClose}
        title="Definir horário de funcionamento"
        description="Defina seu horário de funcionamento para cada dia, podendo adicionar mais de um período."
        classname="w-full max-w-[638px] justify-center rounded-2xl border-[0.5px] border-blue-300 bg-white p-6 text-zinc-700"
      >
        <div className="lg:fex-row flex max-h-[90vh] w-full flex-col gap-4 overflow-y-auto py-6">
          {WEEK_DAYS.map(day => (
            <div
              key={day}
              className="flex w-full flex-col items-start justify-between gap-4 border-b pb-4 lg:flex-row lg:items-center"
            >
              <span className="flex w-32 items-center justify-start font-bold">
                {WEEK_DAY_TRANSLATIONS[day]}:
              </span>
              <div className="flex w-full flex-1 flex-col items-end gap-2 text-zinc-700">
                <div className="flex w-full items-center justify-end gap-4">
                  <span className="flex flex-col items-center justify-end gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={openingHours[day]?.closed ?? false}
                      onChange={e => handleClosedChange(day, e.target.checked)}
                    />
                    Fechado
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => addInterval(day)}
                    disabled={openingHours[day]?.closed}
                    className="size-8 rounded-full"
                    aria-label="Adicionar novo horário"
                  >
                    <Plus />
                  </Button>
                </div>
                <div
                  className={clsx('flex w-full flex-col gap-2', {
                    'pointer-events-none select-none opacity-50':
                      openingHours[day]?.closed,
                  })}
                >
                  {openingHours[day]?.intervals?.map((interval, index) => (
                    <div
                      key={String(index)}
                      className="flex w-full items-center justify-end gap-2"
                    >
                      <Input
                        variant="ghost"
                        type="time"
                        title="Aberto"
                        value={interval.opening}
                        onChange={e =>
                          handleIntervalChange(
                            day,
                            index,
                            'opening',
                            e.target.value
                          )
                        }
                        disabled={openingHours[day]?.closed}
                      />
                      <span>às</span>
                      <Input
                        variant="ghost"
                        type="time"
                        title="Fecha"
                        value={interval.closing}
                        onChange={e =>
                          handleIntervalChange(
                            day,
                            index,
                            'closing',
                            e.target.value
                          )
                        }
                        disabled={openingHours[day]?.closed}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInterval(day, index)}
                        disabled={openingHours[day]?.closed}
                        className="size-8 rounded-full text-red-500 hover:text-red-600"
                        aria-label="Remover horário"
                      >
                        <Trash />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {Object.keys(openingHours).length === 0 && (
            <Button
              variant="link"
              className="flex cursor-pointer gap-1 font-normal text-xs transition-all duration-300 hover:text-orange-500"
              onClick={() =>
                setOpeningHours(initializeSchedule(exampleSchedule))
              }
            >
              <LightBulbOn /> Preencher com dados de exemplo
            </Button>
          )}

          <footer className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              className="font-bold hover:cursor-pointer"
              onClick={onClose}
            >
              Voltar
            </button>
            <Button onClick={handleSaveOpeningHours} disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </footer>
        </div>
      </Modal>
      {isSubmitting && <Loading />}
    </>
  )
}
