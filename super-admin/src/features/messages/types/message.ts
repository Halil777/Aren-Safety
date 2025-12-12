export type SupportMessage = {
  id: string
  tenantId: string | null
  tenantEmail: string | null
  tenantName: string | null
  subject: string
  body: string
  status: 'new' | 'read'
  createdAt: string
}
