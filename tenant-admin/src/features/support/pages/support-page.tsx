import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSupportMessageMutation } from '../api/hooks'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/lib/cn'
import { useAuthStore } from '@/shared/store/auth-store'

type LocationState = {
  tenantEmail?: string
  tenantId?: string
}

export function SupportPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const state = (location.state as LocationState) || {}
  const tenantStore = useAuthStore((s) => s.tenant)
  const [email, setEmail] = useState(state.tenantEmail ?? '')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const mutation = useSupportMessageMutation()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate(
      {
        tenantEmail: email || tenantStore?.email || undefined,
        tenantId: state.tenantId ?? tenantStore?.id,
        tenantName: tenantStore?.fullname,
        subject,
        body: message,
      },
      {
        onSuccess: () => {
          setSubject('')
          setMessage('')
        },
      },
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-xl">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">{t('support.title')}</CardTitle>
            <CardDescription>{t('support.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t('form.email')}</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tenant.com"
                  required
                  className={mutation.isError ? 'ring-2 ring-destructive/60' : undefined}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t('support.subject')}</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={t('support.subjectPlaceholder')}
                  required
                  className={mutation.isError ? 'ring-2 ring-destructive/60' : undefined}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t('support.message')}</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('support.messagePlaceholder')}
                  required
                  rows={5}
                  className={cn(
                    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50',
                    mutation.isError ? 'ring-2 ring-destructive/60' : '',
                  )}
                />
              </div>
              {mutation.isError ? (
                <p className="text-sm text-destructive">
                  {mutation.error?.message ?? t('support.error')}
                </p>
              ) : null}
              {mutation.isSuccess ? (
                <p className="text-sm text-emerald-600">{t('support.success')}</p>
              ) : null}
              <div className="flex items-center justify-between pt-2">
                <Button type="button" variant="ghost" onClick={() => navigate('/login')}>
                  {t('support.backToLogin')}
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? t('support.sending') : t('support.send')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
