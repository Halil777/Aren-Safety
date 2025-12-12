import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTask, deleteTask, fetchTasks, updateTask } from './tasks'
import type { TaskInput, TaskItem } from '../types/task'

export function useTasksQuery() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  })
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTask,
    onSuccess: created => {
      queryClient.setQueryData<TaskItem[]>(['tasks'], old =>
        old ? [created, ...old] : [created],
      )
    },
  })
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskInput }) => updateTask(id, data),
    onSuccess: updated => {
      queryClient.setQueryData<TaskItem[]>(['tasks'], old =>
        old ? old.map(item => (item.id === updated.id ? updated : item)) : [updated],
      )
    },
  })
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, id) => {
      queryClient.setQueryData<TaskItem[]>(['tasks'], old =>
        old ? old.filter(item => item.id !== id) : [],
      )
    },
  })
}
