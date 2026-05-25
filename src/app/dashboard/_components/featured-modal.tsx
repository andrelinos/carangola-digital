'use client'

import { CalendarIcon, Star, StarOff } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { setFeaturedStatus } from '@/actions/business/set-featured-status.action'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FeaturedModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profileId: string
  profileName: string
  currentIsFeatured: boolean
  currentFeaturedStartAt?: number | null
  currentFeaturedEndAt?: number | null
  onSuccess?: (
    profileId: string,
    isFeatured: boolean,
    startAt: string | null,
    endAt: string | null
  ) => void
}

function toInputDate(ts: number | null | undefined): string {
  if (!ts) return ''
  return new Date(ts).toISOString().split('T')[0]
}

export function FeaturedModal({
  open,
  onOpenChange,
  profileId,
  profileName,
  currentIsFeatured,
  currentFeaturedStartAt,
  currentFeaturedEndAt,
  onSuccess,
}: FeaturedModalProps) {
  const [isPending, startTransition] = useTransition()

  // Se já está ativo, pré-preenche com as datas existentes
  const [startDate, setStartDate] = useState<string>(
    toInputDate(currentFeaturedStartAt) ||
      new Date().toISOString().split('T')[0]
  )
  const [endDate, setEndDate] = useState<string>(
    toInputDate(currentFeaturedEndAt) || ''
  )

  const isActivating = !currentIsFeatured

  function handleSubmit() {
    if (isActivating && !startDate) {
      toast.error('Informe ao menos a data de início.')
      return
    }
    if (endDate && startDate && endDate < startDate) {
      toast.error('A data de término deve ser posterior à data de início.')
      return
    }

    startTransition(async () => {
      const result = await setFeaturedStatus({
        profileId,
        isFeatured: isActivating,
        featuredStartAt: isActivating ? startDate : null,
        featuredEndAt: isActivating ? endDate || null : null,
      })

      if (result.success) {
        toast.success(result.message)
        onSuccess?.(
          profileId,
          isActivating,
          isActivating ? startDate : null,
          isActivating ? endDate || null : null
        )
        onOpenChange(false)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-y-auto rounded-[3rem] p-10 py-8">
        <DialogHeader className="space-y-4">
          <div
            className={cn(
              'mx-auto flex size-16 items-center justify-center rounded-full',
              isActivating ? 'bg-amber-50' : 'bg-slate-100'
            )}
          >
            {isActivating ? (
              <Star className="size-8 fill-amber-400 text-amber-400" />
            ) : (
              <StarOff className="size-8 text-slate-500" />
            )}
          </div>

          <div className="text-center">
            <DialogTitle className="font-black text-2xl text-slate-900 uppercase tracking-tighter">
              {isActivating ? 'Destacar Empresa' : 'Remover Destaque'}
            </DialogTitle>
            <p className="mt-1 font-medium text-slate-500 text-sm">
              {isActivating
                ? 'A empresa aparecerá na seção de destaques da plataforma.'
                : 'A empresa deixará de aparecer na seção de destaques.'}
            </p>
          </div>
        </DialogHeader>

        {/* Profile info */}
        <div className="my-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
          <p className="mb-1 font-black text-[10px] text-slate-400 uppercase tracking-widest">
            Empresa Selecionada
          </p>
          <h4 className="font-black text-lg text-slate-900 italic">
            "{profileName}"
          </h4>
          <Badge
            className={cn(
              'mt-2 rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-widest',
              currentIsFeatured
                ? 'bg-amber-100 text-amber-700'
                : 'bg-slate-100 text-slate-500'
            )}
          >
            {currentIsFeatured ? '★ Em Destaque' : 'Sem Destaque'}
          </Badge>
        </div>

        {/* Date range — only shown when activating */}
        {isActivating && (
          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label
                htmlFor="featured-start"
                className="ml-1 flex items-center gap-2 font-black text-slate-900 text-xs uppercase tracking-widest"
              >
                <CalendarIcon className="size-3 text-slate-400" />
                Data de Início
                <span className="font-medium text-destructive">*</span>
              </Label>
              <input
                id="featured-start"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-800 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="featured-end"
                className="ml-1 flex items-center gap-2 font-black text-slate-900 text-xs uppercase tracking-widest"
              >
                <CalendarIcon className="size-3 text-slate-400" />
                Data de Término
                <span className="ml-1 font-medium text-[10px] text-slate-400 normal-case tracking-normal">
                  (opcional — sem data = indefinido)
                </span>
              </Label>
              <input
                id="featured-end"
                type="date"
                value={endDate}
                min={startDate}
                onChange={e => setEndDate(e.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-800 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
              {!endDate && (
                <p className="ml-1 font-medium text-[10px] text-amber-600 italic">
                  Sem data de término: o destaque ficará ativo indefinidamente.
                </p>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="mt-4 flex flex-col gap-3 sm:flex-col">
          <Button
            className={cn(
              'h-14 w-full rounded-2xl font-black text-white text-xs uppercase tracking-widest shadow-xl',
              isActivating
                ? 'bg-amber-500 shadow-amber-200 hover:bg-amber-600'
                : 'bg-slate-700 shadow-slate-200 hover:bg-slate-800'
            )}
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending
              ? 'Salvando...'
              : isActivating
                ? '★ Confirmar Destaque'
                : 'Confirmar Remoção'}
          </Button>

          <DialogClose asChild>
            <Button
              variant="ghost"
              className="h-12 w-full rounded-2xl font-bold text-[10px] text-slate-400 uppercase tracking-widest hover:text-slate-600"
              disabled={isPending}
            >
              Cancelar e Voltar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
