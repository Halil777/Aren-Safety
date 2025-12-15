import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addObservationMedia,
  createObservation,
  deleteObservation,
  fetchObservations,
  updateObservation,
  type ObservationMediaPayload,
} from './observations'
import type { Observation, ObservationInput } from '../types/observation'

export function useObservationsQuery() {
  return useQuery({
    queryKey: ['observations'],
    queryFn: fetchObservations,
  })
}

export function useCreateObservationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createObservation,
    onSuccess: created => {
      queryClient.setQueryData<Observation[]>(['observations'], old =>
        old ? [created, ...old] : [created],
      )
    },
  })
}

export function useUpdateObservationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ObservationInput> }) =>
      updateObservation(id, data),
    onSuccess: updated => {
      queryClient.setQueryData<Observation[]>(['observations'], old =>
        old ? old.map(item => (item.id === updated.id ? updated : item)) : [updated],
      )
    },
  })
}

export function useAddObservationMediaMutation() {
  return useMutation({
    mutationFn: ({ observationId, data }: { observationId: string; data: ObservationMediaPayload }) =>
      addObservationMedia(observationId, data),
  })
}

export function useDeleteObservationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteObservation,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Observation[]>(['observations'], old =>
        old ? old.filter(item => item.id !== id) : [],
      )
    },
  })
}
