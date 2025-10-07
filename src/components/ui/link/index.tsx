import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import NextLink from 'next/link'
import { type AnchorHTMLAttributes, forwardRef } from 'react'

import { cn } from '@/lib/utils'

const linkVariants = cva(
  // 'whitespace-nowrap rounded-lg p-3 text-center font-bold text-zinc-700 hover:opacity-95 disabled:opacity-70',
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-border-primary bg-transparent hover:bg-accent hover:text-accent-foreground',
        primary: 'font-normal underline-offset-4 hover:underline',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        tertiary: 'font-semibold underline-offset-4 hover:brightness-95',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        footer:
          'justify-start text-left font-normal text-white transition-all duration-300 ease-in-out hover:cursor-pointer hover:underline hover:underline-offset-4',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface LinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  asChild?: boolean
  href: string
  type?: 'email' | 'phone'
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, asChild = false, href, type, ...props }, ref) => {
    const isSpecialLink = type === 'email' || type === 'phone'
    const Comp = asChild ? Slot : isSpecialLink ? 'a' : NextLink

    const processedHref = (() => {
      switch (type) {
        case 'email':
          return `mailto:${href}`
        case 'phone':
          return `tel:${href}`
        default:
          return href
      }
    })()

    return (
      <Comp
        className={cn(linkVariants({ variant, className }))}
        ref={ref}
        href={processedHref}
        {...props}
      />
    )
  }
)

Link.displayName = 'Link'

export { Link, linkVariants }
