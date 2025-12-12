import { useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { Button } from '@/shared/ui/Button'
import {
  type Tenant,
  type TenantStatus,
  type BillingStatus,
  type Plan,
} from '../types/tenant'

type TenantFormProps = {
  mode: 'create' | 'edit'
  initialData?: Tenant
  onCancel?: () => void
  onSubmit: (values: TenantFormValues) => void
  isSubmitting?: boolean
}

const statuses: TenantStatus[] = ['active', 'trial', 'suspended', 'disabled']
const billingStatuses: BillingStatus[] = [
  'trial',
  'trial_expired',
  'paid',
  'overdue',
  'cancelled',
]
const plans: Plan[] = ['basic', 'pro', 'enterprise']
export const PASSWORD_PLACEHOLDER = '********'

const createSchema = z.object({
  id: z.string().optional(),
  fullname: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phoneNumber: z.string().optional(),
  status: z.enum(['active', 'trial', 'suspended', 'disabled']).default('trial'),
  billingStatus: z
    .enum(['trial', 'trial_expired', 'paid', 'overdue', 'cancelled'])
    .default('trial'),
  trialEndsAt: z.string().nullable().optional(),
  paidUntil: z.string().nullable().optional(),
  plan: z.enum(['basic', 'pro', 'enterprise']).default('basic'),
})

const updateSchema = createSchema.extend({
  password: z.string().min(6).optional(),
})

export type TenantFormValues = {
  id?: string
  fullname: string
  email: string
  password?: string
  phoneNumber?: string
  status?: TenantStatus
  billingStatus?: BillingStatus
  trialEndsAt?: string | null
  paidUntil?: string | null
  plan?: Plan
}

export function TenantForm({
  mode,
  initialData,
  onCancel,
  onSubmit,
  isSubmitting,
}: TenantFormProps) {
  const { t } = useTranslation()

  const schema = mode === 'create' ? createSchema : updateSchema

  const form = useForm<TenantFormValues, any, TenantFormValues>({
    resolver: zodResolver(schema) as Resolver<TenantFormValues>,
    defaultValues: {
      id: initialData?.id,
      fullname: initialData?.fullname ?? '',
      email: initialData?.email ?? '',
      password: mode === 'edit' ? PASSWORD_PLACEHOLDER : '',
      phoneNumber: initialData?.phoneNumber ?? '',
      status: initialData?.status ?? 'trial',
      billingStatus: initialData?.billingStatus ?? 'trial',
      trialEndsAt: initialData?.trialEndsAt ?? '',
      paidUntil: initialData?.paidUntil ?? '',
      plan: initialData?.plan ?? 'basic',
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        fullname: initialData.fullname,
        email: initialData.email,
        password: PASSWORD_PLACEHOLDER,
        phoneNumber: initialData.phoneNumber ?? '',
        status: initialData.status,
        billingStatus: initialData.billingStatus,
        trialEndsAt: initialData.trialEndsAt ?? '',
        paidUntil: initialData.paidUntil ?? '',
        plan: initialData.plan,
        id: initialData.id,
      })
    }
  }, [form, initialData])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FieldGrid>
        <Field>
          <Label>{t('tenant.form.fullname')}</Label>
          <Input
            {...register('fullname')}
            placeholder={t('tenant.form.fullnamePlaceholder')}
            disabled={isSubmitting}
          />
          {errors.fullname ? (
            <ErrorText>{errors.fullname.message}</ErrorText>
          ) : null}
        </Field>

        <Field>
          <Label>{t('tenant.form.email')}</Label>
          <Input
            type="email"
            {...register('email')}
            placeholder="admin@tenant.com"
            disabled={isSubmitting}
          />
          {errors.email ? <ErrorText>{errors.email.message}</ErrorText> : null}
        </Field>
      </FieldGrid>

      <FieldGrid>
        <Field>
          <Label>
            {t('tenant.form.password')}
            {mode === 'edit' ? (
              <Optional>({t('tenant.form.optional')})</Optional>
            ) : null}
          </Label>
          <Input
            type="password"
            {...register('password')}
            placeholder={
              mode === 'edit'
                ? t('tenant.form.passwordOptional')
                : t('tenant.form.passwordPlaceholder')
            }
            disabled={isSubmitting}
          />
          {mode === 'edit' ? (
            <Helper>{t('tenant.form.passwordHint')}</Helper>
          ) : null}
          {errors.password ? (
            <ErrorText>{errors.password.message}</ErrorText>
          ) : null}
        </Field>

        <Field>
          <Label>{t('tenant.form.phone')}</Label>
          <Input
            {...register('phoneNumber')}
            placeholder="+1 555 123 4567"
            disabled={isSubmitting}
          />
          {errors.phoneNumber ? (
            <ErrorText>{errors.phoneNumber.message}</ErrorText>
          ) : null}
        </Field>
      </FieldGrid>

      <FieldGrid>
        <Field>
          <Label>{t('tenant.form.status')}</Label>
          <Select {...register('status')} disabled={isSubmitting}>
            {statuses.map(status => (
              <option key={status} value={status}>
                {t(`tenant.status.${status}`)}
              </option>
            ))}
          </Select>
        </Field>

        <Field>
          <Label>{t('tenant.form.billingStatus')}</Label>
          <Select {...register('billingStatus')} disabled={isSubmitting}>
            {billingStatuses.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </Field>
      </FieldGrid>

      <FieldGrid>
        <Field>
          <Label>{t('tenant.form.trialEndsAt')}</Label>
          <Input
            type="date"
            {...register('trialEndsAt')}
            disabled={isSubmitting}
          />
        </Field>
        <Field>
          <Label>{t('tenant.form.paidUntil')}</Label>
          <Input
            type="date"
            {...register('paidUntil')}
            disabled={isSubmitting}
          />
        </Field>
      </FieldGrid>

      <Field>
        <Label>{t('tenant.form.plan')}</Label>
        <Select {...register('plan')} disabled={isSubmitting}>
          {plans.map(plan => (
            <option key={plan} value={plan}>
              {plan.toUpperCase()}
            </option>
          ))}
        </Select>
      </Field>

      <Actions>
        {onCancel ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t('common.cancel')}
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {mode === 'create'
            ? t('tenant.form.create')
            : t('tenant.form.update')}
        </Button>
      </Actions>
    </Form>
  )
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const FieldGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

const Optional = styled.span`
  margin-left: 4px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
`

const Helper = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`

const ErrorText = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.destructive};
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.sm};
`
