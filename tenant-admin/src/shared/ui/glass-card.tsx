import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/shared/lib/cn'

export type GlassCardVariant = 'subtle' | 'medium' | 'vibrant'

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: GlassCardVariant
  gradient?: boolean
  hover?: boolean
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'medium', gradient = false, hover = true, children, ...props }, ref) => {
    const variantStyles = {
      subtle: 'backdrop-blur-sm bg-glass-white dark:bg-glass-dark',
      medium: 'backdrop-blur-md bg-glass-white-medium dark:bg-glass-dark-medium',
      vibrant: 'backdrop-blur-xl bg-glass-white-strong dark:bg-glass-dark-strong',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-glass-border dark:border-glass-border shadow-lg',
          'transition-all duration-300',
          variantStyles[variant],
          hover && 'hover:-translate-y-1 hover:shadow-2xl',
          gradient && 'relative overflow-hidden',
          className
        )}
        {...props}
      >
        {gradient && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
        )}
        {children}
      </div>
    )
  }
)

GlassCard.displayName = 'GlassCard'

export const GlassCardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('flex flex-col gap-1.5 p-6 pb-4', className)} {...props} />
  }
)

GlassCardHeader.displayName = 'GlassCardHeader'

export const GlassCardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-lg font-semibold leading-none tracking-tight uppercase', className)}
        {...props}
      />
    )
  }
)

GlassCardTitle.displayName = 'GlassCardTitle'

export const GlassCardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
})

GlassCardDescription.displayName = 'GlassCardDescription'

export const GlassCardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  }
)

GlassCardContent.displayName = 'GlassCardContent'

export const GlassCardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  }
)

GlassCardFooter.displayName = 'GlassCardFooter'
