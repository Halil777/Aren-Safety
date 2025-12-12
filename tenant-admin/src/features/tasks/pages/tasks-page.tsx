import type React from 'react'
import { CalendarClock, ListChecks, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { PageHeader } from '@/shared/ui/page-header'
import { useProjectsQuery } from '@/features/projects/api/hooks'
import { useDepartmentsQuery } from '@/features/departments/api/hooks'
import { useCategoriesQuery } from '@/features/categories/api/hooks'
import type { CategoryType } from '@/features/categories/types/category'
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useTasksQuery,
  useUpdateTaskMutation,
} from '../api/hooks'
import type { TaskInput, TaskItem } from '../types/task'

export function TasksPage() {
  const { t } = useTranslation()
  const projectsQuery = useProjectsQuery()
  const departmentsQuery = useDepartmentsQuery()
  const taskCategoryType: CategoryType = 'task'
  const categoriesQuery = useCategoriesQuery(taskCategoryType)
  const tasksQuery = useTasksQuery()
  const createMutation = useCreateTaskMutation()
  const updateMutation = useUpdateTaskMutation()
  const deleteMutation = useDeleteTaskMutation()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<TaskForm>({
    taskName: '',
    description: '',
    projectId: '',
    departmentId: '',
    categoryId: '',
    deadlineDate: '',
    deadlineTime: '',
  })

  const rows = tasksQuery.data ?? []
  const isLoading = tasksQuery.isLoading
  const error = tasksQuery.error as Error | null | undefined
  const isSaving = createMutation.isPending || updateMutation.isPending

  const filteredDepartments =
    departmentsQuery.data?.filter(dep => dep.projectId === formState.projectId) ?? []
  const filteredCategories =
    categoriesQuery.data?.filter(cat => cat.projectId === formState.projectId) ?? []

  const handleOpenDrawer = (row?: TaskItem) => {
    if (row) {
      const deadline = new Date(row.deadline)
      setEditingId(row.id)
      setFormState({
        taskName: row.taskName,
        description: row.description ?? '',
        projectId: row.projectId,
        departmentId: row.departmentId,
        categoryId: row.categoryId,
        deadlineDate: !Number.isNaN(deadline.getTime())
          ? deadline.toISOString().slice(0, 10)
          : '',
        deadlineTime: !Number.isNaN(deadline.getTime())
          ? deadline.toISOString().slice(11, 16)
          : '',
      })
    } else {
      setEditingId(null)
      setFormState({
        taskName: '',
        description: '',
        projectId: '',
        departmentId: '',
        categoryId: '',
        deadlineDate: '',
        deadlineTime: '',
      })
    }
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const deadline = new Date(`${formState.deadlineDate}T${formState.deadlineTime}`)
    if (Number.isNaN(deadline.getTime())) {
      return
    }

    const payload: TaskInput = {
      taskName: formState.taskName,
      description: formState.description.trim() ? formState.description : undefined,
      projectId: formState.projectId,
      departmentId: formState.departmentId,
      categoryId: formState.categoryId,
      deadline: deadline.toISOString(),
    }

    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
    handleCloseDrawer()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.tasks.title', { defaultValue: 'Tasks' })}
        description={t('pages.tasks.description', {
          defaultValue: 'Track and manage safety tasks.',
        })}
        actions={
          <Button type="button" variant="outline" onClick={() => handleOpenDrawer()}>
            <ListChecks className="mr-2 h-4 w-4" />
            {t('tasks.actions.add', { defaultValue: 'Add Task' })}
          </Button>
        }
      />
      <Card>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <Th>{t('tasks.table.name', { defaultValue: 'Task' })}</Th>
                  <Th>{t('tasks.table.project', { defaultValue: 'Project' })}</Th>
                  <Th>{t('tasks.table.department', { defaultValue: 'Department' })}</Th>
                  <Th>{t('tasks.table.category', { defaultValue: 'Category' })}</Th>
                  <Th>{t('tasks.table.deadline', { defaultValue: 'Deadline' })}</Th>
                  <Th className="w-32 text-center">
                    {t('tasks.table.actions', { defaultValue: 'Actions' })}
                  </Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      {t('common.loading', { defaultValue: 'Loading...' })}
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-destructive">
                      {error.message}
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      {t('tasks.table.empty', { defaultValue: 'No tasks yet.' })}
                    </td>
                  </tr>
                ) : (
                  rows.map(row => (
                    <tr key={row.id} className="hover:bg-muted/40">
                      <Td>{row.taskName}</Td>
                      <Td>
                        {row.project?.name ||
                          projectsQuery.data?.find(project => project.id === row.projectId)
                            ?.name ||
                          t('common.noData', { defaultValue: 'N/A' })}
                      </Td>
                      <Td>
                        {row.department?.name ||
                          departmentsQuery.data?.find(dep => dep.id === row.departmentId)?.name ||
                          t('common.noData', { defaultValue: 'N/A' })}
                      </Td>
                      <Td>
                        {row.category?.categoryName ||
                          categoriesQuery.data?.find(cat => cat.id === row.categoryId)
                            ?.categoryName ||
                          t('common.noData', { defaultValue: 'N/A' })}
                      </Td>
                      <Td>{formatDateTime(row.deadline)}</Td>
                      <Td className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            aria-label={t('common.edit', { defaultValue: 'Edit' })}
                            onClick={() => handleOpenDrawer(row)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            aria-label={t('common.delete', { defaultValue: 'Delete' })}
                            onClick={() => handleDelete(row.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {drawerOpen ? (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="h-screen w-full bg-background shadow-2xl md:w-[34%]">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingId
                    ? t('tasks.form.editTitle', { defaultValue: 'Edit Task' })
                    : t('tasks.form.createTitle', { defaultValue: 'Add Task' })}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('tasks.form.subtitle', {
                    defaultValue: 'Task details',
                  })}
                </p>
              </div>
              <Button variant="ghost" onClick={handleCloseDrawer}>
                {t('common.cancel', { defaultValue: 'Cancel' })}
              </Button>
            </div>
            <div className="h-[calc(100vh-64px)] overflow-y-auto p-4">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="space-y-1 text-sm font-medium text-foreground">
                  <span>
                    {t('tasks.form.project', { defaultValue: 'Project' })}
                    <span className="text-destructive">*</span>
                  </span>
                  <select
                    required
                    value={formState.projectId}
                    onChange={e =>
                      setFormState(s => ({
                        ...s,
                        projectId: e.target.value,
                        departmentId: '',
                        categoryId: '',
                        subcategoryId: '',
                      }))
                    }
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <option value="" disabled>
                      {t('tasks.form.projectPlaceholder', {
                        defaultValue: 'Select project',
                      })}
                    </option>
                    {projectsQuery.data?.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1 text-sm font-medium text-foreground">
                  <span>
                    {t('tasks.form.department', { defaultValue: 'Department' })}
                    <span className="text-destructive">*</span>
                  </span>
                  <select
                    required
                    value={formState.departmentId}
                    onChange={e => setFormState(s => ({ ...s, departmentId: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    disabled={!formState.projectId}
                  >
                    <option value="" disabled>
                      {t('tasks.form.departmentPlaceholder', {
                        defaultValue: 'Select department',
                      })}
                    </option>
                    {filteredDepartments.map(department => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1 text-sm font-medium text-foreground">
                  <span>
                    {t('tasks.form.category', { defaultValue: 'Task category' })}
                    <span className="text-destructive">*</span>
                  </span>
                  <select
                    required
                    value={formState.categoryId}
                    onChange={e =>
                      setFormState(s => ({
                        ...s,
                        categoryId: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    disabled={!formState.projectId}
                  >
                    <option value="" disabled>
                      {t('tasks.form.categoryPlaceholder', {
                        defaultValue: 'Select category',
                      })}
                    </option>
                    {filteredCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1 text-sm font-medium text-foreground">
                  <span>
                    {t('tasks.form.name', { defaultValue: 'Task name' })}
                    <span className="text-destructive">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    value={formState.taskName}
                    onChange={e => setFormState(s => ({ ...s, taskName: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </label>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <label className="space-y-1 text-sm font-medium text-foreground">
                    <span>
                      {t('tasks.form.deadlineDate', { defaultValue: 'Deadline date' })}
                      <span className="text-destructive">*</span>
                    </span>
                    <input
                      required
                      type="date"
                      value={formState.deadlineDate}
                      onChange={e => setFormState(s => ({ ...s, deadlineDate: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </label>

                  <label className="space-y-1 text-sm font-medium text-foreground">
                    <span>
                      {t('tasks.form.deadlineTime', { defaultValue: 'Deadline time' })}
                      <span className="text-destructive">*</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        required
                        type="time"
                        value={formState.deadlineTime}
                        onChange={e => setFormState(s => ({ ...s, deadlineTime: e.target.value }))}
                        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      />
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </label>
                </div>

                <label className="space-y-1 text-sm font-medium text-foreground">
                  <span>{t('tasks.form.description', { defaultValue: 'Description' })}</span>
                  <textarea
                    rows={4}
                    value={formState.description}
                    onChange={e => setFormState(s => ({ ...s, description: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </label>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDrawer}>
                    {t('common.cancel', { defaultValue: 'Cancel' })}
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      !formState.projectId ||
                      !formState.departmentId ||
                      !formState.categoryId ||
                      !formState.taskName.trim() ||
                      !formState.deadlineDate ||
                      !formState.deadlineTime ||
                      isSaving
                    }
                  >
                    {editingId
                      ? t('common.save', { defaultValue: 'Save' })
                      : t('tasks.actions.add', { defaultValue: 'Add Task' })}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

type TaskForm = {
  taskName: string
  description: string
  projectId: string
  departmentId: string
  categoryId: string
  deadlineDate: string
  deadlineTime: string
}

const formatDateTime = (value?: string) => {
  if (!value) {
    return '—'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }
  return date.toLocaleString()
}

const Th = (props: React.HTMLAttributes<HTMLTableCellElement>) => (
  <th
    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
    {...props}
  />
)

const Td = (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className="px-4 py-3 text-sm text-foreground align-middle" {...props} />
)
