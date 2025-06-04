import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import NextLink from 'next/link'
import { type AnchorHTMLAttributes, forwardRef } from 'react'

import { cn } from '@/lib/utils'

const linkVariants = cva(
  'whitespace-nowrap rounded-lg p-3 text-center font-bold text-zinc-700 hover:opacity-95 disabled:opacity-70',
  {
    variants: {
      variant: {
        default: 'bg-blue-500 hover:cursor-pointer',
        primary: 'font-semibold underline-offset-4 hover:underline',
        secondary: 'bg-zinc-600 text-white',
        ghost: 'border-border-primary bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface LinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  asChild?: boolean
  href: string
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, asChild = false, href, ...props }, ref) => {
    const Comp = asChild ? Slot : NextLink

    return (
      <Comp
        className={cn(linkVariants({ variant, className }))}
        ref={ref}
        href={href}
        {...props}
      />
    )
  }
)

Link.displayName = 'Link'

export { Link, linkVariants }
