import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import type { SupportMessageInput } from '../types/message'

export const sendSupportMessage = (input: SupportMessageInput) =>
  apiClient.post<void>(ROUTES.MESSAGES.CREATE, input)
