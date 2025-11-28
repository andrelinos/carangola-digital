'use client'

import clsx from 'clsx'
import { LightBulbOn, Plus, Trash } from 'iconoir-react'
import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'
import { toast } from 'sonner'

import type {
  HolidayException,
  ProfileDataProps,
  ScheduleDay,
  ScheduleInterval,
} from '@/_types/profile-data'

import { createBusinessOpeningHours } from '@/actions/business/create-business-opening-hours'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/custom-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type WeeklySchedule = Record<string, ScheduleDay>

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
    closed: false,
    isAppointmentOnly: false,
    intervals: [{ opening: '08:00', closing: '18:00' }],
  },
  Tuesday: {
    closed: false,
    isAppointmentOnly: false,
    intervals: [{ opening: '08:00', closing: '18:00' }],
  },
  Wednesday: {
    closed: false,
    isAppointmentOnly: false,
    intervals: [{ opening: '08:00', closing: '18:00' }],
  },
  Thursday: {
    closed: false,
    isAppointmentOnly: false,
    intervals: [{ opening: '08:00', closing: '18:00' }],
  },
  Friday: {
    closed: false,
    isAppointmentOnly: false,
    intervals: [{ opening: '08:00', closing: '18:00' }],
  },
  Saturday: {
    closed: false,
    isAppointmentOnly: false,
    intervals: [{ opening: '08:00', closing: '12:00' }],
  },
  Sunday: { closed: true, isAppointmentOnly: false, intervals: [] },
}

const initializeSchedule = (schedule?: WeeklySchedule): WeeklySchedule => {
  if (!schedule) return {}

  const newSchedule: WeeklySchedule = {}
  for (const day of WEEK_DAYS) {
    const dayData = schedule[day]
    if (dayData) {
      newSchedule[day] = {
        ...dayData,

        intervals:
          Array.isArray(dayData.intervals) && dayData.intervals.length > 0
            ? dayData.intervals
            : [],
      }
    }
  }
  return newSchedule
}

