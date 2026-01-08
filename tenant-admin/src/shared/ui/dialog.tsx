import { createContext, forwardRef, useContext, useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom'
import type { HTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '@/shared/lib/cn'

type DialogContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = createContext<DialogContextValue | null>(null)

type DialogProps = PropsWithChildren<{
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}>

export function Dialog({ children, open, defaultOpen = false, onOpenChange }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isControlled = typeof open === 'boolean'
  const resolvedOpen = isControlled ? open : uncontrolledOpen

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  const value = useMemo(() => ({ open: resolvedOpen, setOpen }), [resolvedOpen])

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
}

type DialogContentProps = HTMLAttributes<HTMLDivElement>

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { className, children, ...props },
  ref,
) {
  const ctx = useDialogContext()

  useEffect(() => {
    if (!ctx.open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') ctx.setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [ctx])

  if (!ctx.open) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={() => ctx.setOpen(false)}
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full max-w-lg rounded-2xl border border-border/70 bg-card p-6 shadow-2xl outline-none ring-1 ring-primary/10',
          'animate-in fade-in-0 zoom-in-95',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
})

export function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4 space-y-1.5', className)} {...props} />
}

export function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />
  )
}

export function DialogTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-semibold leading-tight tracking-tight uppercase', className)} {...props} />
  )
}

export function DialogDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
}

function useDialogContext() {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error('Dialog components must be used within <Dialog>')
  return ctx
}
