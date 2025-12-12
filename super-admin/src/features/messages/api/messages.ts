import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import type { SupportMessage } from '../types/message'

export const fetchMessages = () =>
  apiClient.get<SupportMessage[]>(ROUTES.MESSAGES.LIST)
export const fetchUnreadCount = () =>
  apiClient.get<{ count: number }>(ROUTES.MESSAGES.UNREAD)
export const markMessagesRead = () =>
  apiClient.patch<{ success: boolean }>(ROUTES.MESSAGES.MARK_READ)
