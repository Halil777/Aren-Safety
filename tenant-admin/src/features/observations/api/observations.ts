import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import type { Observation, ObservationInput } from '../types/observation'

export async function fetchObservations(): Promise<Observation[]> {
  return apiClient.get<Observation[]>(ROUTES.OBSERVATIONS.LIST)
}

export async function createObservation(data: ObservationInput) {
  return apiClient.post<Observation>(ROUTES.OBSERVATIONS.LIST, data)
}

export async function updateObservation(id: string, data: Partial<ObservationInput>) {
  return apiClient.patch<Observation>(ROUTES.OBSERVATIONS.DETAIL(id), data)
}

export async function deleteObservation(id: string) {
  try {
    return await apiClient.delete<unknown>(ROUTES.OBSERVATIONS.DETAIL(id))
  } catch (error) {
    const status = (error as { status?: number }).status
    // Treat missing rows as already-deleted so UI stays in sync even if backend row is gone.
    if (status === 404) {
      return undefined
    }
    throw error
  }
}

export type ObservationMediaPayload = {
  type: 'IMAGE' | 'VIDEO'
  url: string
  uploadedByUserId: string
  isCorrective: boolean
}

export async function addObservationMedia(observationId: string, data: ObservationMediaPayload) {
  return apiClient.post<unknown>(`${ROUTES.OBSERVATIONS.DETAIL(observationId)}/media`, data)
}
