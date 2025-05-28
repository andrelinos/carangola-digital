import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import clsx from 'clsx'
import { type InputHTMLAttributes, forwardRef } from 'react'
import type { FieldError } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'w-full whitespace-nowrap rounded-xl border border-transparent p-3 placeholder:text-content-placeholder hover:border-border-secondary hover:opacity-95 active:border-border-tertiary disabled:opacity-70',
  {
    variants: {
      variant: {
        default:
          'border-border-primary bg-white font-medium placeholder:text-content-placeholder',
        secondary: 'bg-background-tertiary',
        ghost:
          'border-border-primary bg-white font-medium placeholder:text-zinc-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  asChild?: boolean
  title?: string
  error?: FieldError | undefined
  requiredfield?: boolean
  literalerror?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      type,
      requiredfield = false,
      literalerror,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'input'

    return (
      <div className="relative w-full space-y-1">
        {props?.title && (
          <Label className="flex flex-row gap-2" htmlFor={props?.title}>
            <div>
              <span className="font-bold">{props?.title}</span>
              {requiredfield && (
                <span
                  className="pl-[2px] text-red-400"
                  title="Campo obrigatório"
                  aria-label={props?.title}
                >
                  *
                </span>
              )}
            </div>
            <span className="h-4 text-red-400 text-xs">
              {props?.error &&
                (literalerror ? props.error.message : 'obrigatório')}
            </span>
          </Label>
        )}

        <Comp
          id={props?.title}
          type={type}
          className={cn(
            clsx({
              'ring ring-rose-400': props?.error || literalerror,
              'bg-background-primary': !props?.error && !literalerror,
            }),
            inputVariants({ variant, className })
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input, inputVariants }
