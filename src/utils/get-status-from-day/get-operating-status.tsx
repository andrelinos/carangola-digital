import type { HolidayException, ScheduleDay } from '@/_types/profile-data'
import type { JSX } from 'react'
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

// Helper: Formata data para YYYY-MM-DD (compatível com seus dados)
const getFormattedDate = (date: Date, timeZone: string) => {
  return date.toLocaleDateString('fr-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// Helper: Converte "HH:MM" para minutos
const timeToMinutes = (time: string): number => {
  if (!time || !time.includes(':')) return 0
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function getOperatingStatus({
  schedule,
  currentTime,
  holidayExceptions = [],
}: GetOperatingStatusProps): JSX.Element | string {
  if (!schedule || Object.keys(schedule).length === 0) {
    return 'Nenhum horário cadastrado'
  }

  const timeZone = 'America/Sao_Paulo'

  try {
    // 1. Obter minutos atuais de HOJE
    const timeStringInBrazil = currentTime.toLocaleTimeString('pt-BR', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
    const [currentHour, currentMinute] = timeStringInBrazil.split(':').map(Number)
    const nowMinutes = currentHour * 60 + currentMinute

    // 2. Loop para encontrar o próximo momento de abertura (começando de hoje = 0 até 14 dias)
    for (let daysToAdd = 0; daysToAdd < 14; daysToAdd++) {
      // Cria a data alvo (Hoje + daysToAdd)
      const targetDate = new Date(currentTime)
      targetDate.setDate(currentTime.getDate() + daysToAdd)

      const targetDateString = getFormattedDate(targetDate, timeZone)

      const targetDayName = targetDate.toLocaleDateString('en-US', {
        timeZone,
        weekday: 'long',
      })

      // --- LÓGICA DE PRIORIDADE: Feriado > Dia Normal ---

      // A: Verifica se existe exceção (feriado) para esta data específica
      const holiday = holidayExceptions.find(h => h.date === targetDateString)

      // B: Pega o agendamento base do dia da semana
      const baseSchedule = schedule[targetDayName]

      // C: Define o agendamento efetivo (Feriado sobrescreve base)
      // Se holiday existir, usamos as regras dele. Se não, usamos as do dia da semana.
      const effectiveSchedule: ScheduleDay | HolidayException | undefined = holiday
        ? { ...baseSchedule, ...holiday } // Merge para garantir campos
        : baseSchedule

      // Se não tiver agendamento para este dia (ex: erro de config), pula
      if (!effectiveSchedule) continue

      // Se estiver marcado como FECHADO neste dia específico, pula para o próximo dia do loop
      if (effectiveSchedule.closed) continue

      // Se não tem intervalos definidos e não é "apenas agendamento", considera fechado e pula
      const intervals = effectiveSchedule.intervals || []
      if (!effectiveSchedule.isAppointmentOnly && intervals.length === 0) continue

      // --- VERIFICAÇÃO DE HORÁRIO ---

      // Cenário 1: É HOJE (daysToAdd === 0)
      if (daysToAdd === 0) {
        // Se é apenas agendamento hoje
        if (effectiveSchedule.isAppointmentOnly) {
          return <ContainerStatus status="open">Aberto por Agendamento</ContainerStatus>
        }

        // Verifica os intervalos de hoje
        let isOpenNow = false
        let nextClosing = ''
        let nextOpeningToday = ''

        for (const interval of intervals) {
          if (!interval.opening || !interval.closing) continue
          const start = timeToMinutes(interval.opening)
          const end = timeToMinutes(interval.closing)

          // Está aberto AGORA?
          if (nowMinutes >= start && nowMinutes < end) {
            isOpenNow = true
            nextClosing = interval.closing
            break // Achou, sai do loop de intervalos
          }

          // Vai abrir ainda HOJE mais tarde?
          if (nowMinutes < start) {
            if (!nextOpeningToday) nextOpeningToday = interval.opening // Pega o primeiro horário futuro
          }
        }

        if (isOpenNow) {
          return (
            <ContainerStatus status="open">
              {`Aberto - Fecha às ${nextClosing}`}
            </ContainerStatus>
          )
        }

        if (nextOpeningToday) {
          return (
            <ContainerStatus status="closed">
              {`Fechado - Abre às ${nextOpeningToday}`}
            </ContainerStatus>
          )
        }

        // Se chegou aqui, é hoje mas o horário já passou.
        // O loop 'continue' vai rodar e verificar amanhã (daysToAdd = 1)
        continue
      }

      // Cenário 2: É UM DIA FUTURO (Amanhã ou depois)
      // Se chegamos aqui, encontramos o primeiro dia aberto válido.

      const isTomorrow = daysToAdd === 1
      const dayLabel = isTomorrow
        ? 'amanhã'
        : dayTranslations[targetDayName] || targetDayName

      const formattedLabel = isTomorrow
        ? dayLabel
        : <strong>{dayLabel.toLowerCase()}</strong>

      // Se for apenas por agendamento
      if (effectiveSchedule.isAppointmentOnly) {
        return (
          <ContainerStatus status="closed">
            Fechado - Abre {formattedLabel} por agendamento
          </ContainerStatus>
        )
      }

      // Pega o primeiro horário de abertura do dia encontrado
      const firstOpening = intervals[0]?.opening

      return (
        <ContainerStatus status="closed">
          Fechado - Abre {formattedLabel} às {firstOpening}
        </ContainerStatus>
      )
    }

    return <ContainerStatus status="closed">Fechado temporariamente</ContainerStatus>

  } catch (error) {
    console.error('Erro ao processar status:', error)
    return 'Indisponível'
  }
}
