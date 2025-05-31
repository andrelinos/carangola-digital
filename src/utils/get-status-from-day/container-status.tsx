import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface Props {
  status:
    | 'open'
    | 'closed'
    | 'undefinedTime'
    | 'permanentlyClosed'
    | 'onVacation'
    | 'onHolidayBreak'
  children: ReactNode
}

export function ContainerStatus({ status, children }: Props) {
  return (
    <div
      className={cn(
        clsx(
          'relative flex w-full max-w-md flex-col items-center gap-1 p-2 [data-state=open]:rounded-none',
          {
            'bg-green-50 text-green-900': status === 'open',
            'bg-red-50 text-red-900': status === 'closed',
            'bg-yellow-50 text-yellow-600': status === 'undefinedTime',
            'bg-gray-50 text-gray-800': status === 'permanentlyClosed',
            'bg-blue-50 text-blue-800': status === 'onVacation',
            'bg-purple-50 text-purple-800': status === 'onHolidayBreak',
          }
        )
      )}
    >
      <div className="flex h-10 w-full items-center gap-2">
        <div className="flex-1 text-center font-medium">{children}</div>
        <ChevronDown />
      </div>
    </div>
  )
}
