import type { ProfileDataProps } from '@/_types/profile-data'
import type { JSX } from 'react'
import { ContainerStatus } from './container-status'

type TimeInterval = {
  opening: string
  closing: string
}

type DaySchedule = {
  opening: string
  closing: string
  closed: boolean
  intervals?: TimeInterval[]
}

type WeeklySchedule = Record<string, DaySchedule>

interface GetOperatingStatusProps {
  schedule: WeeklySchedule
  currentTime: Date
  openingHours: ProfileDataProps['openingHours']
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

export function getOperatingStatus({
  schedule,
  currentTime,
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
    // <<-- MUDANÇA PRINCIPAL: Lógica de Fuso Horário -->>
    // Força a data/hora para o fuso horário de São Paulo (padrão para MG, RJ, SP, etc.)
    const timeZone = 'America/Sao_Paulo'

    // Obtém o dia da semana no fuso horário correto
    const todayName = currentTime.toLocaleDateString('en-US', {
      timeZone,
      weekday: 'long',
    })

    // Obtém a hora e minuto atuais no fuso horário correto
    const timeStringInBrazil = currentTime.toLocaleTimeString('pt-BR', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23', // Garante o formato 24h (ex: "17:39")
    })

    const [currentHour, currentMinute] = timeStringInBrazil
      .split(':')
      .map(Number)
    const nowMinutes = currentHour * 60 + currentMinute
    // <<-- FIM DA MUDANÇA DE FUSO HORÁRIO -->>

    const todaySchedule = schedule[todayName]

    if (!todaySchedule) {
      return 'Horário indefinido'
    }

    const timeToMinutes = (time: string): number => {
      // Adicionada uma verificação para evitar erros com strings vazias
      if (!time || !time.includes(':')) return 0
      const [hours, minutes] = time.split(':').map(Number)
      return hours * 60 + minutes
    }

    const intervals = todaySchedule.intervals || []

    // Caso 1: Dia explicitamente fechado ou sem nenhum intervalo de funcionamento.
    if (todaySchedule.closed || intervals.length === 0) {
      const next = getNextOpenDay(schedule, currentTime, daysOfWeek, timeZone)

      if (!next) {
        return <ContainerStatus status="closed">Fechado</ContainerStatus>
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

    // Caso 2: Verificar se está aberto DENTRO de algum dos intervalos.
    for (const interval of intervals) {
      if (!interval.opening || !interval.closing) continue // Ignora intervalos malformados
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

    // Caso 3: Não está aberto agora, então encontrar o PRÓXIMO horário de abertura HOJE.
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

    // Caso 4: Já passou de todos os horários de hoje, encontrar o PRÓXIMO DIA de funcionamento.
    const next = getNextOpenDay(schedule, currentTime, daysOfWeek, timeZone)
    if (!next) {
      return <ContainerStatus status="closed">Fechado</ContainerStatus>
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
  } catch (error) {
    console.error('Erro ao processar horários:', error)
    return 'Erro ao processar horários'
  }
}

function getNextOpenDay(
  schedule: WeeklySchedule,
  currentTime: Date,
  daysOfWeek: string[],
  timeZone: string
): { dayName: string; opening: string; daysFromNow: number } | null {
  // Pega o índice do dia da semana no fuso horário correto
  const dayIndexString = currentTime.toLocaleDateString('en-US', {
    timeZone,
    weekday: 'long',
  })
  const currentIndex = daysOfWeek.indexOf(dayIndexString)

  for (let i = 1; i <= 7; i++) {
    const nextIndex = (currentIndex + i) % 7
    const dayName = daysOfWeek[nextIndex]
    const daySchedule = schedule[dayName]
    if (daySchedule && !daySchedule.closed && daySchedule.opening) {
      return { dayName, opening: daySchedule.opening, daysFromNow: i }
    }
  }

  return null
}
