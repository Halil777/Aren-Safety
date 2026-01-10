import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import type { Observation, ObservationInput } from '../types/observation'

// Temporary mapping: Frontend uses "OPEN", Backend uses "NEW"
function mapStatusToBackend(status: string | undefined): string | undefined {
  if (status === 'OPEN') return 'NEW'
  return status
}

function mapStatusFromBackend(status: string): string {
  if (status === 'NEW') return 'OPEN'
  return status
}

function mapObservationFromBackend(obs: Observation): Observation {
  return {
    ...obs,
    status: mapStatusFromBackend(obs.status) as Observation['status']
  }
}

export async function fetchObservations(): Promise<Observation[]> {
  const observations = await apiClient.get<Observation[]>(ROUTES.OBSERVATIONS.LIST)
  return observations.map(mapObservationFromBackend)
}

export async function createObservation(data: ObservationInput) {
  const backendData = {
    ...data,
    status: mapStatusToBackend(data.status) as ObservationInput['status']
  }
  const observation = await apiClient.post<Observation>(ROUTES.OBSERVATIONS.LIST, backendData)
  return mapObservationFromBackend(observation)
}

export async function updateObservation(id: string, data: Partial<ObservationInput>) {
  const backendData = {
    ...data,
    status: data.status ? mapStatusToBackend(data.status) as ObservationInput['status'] : undefined
  }
  const observation = await apiClient.patch<Observation>(ROUTES.OBSERVATIONS.DETAIL(id), backendData)
  return mapObservationFromBackend(observation)
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
