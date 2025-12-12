export type TenantStatus = 'active' | 'trial' | 'suspended' | 'disabled'
export type BillingStatus = 'trial' | 'trial_expired' | 'paid' | 'overdue' | 'cancelled'
export type Plan = 'basic' | 'pro' | 'enterprise'

export type TenantProfile = {
  id: string
  fullname: string
  email: string
  phoneNumber?: string
  status: TenantStatus
  billingStatus?: BillingStatus
  trialEndsAt?: string | null
  paidUntil?: string | null
  plan?: Plan
}
