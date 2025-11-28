import type { JSX } from 'react'

import type { HolidayException, ScheduleDay } from '@/_types/profile-data'
import { getNextOpenDay } from '.'
import { ContainerStatus } from './container-status'

export type WeeklySchedule = Record<string, ScheduleDay>

interface GetOperatingStatusProps {
  schedule: WeeklySchedule
  currentTime: Date
  holidayExceptions?: HolidayException[]
}

const dayTranslations: Record<string, string> = {
  Sunday: 'Domingo',
  Monday: 'Segunda-feira',
  Tuesday: 'Terça-feira',
  Wednesday: 'Quarta-feira',
  Thursday: 'Quinta-feira',
  Friday: 'Sexta-feira',
  Saturday: 'Sábado',
}

// Helper: Formata data para YYYY-MM-DD de forma segura
const getFormattedDate = (date: Date, timeZone: string) => {
  // O locale 'fr-CA' retorna nativamente no formato YYYY-MM-DD
  return date.toLocaleDateString('fr-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// Helper: Converte horário "HH:MM" para minutos
const timeToMinutes = (time: string): number => {
  if (!time || !time.includes(':')) return 0
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Helper: Pega a regra efetiva do dia (Feriado ou Dia da Semana)
function getEffectiveDaySchedule(
  date: Date,
  schedule: WeeklySchedule,
  holidayExceptions: HolidayException[],
  timeZone: string
): ScheduleDay | HolidayException | null {
  // 1. Verifica se é feriado
  const dateString = getFormattedDate(date, timeZone)

  const holiday = holidayExceptions.find(h => h.date === dateString)
  if (holiday) return holiday

  // 2. Se não for feriado, pega o dia da semana
  const dayName = date.toLocaleDateString('en-US', {
    timeZone,
    weekday: 'long',
  })

  return schedule[dayName] || null
}

export function getOperatingStatus({
  schedule,
  currentTime,
  holidayExceptions = [],
}: GetOperatingStatusProps): JSX.Element | string {
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  if (!schedule || Object?.keys(schedule)?.length === 0) {
    return 'Nenhum horário cadastrado'
  }

  try {
    const timeZone = 'America/Sao_Paulo'

    const todayName = currentTime.toLocaleDateString('en-US', {
      timeZone,
      weekday: 'long',
    })

    const timeStringInBrazil = currentTime.toLocaleTimeString('pt-BR', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })

    const [currentHour, currentMinute] = timeStringInBrazil
      .split(':')
      .map(Number)
    const nowMinutes = currentHour * 60 + currentMinute

    // const todaySchedule = schedule[todayName]

    const todaySchedule = getEffectiveDaySchedule(
      currentTime,
      schedule,
      holidayExceptions,
      timeZone
    )

    if (!todaySchedule) {
      return 'Horário indefinido'
    }

    if (todaySchedule.isAppointmentOnly) {
      return (
        <ContainerStatus status="open">Aberto por Agendamento</ContainerStatus>
      )
    }

    const timeToMinutes = (time: string): number => {
      if (!time || !time.includes(':')) return 0
      const [hours, minutes] = time.split(':').map(Number)
      return hours * 60 + minutes
    }

    const intervals = todaySchedule.intervals || []

    if (todaySchedule.closed || intervals.length === 0) {
      const next = getNextOpenDay(
        schedule,
        currentTime,
        daysOfWeek,
        timeZone,
        holidayExceptions
      )

      if (!next) {
        return <ContainerStatus status="closed">Fechado</ContainerStatus>
      }

      if (next.isAppointmentOnly) {
        return next.daysFromNow === 1 ? (
          <ContainerStatus status="closed">
            Fechado - Abre amanhã por agendamento
          </ContainerStatus>
        ) : (
          <ContainerStatus status="closed">
            Fechado - Abre{' '}
            <strong>{dayTranslations[next.dayName].toLowerCase()}</strong> por
            agendamento
          </ContainerStatus>
        )
      }

      return next.daysFromNow === 1 ? (
        <ContainerStatus status="closed">
          {`Fechado - Abre amanhã às ${next.opening}`}
        </ContainerStatus>
      ) : (
        <ContainerStatus status="closed">
          Fechado - Abre{' '}
          <strong>{dayTranslations[next.dayName].toLowerCase()}</strong> às{' '}
          {next.opening}
        </ContainerStatus>
      )
    }

    for (const interval of intervals) {
      if (!interval.opening || !interval.closing) continue

      const openMinutes = timeToMinutes(interval.opening)
      const closeMinutes = timeToMinutes(interval.closing)

      if (nowMinutes >= openMinutes && nowMinutes < closeMinutes) {
        return (
          <ContainerStatus status="open">
            {`Aberto - Fecha às ${interval.closing}`}
          </ContainerStatus>
        )
      }
    }

    for (const interval of intervals) {
      if (!interval.opening) continue

      const openMinutes = timeToMinutes(interval.opening)

      if (nowMinutes < openMinutes) {
        return (
          <ContainerStatus status="closed">
            {`Fechado - Abre às ${interval.opening}`}
          </ContainerStatus>
        )
      }
    }

    const next = getNextOpenDay(
      schedule,
      currentTime,
      daysOfWeek,
      timeZone,
      holidayExceptions
    )

    if (!next) {
      return <ContainerStatus status="closed">Fechado</ContainerStatus>
    }

    if (next.isAppointmentOnly) {
      return next.daysFromNow === 1 ? (
        <ContainerStatus status="closed">
          Fechado - Abre amanhã por agendamento
        </ContainerStatus>
      ) : (
        <ContainerStatus status="closed">
          Fechado - Abre{' '}
          <strong>{dayTranslations[next.dayName].toLowerCase()}</strong>{' '}por
          agendamento
        </ContainerStatus>
      )
    }

    return next.daysFromNow === 1 ? (
      <ContainerStatus status="closed">
        {`Fechado - Abre amanhã às ${next.opening}`}
      </ContainerStatus>
    ) : (
      <ContainerStatus status="closed">
        Fechado - Abre {' '}
        <strong>{dayTranslations[next.dayName].toLowerCase()}</strong> às {' '}
        {next.opening}
      </ContainerStatus>
    )
  } catch (error) {
    console.error('Erro ao processar horários:', error)
    return 'Erro ao processar horários'
  }
}
