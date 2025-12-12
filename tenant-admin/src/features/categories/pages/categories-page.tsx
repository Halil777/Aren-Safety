import type React from 'react'
import { FolderTree, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { PageHeader } from '@/shared/ui/page-header'
import { useProjectsQuery } from '@/features/projects/api/hooks'
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '../api/hooks'
import type { Category, CategoryInput, CategoryType } from '../types/category'

export function CategoriesPage() {
  const { t } = useTranslation()
  const projectsQuery = useProjectsQuery()

  const observationQuery = useCategoriesQuery('observation')
  const taskQuery = useCategoriesQuery('task')

  const createMutation = useCreateCategoryMutation()
  const updateMutation = useUpdateCategoryMutation()
  const deleteMutation = useDeleteCategoryMutation()

  const [activeTab, setActiveTab] = useState<CategoryType>('observation')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<CategoryForm>({
    projectId: '',
    categoryName: '',
  })

  const currentQuery = activeTab === 'observation' ? observationQuery : taskQuery
  const currentRows = currentQuery.data ?? []
  const isLoading = currentQuery.isLoading
  const error = currentQuery.error as Error | null | undefined
  const isSaving = createMutation.isPending || updateMutation.isPending

  const tabs: TabItem[] = [
    {
      key: 'observation',
      label: t('categories.tabs.observation', { defaultValue: 'Observation Category' }),
    },
    {
      key: 'task',
      label: t('categories.tabs.task', { defaultValue: 'Task Category' }),
    },
  ]

  const handleOpenDrawer = (row?: Category) => {
    if (row) {
      setEditingId(row.id)
      setFormState({ projectId: row.projectId, categoryName: row.categoryName })
    } else {
      setEditingId(null)
      setFormState({ projectId: '', categoryName: '' })
    }
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ type: activeTab, id })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: CategoryInput = {
      projectId: formState.projectId,
      categoryName: formState.categoryName,
    }

    if (editingId) {
      await updateMutation.mutateAsync({ type: activeTab, id: editingId, data: payload })
    } else {
      await createMutation.mutateAsync({ type: activeTab, data: payload })
    }

    handleCloseDrawer()
  }

  const handleTabChange = (key: CategoryType) => {
    setActiveTab(key)
    handleCloseDrawer()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.categories.title')}
        description={t('pages.categories.description')}
        actions={
          <Button type="button" variant="secondary" onClick={() => handleOpenDrawer()}>
            <FolderTree className="mr-2 h-4 w-4" />
            {t('categories.actions.addCategory', { defaultValue: 'Add Category' })}
          </Button>
        }
      />
      <Card>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {tabs.map(tab => (
              <Button
                key={tab.key}
                type="button"
                variant={activeTab === tab.key ? 'default' : 'ghost'}
                onClick={() => handleTabChange(tab.key)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <Th>{t('categories.table.project', { defaultValue: 'Project' })}</Th>
                  <Th>{t('categories.table.category', { defaultValue: 'Category' })}</Th>
                  <Th className="w-32 text-center">
                    {t('categories.table.actions', { defaultValue: 'Actions' })}
                  </Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      {t('common.loading', { defaultValue: 'Loading...' })}
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-sm text-destructive"
                    >
                      {error.message}
                    </td>
                  </tr>
                ) : currentRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      {t('categories.table.empty', { defaultValue: 'No categories yet.' })}
                    </td>
                  </tr>
                ) : (
                  currentRows.map(row => (
                    <tr key={row.id} className="hover:bg-muted/40">
                      <Td>
                        {row.project?.name ||
                          projectsQuery.data?.find(p => p.id === row.projectId)?.name ||
                          t('common.noData', { defaultValue: 'N/A' })}
                      </Td>
                      <Td>{row.categoryName}</Td>
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
          <div className="h-screen w-full bg-background shadow-2xl md:w-[30%]">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingId
                    ? t('categories.form.editTitle', { defaultValue: 'Edit category' })
                    : t('categories.form.createTitle', { defaultValue: 'Add category' })}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {activeTab === 'observation'
                    ? t('categories.form.observationSubtitle', {
                        defaultValue: 'Observation category details',
                      })
                    : t('categories.form.taskSubtitle', {
                        defaultValue: 'Task category details',
                      })}
                </p>
              </div>
              <Button variant="ghost" onClick={handleCloseDrawer}>
                {t('common.cancel')}
              </Button>
            </div>
            <div className="h-[calc(100vh-64px)] overflow-y-auto p-4">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="space-y-1 text-sm font-medium text-foreground">
                  <span>
                    {t('categories.form.project', { defaultValue: 'Project' })}
                    <span className="text-destructive">*</span>
                  </span>
                  <select
                    required
                    value={formState.projectId}
                    onChange={e => setFormState(s => ({ ...s, projectId: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <option value="" disabled>
                      {t('categories.form.projectPlaceholder', { defaultValue: 'Select project' })}
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
                    {t('categories.form.name', { defaultValue: 'Category name' })}
                    <span className="text-destructive">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    value={formState.categoryName}
                    onChange={e =>
                      setFormState(s => ({ ...s, categoryName: e.target.value }))
                    }
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </label>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDrawer}>
                    {t('common.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={!formState.projectId || !formState.categoryName || isSaving}
                  >
                    {editingId
                      ? t('common.save', { defaultValue: 'Save' })
                      : t('categories.actions.addCategory', { defaultValue: 'Add Category' })}
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

type TabItem = {
  key: CategoryType
  label: string
}

type CategoryForm = {
  projectId: string
  categoryName: string
}

const Th = (props: React.HTMLAttributes<HTMLTableCellElement>) => (
  <th
    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap"
    {...props}
  />
)

const Td = (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className="px-4 py-3 text-sm text-foreground align-middle" {...props} />
)
