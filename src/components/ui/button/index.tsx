import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'whitespace-nowrap rounded-lg p-3 font-bold text-white hover:opacity-95 disabled:opacity-70',
  {
    variants: {
      variant: {
        default: 'bg-blue-500 text-white hover:cursor-pointer',
        secondary: 'bg-background-tertiary',
        ghost: 'border-border-primary bg-transparent text-zinc-700',
        new: 'm-0 flex items-center border border-zinc-400 py-1 text-xs text-zinc-700 hover:cursor-pointer hover:border-blue-500 hover:bg-blue-500 hover:text-white',
        link: 'bg-transparent text-blue-500 underline-offset-4 hover:underline',
        destructive: 'bg-red-500 hover:cursor-pointer',
        outline:
          'border border-border-primary bg-transparent hover:cursor-pointer',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