export function EditBusinessOpeningHours({ profileData }: Props) {
  const router = useRouter()

  if (!profileData?.id) {
    return <div />
  }

  const profileId = profileData.id

  const initialSchedule = initializeSchedule(
    profileData.openingHours as unknown as WeeklySchedule | undefined
  )

  const initialHolidays: HolidayException[] =
    (profileData.holidayExceptions as unknown as HolidayException[]) || []

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openingHours, setOpeningHours] =
    useState<WeeklySchedule>(initialSchedule)
  const [holidays, setHolidays] = useState<HolidayException[]>(initialHolidays)

  function handleOpenModal() {
    setIsOpen(!isOpen)
  }

  function onClose() {
    setIsOpen(false)
  }

  function handleAppointmentOnlyChange(
    day: keyof WeeklySchedule,
    isChecked: boolean
  ) {
    setOpeningHours(prev => {
      const currentDay = prev[day] ?? {
        closed: false,
        isAppointmentOnly: false,
        intervals: [],
      }

      return {
        ...prev,
        [day]: {
          ...currentDay,
          isAppointmentOnly: isChecked,
          closed: isChecked ? false : currentDay.closed,
          intervals: isChecked
            ? []
            : currentDay?.intervals.length > 0
              ? currentDay.intervals
              : [{ opening: '08:00', closing: '18:00' }],
        },
      }
    })
  }

  function handleClosedChange(day: keyof WeeklySchedule, isChecked: boolean) {
    setOpeningHours(prev => {
      const currentDay = prev[day] ?? {
        closed: false,
        isAppointmentOnly: false,
        intervals: [],
      }

      return {
        ...prev,
        [day]: {
          ...currentDay,
          closed: isChecked,
          isAppointmentOnly: false,
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

      // Limpeza Semanais
      for (const day in finalSchedule) {
        const daySchedule = finalSchedule[day]
        if (!daySchedule.closed && daySchedule.intervals?.length > 0) {
          const sortedIntervals = [...daySchedule.intervals].sort((a, b) =>
            a.opening.localeCompare(b.opening)
          )

          daySchedule.intervals = sortedIntervals

          sortedIntervals[sortedIntervals.length - 1].closing
        } else {
          daySchedule.intervals = []
        }
      }

      // Limpeza Feriados
      const finalHolidays = holidays.map(h => {
        if (h.closed || h.isAppointmentOnly) return { ...h, intervals: [] }
        const sorted = [...h.intervals].sort((a, b) =>
          a.opening.localeCompare(b.opening)
        )
        return { ...h, intervals: sorted }
      })

      const formData = new FormData()
      formData.append('profileId', profileId)
      formData.append('openingHours', JSON.stringify(finalSchedule))
      formData.append('holidayExceptions', JSON.stringify(finalHolidays))

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

  // --- Handlers para Feriados (NOVO) ---

  function addHoliday() {
    const today = new Date().toISOString().split('T')[0]
    setHolidays(prev => [
      ...prev,
      {
        date: today,
        description: 'Novo Feriado',
        closed: true,
        isAppointmentOnly: false,
        intervals: [],
      },
    ])
  }

  function removeHoliday(index: number) {
    setHolidays(prev => prev.filter((_, i) => i !== index))
  }

  function updateHoliday(
    index: number,
    field: keyof HolidayException,
    value: any
  ) {
    setHolidays(prev =>
      prev.map((h, i) => {
        if (i !== index) return h

        if (field === 'closed') {
          return {
            ...h,
            closed: value,
            // Se abriu e não tem intervalos, adiciona padrão
            intervals:
              !value && (!h.intervals || h.intervals.length === 0)
                ? [{ opening: '09:00', closing: '17:00' }]
                : value
                  ? []
                  : h.intervals,
          }
        }
        if (field === 'isAppointmentOnly') {
          return {
            ...h,
            isAppointmentOnly: value,
            closed: value ? false : h.closed,
            intervals: value ? [] : h.intervals,
          }
        }

        return { ...h, [field]: value }
      })
    )
  }

  function handleHolidayIntervalChange(
    hIndex: number,
    intIndex: number,
    field: 'opening' | 'closing',
    value: string
  ) {
    setHolidays(prev =>
      prev.map((h, i) => {
        if (i !== hIndex) return h
        const newIntervals = [...h.intervals]
        newIntervals[intIndex] = {
          ...newIntervals[intIndex],
          [field]: value,
        } as ScheduleInterval
        return { ...h, intervals: newIntervals }
      })
    )
  }

  function addHolidayInterval(hIndex: number) {
    setHolidays(prev =>
      prev.map((h, i) => {
        if (i !== hIndex) return h
        return {
          ...h,
          intervals: [
            ...h.intervals,
            { opening: '', closing: '' },
          ] as ScheduleInterval[],
        }
      })
    )
  }

  function removeHolidayInterval(hIndex: number, intIndex: number) {
    setHolidays(prev =>
      prev.map((h, i) => {
        if (i !== hIndex) return h
        return {
          ...h,
          intervals: h.intervals.filter((_, idx) => idx !== intIndex),
        }
      })
    )
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
        classname="w-full max-w-[638px] max-h-[90vh] overflow-y-auto justify-center md:rounded-2xl border-[0.5px] border-blue-300 bg-white py-16 px-6 text-zinc-700"
      >
        <div className="lg:fex-row flex w-full flex-col gap-4 ">
          {WEEK_DAYS.map(day => (
            <div
              key={day}
              className="flex w-full flex-col items-start justify-between gap-4 rounded-b-md border-b p-2 pb-4 shadow-md lg:flex-row lg:items-center"
            >
              <div className="flex w-full flex-1 flex-col items-end gap-2 text-zinc-700">
                <div className="flex w-full flex-col items-center justify-end gap-4 bg-slate-50 p-2">
                  <div className="flex w-full">
                    <span className="flex flex-1 items-center justify-start font-bold">
                      {WEEK_DAY_TRANSLATIONS[day]}:
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs disabled:cursor-not-allowed"
                      aria-label="Adicionar novo horário"
                      onClick={() => addInterval(day)}
                      disabled={openingHours[day]?.closed}
                    >
                      <Plus className="size-4" /> Adicionar horário
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex justify-end gap-2 text-xs">
                      <Label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            openingHours[day]?.isAppointmentOnly ?? false
                          }
                          onChange={e =>
                            handleAppointmentOnlyChange(day, e.target.checked)
                          }
                          disabled={openingHours[day]?.closed}
                          className="disabled:opacity-50"
                        />
                        <span>Apenas agendamento</span>
                      </Label>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Label className="flex gap-2 font-semibold">
                        <input
                          type="checkbox"
                          checked={openingHours[day]?.closed ?? false}
                          onChange={e =>
                            handleClosedChange(day, e.target.checked)
                          }
                        />
                        <span className="text-red-600">Fechado o dia todo</span>
                      </Label>
                    </div>
                  </div>
                </div>
                <div
                  className={clsx('flex w-full flex-col gap-2', {
                    'pointer-events-none select-none opacity-50':
                      openingHours[day]?.closed ||
                      openingHours[day]?.isAppointmentOnly,
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

          {/* BLOCO 2: FERIADOS (Exceptions) */}
          <div className="rounded-b-lg border-t px-3 py-6 shadow-md">
            <div className="mb-4 flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-blue-900 text-lg">
                Feriados e Exceções
              </h3>
              <Button
                variant="secondary"
                onClick={addHoliday}
                size="sm"
                className="flex gap-1"
              >
                <Plus className="size-4" /> Adicionar data
              </Button>
            </div>

            {holidays.length === 0 ? (
              <p className="py-4 text-center text-gray-500 text-sm italic">
                Nenhum feriado ou data especial cadastrada.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {holidays.map((holiday, hIndex) => (
                  <div
                    key={String(hIndex)}
                    className="rounded-md border bg-slate-50 p-3 shadow-sm"
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="flex w-full flex-col gap-2">
                        <div className="flex gap-2">
                          <div className="flex w-1/3 flex-col gap-1">
                            <Label className="font-bold text-xs">Data</Label>
                            <Input
                              type="date"
                              value={holiday.date}
                              onChange={e =>
                                updateHoliday(hIndex, 'date', e.target.value)
                              }
                              className="h-9 bg-white"
                            />
                          </div>
                          <div className="flex w-2/3 flex-col gap-1">
                            <Label className="font-bold text-xs">
                              Descrição (Ex: Natal)
                            </Label>
                            <Input
                              type="text"
                              placeholder="Nome do feriado"
                              value={holiday.description}
                              onChange={e =>
                                updateHoliday(
                                  hIndex,
                                  'description',
                                  e.target.value
                                )
                              }
                              className="h-9 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeHoliday(hIndex)}
                        className="mt-4 h-8 w-8 text-red-500 hover:bg-red-50"
                      >
                        <Trash className="size-5" />
                      </Button>
                    </div>

                    {/* Controles do Feriado */}
                    <div className="mb-2 flex flex-wrap items-center gap-4 rounded border bg-white p-2">
                      <label className="flex cursor-pointer select-none items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={holiday.closed}
                          onChange={e =>
                            updateHoliday(hIndex, 'closed', e.target.checked)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-semibold text-red-600">
                          Fechado o dia todo
                        </span>
                      </label>
                      <Label className="flex cursor-pointer select-none items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={holiday.isAppointmentOnly}
                          disabled={holiday.closed}
                          onChange={e =>
                            updateHoliday(
                              hIndex,
                              'isAppointmentOnly',
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                        />
                        <span>Apenas Agendamento</span>
                      </Label>
                    </div>

                    {/* Intervalos do Feriado (se aberto) */}
                    {!holiday.closed && !holiday.isAppointmentOnly && (
                      <div className="border-blue-200 border-l-2 pl-2">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-semibold text-gray-500 text-xs">
                            Horário especial para esta data:
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => addHolidayInterval(hIndex)}
                          >
                            <Plus className="mr-1 size-3" /> Add Horário
                          </Button>
                        </div>
                        <div className="flex flex-col gap-2">
                          {holiday.intervals.map((interval, intIndex) => (
                            <div
                              key={String(intIndex)}
                              className="flex items-center gap-2"
                            >
                              <Input
                                type="time"
                                className="h-8 bg-white"
                                value={interval.opening}
                                onChange={e =>
                                  handleHolidayIntervalChange(
                                    hIndex,
                                    intIndex,
                                    'opening',
                                    e.target.value
                                  )
                                }
                              />
                              <span className="text-xs">até</span>
                              <Input
                                type="time"
                                className="h-8 bg-white"
                                value={interval.closing}
                                onChange={e =>
                                  handleHolidayIntervalChange(
                                    hIndex,
                                    intIndex,
                                    'closing',
                                    e.target.value
                                  )
                                }
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-400"
                                onClick={() =>
                                  removeHolidayInterval(hIndex, intIndex)
                                }
                              >
                                <Trash className="size-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <footer className="flex w-full justify-end gap-4 pt-6">
            <button
              type="button"
              className="font-bold hover:cursor-pointer"
              onClick={onClose}
            >
              Voltar
            </button>
            <Button
              onClick={handleSaveOpeningHours}
              disabled={isSubmitting}
              className="min-w-[120px] font-bold "
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </footer>
        </div>
      </Modal>
      {isSubmitting && <Loading />}
    </>
  )
}
