import type React from 'react'
import { GitBranch, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { PageHeader } from '@/shared/ui/page-header'
import { useProjectsQuery } from '@/features/projects/api/hooks'
import { useCategoriesQuery } from '@/features/categories/api/hooks'
import type { CategoryType } from '@/features/categories/types/category'
import {
  useCreateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useSubcategoriesQuery,
  useUpdateSubcategoryMutation,
} from '../api/hooks'
import type { Subcategory, SubcategoryInput } from '../types/subcategory'

export function SubcategoriesPage() {
  const { t } = useTranslation()
  const projectsQuery = useProjectsQuery()
  const observationCategories = useCategoriesQuery('observation')
  const taskCategories = useCategoriesQuery('task')

  const observationSubcategories = useSubcategoriesQuery('observation')
  const taskSubcategories = useSubcategoriesQuery('task')

  const createMutation = useCreateSubcategoryMutation()
  const updateMutation = useUpdateSubcategoryMutation()
  const deleteMutation = useDeleteSubcategoryMutation()

  const [activeTab, setActiveTab] = useState<CategoryType>('observation')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<SubcategoryForm>({
    categoryId: '',
    subcategoryName: '',
  })

  const currentSubcategories =
    activeTab === 'observation' ? observationSubcategories : taskSubcategories
  const currentCategories = activeTab === 'observation' ? observationCategories : taskCategories
  const rows = currentSubcategories.data ?? []
  const isLoading = currentSubcategories.isLoading
  const error = currentSubcategories.error as Error | null | undefined
  const isSaving = createMutation.isPending || updateMutation.isPending

  const tabs: TabItem[] = [
    {
      key: 'observation',
      label: t('subcategories.tabs.observation', { defaultValue: 'Observation Subcategory' }),
    },
    {
      key: 'task',
      label: t('subcategories.tabs.task', { defaultValue: 'Task Subcategory' }),
    },
  ]

  const handleOpenDrawer = (row?: Subcategory) => {
    if (row) {
      setEditingId(row.id)
      setFormState({
        categoryId: row.categoryId,
        subcategoryName: row.subcategoryName,
      })
    } else {
      setEditingId(null)
      setFormState({ categoryId: '', subcategoryName: '' })
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
    const payload: SubcategoryInput = {
      categoryId: formState.categoryId,
      subcategoryName: formState.subcategoryName,
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
        title={t('pages.subcategories.title', { defaultValue: 'Subcategories' })}
        description={t('pages.subcategories.description', {
          defaultValue: 'Manage nested category structures.',
        })}
        actions={
          <Button type="button" variant="outline" onClick={() => handleOpenDrawer()}>
            <GitBranch className="mr-2 h-4 w-4" />
            {t('subcategories.actions.add', { defaultValue: 'Add Subcategory' })}
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
                  <Th>{t('subcategories.table.project', { defaultValue: 'Project' })}</Th>
                  <Th>{t('subcategories.table.category', { defaultValue: 'Category' })}</Th>
                  <Th>{t('subcategories.table.subcategory', { defaultValue: 'Subcategory' })}</Th>
                  <Th className="w-32 text-center">
                    {t('subcategories.table.actions', { defaultValue: 'Actions' })}
                  </Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      {t('common.loading', { defaultValue: 'Loading...' })}
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-sm text-destructive"
                    >
                      {error.message}
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      {t('subcategories.table.empty', { defaultValue: 'No subcategories yet.' })}
                    </td>
                  </tr>
                ) : (
                  rows.map(row => (
                    <tr key={row.id} className="hover:bg-muted/40">
                      <Td>
                        {row.project?.name ||
                          projectsQuery.data?.find(p => p.id === row.projectId)?.name ||
                          t('common.noData', { defaultValue: 'N/A' })}
                      </Td>
                      <Td>
                        {row.category?.categoryName ||
                          currentCategories.data?.find(c => c.id === row.categoryId)?.categoryName ||
                          t('common.noData', { defaultValue: 'N/A' })}
                      </Td>
                      <Td>{row.subcategoryName}</Td>
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
                    ? t('subcategories.form.editTitle', { defaultValue: 'Edit subcategory' })
                    : t('subcategories.form.createTitle', { defaultValue: 'Add subcategory' })}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {activeTab === 'observation'
                    ? t('subcategories.form.observationSubtitle', {
                        defaultValue: 'Observation subcategory details',
                      })
                    : t('subcategories.form.taskSubtitle', {
                        defaultValue: 'Task subcategory details',
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
                    {t('subcategories.form.category', { defaultValue: 'Category' })}
                    <span className="text-destructive">*</span>
                  </span>
                  <select
                    required
                    value={formState.categoryId}
                    onChange={e => setFormState(s => ({ ...s, categoryId: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <option value="" disabled>
                      {t('subcategories.form.categoryPlaceholder', {
                        defaultValue: 'Select category',
                      })}
                    </option>
                    {currentCategories.data?.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1 text-sm font-medium text-foreground">
                  <span>
                    {t('subcategories.form.name', { defaultValue: 'Subcategory name' })}
                    <span className="text-destructive">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    value={formState.subcategoryName}
                    onChange={e =>
                      setFormState(s => ({ ...s, subcategoryName: e.target.value }))
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
                    disabled={!formState.categoryId || !formState.subcategoryName || isSaving}
                  >
                    {editingId
                      ? t('common.save', { defaultValue: 'Save' })
                      : t('subcategories.actions.add', { defaultValue: 'Add Subcategory' })}
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

type SubcategoryForm = {
  categoryId: string
  subcategoryName: string
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
