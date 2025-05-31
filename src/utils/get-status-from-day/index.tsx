import type { JSX } from 'react'
import { ContainerStatus } from './container-status'

type DaySchedule = {
  opening: string
  closing: string
  closed: boolean
}

type WeeklySchedule = Record<string, DaySchedule>

const dayTranslations: Record<string, string> = {
  Sunday: 'Domingo',
  Monday: 'Segunda-feira',
  Tuesday: 'Terça-feira',
  Wednesday: 'Quarta-feira',
  Thursday: 'Quinta-feira',
  Friday: 'Sexta-feira',
  Saturday: 'Sábado',
}

const currentTime = new Date()

export function getOperatingStatus(
  schedule: WeeklySchedule
): JSX.Element | string {
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
    const todayIndex = currentTime.getDay()
    const todayName = daysOfWeek[todayIndex]
    const todaySchedule = schedule[todayName]

    if (!todaySchedule) {
      return 'Horário indefinido'
    }

    const timeToMinutes = (time: string): number => {
      const parts = time.split(':')
      if (parts.length !== 2) {
        throw new Error('Formato de hora inválido')
      }
      const hours = Number.parseInt(parts[0], 10)
      const minutes = Number.parseInt(parts[1], 10)
      if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        throw new Error('Formato de hora inválido')
      }
      return hours * 60 + minutes
    }

    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()

    if (
      todaySchedule.closed ||
      !todaySchedule.opening ||
      !todaySchedule.closing
    ) {
      const next = getNextOpenDay(schedule, currentTime, daysOfWeek)

      if (!next)
        return <ContainerStatus status="closed">'Fechado'</ContainerStatus>
      return next.daysFromNow === 1 ? (
        <ContainerStatus status="closed">
          {`Fechado. Abre amanhã às ${next.opening}`}
        </ContainerStatus>
      ) : (
        <ContainerStatus status="closed">
          Fechado. Abre{' '}
          <strong>{dayTranslations[next.dayName].toLowerCase()}</strong> às $
          {next.opening}
        </ContainerStatus>
      )
    }

    const openMinutes = timeToMinutes(todaySchedule.opening)
    const closeMinutes = timeToMinutes(todaySchedule.closing)

    if (nowMinutes < openMinutes) {
      return (
        <ContainerStatus status="closed">
          {`Fechado. Abre às ${todaySchedule.opening}`}
        </ContainerStatus>
      )
    }

    if (nowMinutes >= openMinutes && nowMinutes < closeMinutes) {
      return (
        <ContainerStatus status="open">
          {`Aberto - Fecha às ${todaySchedule.closing}`}
        </ContainerStatus>
      )
    }

    if (nowMinutes >= closeMinutes) {
      const next = getNextOpenDay(schedule, currentTime, daysOfWeek)
      if (!next)
        return <ContainerStatus status="closed">Fechado</ContainerStatus>
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

    return 'Horário indefinido'
  } catch (error) {
    return 'Erro ao processar horários'
  }
}

function getNextOpenDay(
  schedule: WeeklySchedule,
  currentTime: Date,
  daysOfWeek: string[]
): { dayName: string; opening: string; daysFromNow: number } | null {
  const currentIndex = currentTime.getDay()

  for (let i = 1; i <= 7; i++) {
    const nextIndex = (currentIndex + i) % 7
    const dayName = daysOfWeek[nextIndex]
    const daySchedule = schedule[dayName]
    if (
      daySchedule &&
      !daySchedule.closed &&
      daySchedule.opening &&
      daySchedule.closing
    ) {
      return { dayName, opening: daySchedule.opening, daysFromNow: i }
    }
  }

  return null
}
