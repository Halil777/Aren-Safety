import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchMessages, fetchUnreadCount, markMessagesRead } from './messages'
import type { SupportMessage } from '../types/message'

export function useMessagesQuery() {
  return useQuery<SupportMessage[]>({
    queryKey: ['messages'],
    queryFn: fetchMessages,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })
}

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: ['messages', 'unread-count'],
    queryFn: async () => {
      const res = await fetchUnreadCount()
      return res.count
    },
    staleTime: 5_000,
    gcTime: 60_000,
    refetchInterval: 10_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  })
}

export function useMarkMessagesReadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markMessagesRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['messages', 'unread-count'],
      })
      void queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
}
