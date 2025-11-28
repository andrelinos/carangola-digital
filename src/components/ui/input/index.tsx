'use client'

import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import clsx from 'clsx'
import Link from 'next/link'

import { type InputHTMLAttributes, forwardRef } from 'react'
import type { FieldError } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'


const inputVariants = cva(
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  {
    variants: {
      variant: {
        default:
          'border-border-primary font-medium placeholder:text-content-placeholder',
        secondary: 'bg-background-tertiary',
        ghost: 'border-border-primary font-medium placeholder:text-zinc-300',
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
  isOnlyPremium?: boolean
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
      isOnlyPremium = false,
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
              <div className="flex items-center gap-2">
                <span className="font-bold">{props?.title}</span>
                <div className='flex'>
                  {isOnlyPremium ? (
                    <Link

                      href="/#plan"
                      className='p-0 text-blue-500 text-xs hover:text-blue-600'
                    >
                      upgrade
                    </Link>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              {requiredfield && (
                <span
                  className="pl-0.5 text-red-400"
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
