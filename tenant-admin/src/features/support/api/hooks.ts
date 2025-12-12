import { useMutation } from '@tanstack/react-query'
import { sendSupportMessage } from './messages'
import type { SupportMessageInput } from '../types/message'

export function useSupportMessageMutation() {
  return useMutation({
    mutationFn: (input: SupportMessageInput) => sendSupportMessage(input),
  })
}
