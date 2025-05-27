import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import { type TextareaHTMLAttributes, forwardRef } from 'react'
import type { FieldError } from 'react-hook-form'

import { cn } from '@/lib/utils'

import { Label } from '../label'

const textAreaVariants = cva(
  'w-full rounded-xl border border-transparent p-3 text-zinc-700 placeholder:text-content-placeholder hover:border-border-secondary active:border-border-tertiary disabled:opacity-70',

  {
    variants: {
      variant: {
        default: 'bg-accent-purple',
        tertiary: 'bg-background-secondary',
        secondary: 'bg-background-tertiary',
        ghost: 'border-border-primary bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textAreaVariants> {
  asChild?: boolean
  error?: FieldError | undefined
  requiredfield?: boolean
  literalerror?: boolean
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      variant,
      requiredfield = false,
      literalerror,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'textarea'

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
          className={cn(textAreaVariants({ variant, className }))}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'

export { TextArea, textAreaVariants }
