import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type TextareaHTMLAttributes } from 'react'
import type { FieldError } from 'react-hook-form'

import { cn } from '@/lib/utils'

import { Label } from '../label'

const textAreaVariants = cva(
  'w-full rounded-xl border border-input bg-background p-3 text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-70',
  {
    variants: {
      variant: {
        default:
          'border-input bg-background placeholder:text-muted-foreground/60',
        secondary:
          'border-transparent bg-muted text-muted-foreground placeholder:text-muted-foreground/50',
        tertiary:
          'border-transparent bg-muted/50 text-muted-foreground placeholder:text-muted-foreground/50',
        ghost:
          'border-transparent bg-transparent placeholder:text-muted-foreground/60',
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
          className={cn(
            (props?.error || literalerror) &&
              'border-destructive ring-destructive focus-visible:ring-destructive',
            textAreaVariants({ variant, className })
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'

export { TextArea, textAreaVariants }
