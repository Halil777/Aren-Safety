import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchProjects } from './projects'
import { createProject, updateProject } from './mutations'
import type { Project } from '../types/project'

export function useProjectsQuery() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProject,
    onSuccess: project => {
      queryClient.setQueryData<Project[]>(['projects'], old =>
        old ? [project, ...old] : [project]
      )
    },
  })
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<Project, 'id'> }) =>
      updateProject(id, data),
    onSuccess: updated => {
      queryClient.setQueryData<Project[]>(['projects'], old =>
        old ? old.map(p => (p.id === updated.id ? updated : p)) : [updated]
      )
    },
  })
}
