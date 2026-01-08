import type React from 'react'
import { Pencil, Tag, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { PageHeader } from '@/shared/ui/page-header'
import { useProjectsQuery } from '@/features/projects/api/hooks'
import {
  useCreateTypeMutation,
  useDeleteTypeMutation,
  useTypesQuery,
  useUpdateTypeMutation,
} from '../api/hooks'
import type { TypeInput, TypeItem } from '../types/type'

export function TypesPage() {
  const { t } = useTranslation()
  const projectsQuery = useProjectsQuery()
  const typesQuery = useTypesQuery()
  const createMutation = useCreateTypeMutation()
  const updateMutation = useUpdateTypeMutation()
  const deleteMutation = useDeleteTypeMutation()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<TypeForm>({
    projectId: '',
    typeName: '',
    description: '',
  })

  const rows = typesQuery.data ?? []
  const isLoading = typesQuery.isLoading
  const error = typesQuery.error as Error | null | undefined
  const isSaving = createMutation.isPending || updateMutation.isPending

  const handleOpenDrawer = (row?: TypeItem) => {
    if (row) {
      setEditingId(row.id)
      setFormState({
        projectId: row.projectId,
        typeName: row.typeName,
        description: row.description ?? '',
      })
    } else {
      setEditingId(null)
      setFormState({
        projectId: '',
        typeName: '',
        description: '',
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
    const payload: TypeInput = {
      projectId: formState.projectId,
      typeName: formState.typeName,
      description: formState.description?.trim() ? formState.description : undefined,
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
        title={t('pages.types.title', { defaultValue: 'Types' })}
        description={t('pages.types.description', {
          defaultValue: 'Define observation or task types.',
        })}
        actions={
          <Button type="button" variant="outline" onClick={() => handleOpenDrawer()}>
            <Tag className="mr-2 h-4 w-4" />
            {t('types.actions.add', { defaultValue: 'Add Type' })}
          </Button>
        }
      />
      <Card>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <Th>{t('types.table.project', { defaultValue: 'Project' })}</Th>
                  <Th>{t('types.table.name', { defaultValue: 'Type name' })}</Th>
                  <Th>{t('types.table.description', { defaultValue: 'Description' })}</Th>
                  <Th className="w-32 text-center">
                    {t('types.table.actions', { defaultValue: 'Actions' })}
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
                    <td colSpan={4} className="px-4 py-6 text-center text-sm text-destructive">
                      {error.message}
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      {t('types.table.empty', { defaultValue: 'No types yet.' })}
                    </td>
                  </tr>
                ) : (
                  rows.map(row => (
                    <tr key={row.id} className="hover:bg-muted/40">
                      <Td>
                        {row.project?.name ||
                          projectsQuery.data?.find(project => project.id === row.projectId)
                            ?.name ||
                          t('common.noData', { defaultValue: 'N/A' })}
                      </Td>
                      <Td>{row.typeName}</Td>
                      <Td className="max-w-xs truncate">
                        {row.description ||
                          t('types.table.noDescription', { defaultValue: 'No description' })}
                      </Td>
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
          <div className="h-screen w-full bg-background shadow-2xl md:w-[32%]">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-lg font-semibold uppercase">
                  {editingId
                    ? t('types.form.editTitle', { defaultValue: 'Edit Type' })
                    : t('types.form.createTitle', { defaultValue: 'Add Type' })}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('types.form.subtitle', {
                    defaultValue: 'Type details',
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
                    {t('types.form.project', { defaultValue: 'Project' })}
                    <span className="text-destructive">*</span>
                  </span>
                  <select
                    required
                    value={formState.projectId}
                    onChange={e => setFormState(s => ({ ...s, projectId: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <option value="" disabled>
                      {t('types.form.projectPlaceholder', {
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
                    {t('types.form.name', { defaultValue: 'Type name' })}
                    <span className="text-destructive">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    value={formState.typeName}
                    onChange={e => setFormState(s => ({ ...s, typeName: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </label>

                <label className="space-y-1 text-sm font-medium text-foreground">
                  <span>{t('types.form.description', { defaultValue: 'Description' })}</span>
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
                      !formState.projectId || !formState.typeName.trim() || isSaving
                    }
                  >
                    {editingId
                      ? t('common.save', { defaultValue: 'Save' })
                      : t('types.actions.add', { defaultValue: 'Add Type' })}
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

type TypeForm = {
  projectId: string
  typeName: string
  description: string
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
