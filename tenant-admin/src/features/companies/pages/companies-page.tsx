import type React from 'react'
import { Building2, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { PageHeader } from '@/shared/ui/page-header'
import { useProjectsQuery } from '@/features/projects/api/hooks'
import {
  useCompaniesQuery,
  useCreateCompanyMutation,
  useDeleteCompanyMutation,
  useUpdateCompanyMutation,
} from '../api/hooks'
import type { Company, CompanyInput } from '../types/company'

export function CompaniesPage() {
  const { t } = useTranslation()
  const projectsQuery = useProjectsQuery()
  const companiesQuery = useCompaniesQuery()
  const createMutation = useCreateCompanyMutation()
  const updateMutation = useUpdateCompanyMutation()
  const deleteMutation = useDeleteCompanyMutation()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<CompanyForm>({
    projectId: '',
    companyName: '',
    description: '',
  })

  const rows = companiesQuery.data ?? []
  const isLoading = companiesQuery.isLoading
  const error = companiesQuery.error as Error | null | undefined
  const isSaving = createMutation.isPending || updateMutation.isPending

  const handleOpenDrawer = (row?: Company) => {
    if (row) {
      setEditingId(row.id)
      setFormState({
        projectId: row.projectId,
        companyName: row.companyName,
        description: row.description ?? '',
      })
    } else {
      setEditingId(null)
      setFormState({
        projectId: '',
        companyName: '',
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
    const payload: CompanyInput = {
      ...formState,
      description: formState.description.trim() ? formState.description : undefined,
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
        title={t('pages.companies.title', { defaultValue: 'Companies' })}
        description={t('pages.companies.description', {
          defaultValue: 'Track partner companies tied to projects.',
        })}
        actions={
          <Button type="button" variant="outline" onClick={() => handleOpenDrawer()}>
            <Building2 className="mr-2 h-4 w-4" />
            {t('companies.actions.add', { defaultValue: 'Add Company' })}
          </Button>
        }
      />
      <Card>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <Th>{t('companies.table.project', { defaultValue: 'Project' })}</Th>
                  <Th>{t('companies.table.name', { defaultValue: 'Company' })}</Th>
                  <Th>{t('companies.table.description', { defaultValue: 'Description' })}</Th>
                  <Th className="w-32 text-center">
                    {t('companies.table.actions', { defaultValue: 'Actions' })}
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
                      {t('companies.table.empty', { defaultValue: 'No companies yet.' })}
                    </td>
                  </tr>
                ) : (
                  rows.map(row => (
                    <tr key={row.id} className="hover:bg-muted/40">
                      <Td>
                        {row.project?.name ||
                          projectsQuery.data?.find(project => project.id === row.projectId)?.name ||
                          t('common.noData', { defaultValue: 'N/A' })}
                      </Td>
                      <Td>{row.companyName}</Td>
                      <Td className="max-w-xs truncate">
                        {row.description ||
                          t('companies.table.noDescription', { defaultValue: 'No description' })}
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
                    ? t('companies.form.editTitle', { defaultValue: 'Edit Company' })
                    : t('companies.form.createTitle', { defaultValue: 'Add Company' })}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('companies.form.subtitle', {
                    defaultValue: 'Company details',
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
                    {t('companies.form.project', { defaultValue: 'Project' })}
                    <span className="text-destructive">*</span>
                  </span>
                  <select
                    required
                    value={formState.projectId}
                    onChange={e => setFormState(s => ({ ...s, projectId: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <option value="" disabled>
                      {t('companies.form.projectPlaceholder', {
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
                    {t('companies.form.name', { defaultValue: 'Company name' })}
                    <span className="text-destructive">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    value={formState.companyName}
                    onChange={e => setFormState(s => ({ ...s, companyName: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </label>

                <label className="space-y-1 text-sm font-medium text-foreground">
                  <span>{t('companies.form.description', { defaultValue: 'Description' })}</span>
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
                    disabled={!formState.projectId || !formState.companyName.trim() || isSaving}
                  >
                    {editingId
                      ? t('common.save', { defaultValue: 'Save' })
                      : t('companies.actions.add', { defaultValue: 'Add Company' })}
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

type CompanyForm = {
  projectId: string
  companyName: string
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
