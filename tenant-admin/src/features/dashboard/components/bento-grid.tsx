import { type HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

export interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 4 | 6
}

export function BentoGrid({
  children,
  className,
  columns = 6,
  ...props
}: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4 md:gap-6',
        columns === 6 && 'grid-cols-1 md:grid-cols-2 xl:grid-cols-6',
        columns === 4 && 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface BentoItemProps extends HTMLAttributes<HTMLDivElement> {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 'full'
  rowSpan?: 1 | 2 | 3 | 4
}

export function BentoItem({
  children,
  className,
  span = 1,
  rowSpan = 1,
  ...props
}: BentoItemProps) {
  const spanClasses = {
    1: 'xl:col-span-1',
    2: 'md:col-span-1 xl:col-span-2',
    3: 'md:col-span-2 xl:col-span-3',
    4: 'md:col-span-2 xl:col-span-4',
    5: 'md:col-span-2 xl:col-span-5',
    6: 'md:col-span-2 xl:col-span-6',
    full: 'col-span-full',
  }

  const rowSpanClasses = {
    1: '',
    2: 'xl:row-span-2',
    3: 'xl:row-span-3',
    4: 'xl:row-span-4',
  }

  return (
    <div
      className={cn(
        'min-h-[200px]',
        spanClasses[span],
        rowSpanClasses[rowSpan],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface BentoSectionProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
}

export function BentoSection({
  title,
  description,
  children,
  className,
  ...props
}: BentoSectionProps) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h2 className="text-2xl font-semibold tracking-tight uppercase">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
