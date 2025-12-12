import type React from 'react'
import { ClipboardList, Pencil } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { PageHeader } from '@/shared/ui/page-header'
import { useProjectsQuery } from '@/features/projects/api/hooks'
import { useDepartmentsQuery } from '@/features/departments/api/hooks'
import { useCategoriesQuery } from '@/features/categories/api/hooks'
import { useSubcategoriesQuery } from '@/features/subcategories/api/hooks'
import { useMobileUsersQuery } from '@/features/users/api/hooks'
import { useSupervisorsQuery } from '@/features/supervisors/api/hooks'
import {
  useAddObservationMediaMutation,
  useCreateObservationMutation,
  useObservationsQuery,
  useUpdateObservationMutation,
} from '../api/hooks'
import type { Observation, ObservationInput, ObservationStatus } from '../types/observation'

const statusOptions: ObservationStatus[] = [
  'NEW',
  'SEEN_BY_SUPERVISOR',
  'IN_PROGRESS',
  'FIXED_PENDING_CHECK',
  'CLOSED',
]

export function ObservationsPage() {
  const { t } = useTranslation()
  const projectsQuery = useProjectsQuery()
  const departmentsQuery = useDepartmentsQuery()
  const categoriesQuery = useCategoriesQuery('observation')
  const subcategoriesQuery = useSubcategoriesQuery('observation')
  const usersQuery = useMobileUsersQuery()
  const supervisorsQuery = useSupervisorsQuery()
  const observationsQuery = useObservationsQuery()
  const createMutation = useCreateObservationMutation()
  const updateMutation = useUpdateObservationMutation()
  const addMediaMutation = useAddObservationMediaMutation()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<ObservationForm>({
    createdByUserId: '',
    supervisorId: '',
    projectId: '',
    departmentId: '',
    categoryId: '',
    subcategoryId: '',
    workerFullName: '',
    workerProfession: '',
    riskLevel: 1,
    description: '',
    status: 'NEW',
    deadlineDate: '',
    deadlineTime: '',
    evidenceFiles: [],
    correctiveFiles: [],
  })

  const rows = observationsQuery.data ?? []
  const isLoading = observationsQuery.isLoading
  const error = observationsQuery.error as Error | null | undefined
  const isSaving = createMutation.isPending || updateMutation.isPending

  const filteredSubcategories =
    subcategoriesQuery.data?.filter(sub => sub.categoryId === formState.categoryId) ?? []

  const handleOpenDrawer = (row?: Observation) => {
    if (row) {
      const deadline = new Date(row.deadline)
      setEditingId(row.id)
      setFormState({
        createdByUserId: row.createdByUserId,
        supervisorId: row.supervisorId,
        projectId: row.projectId,
        departmentId: row.departmentId,
        categoryId: row.categoryId,
        subcategoryId: row.subcategoryId,
        workerFullName: row.workerFullName,
        workerProfession: row.workerProfession,
        riskLevel: row.riskLevel,
        description: row.description,
        status: row.status,
        deadlineDate: !Number.isNaN(deadline.getTime())
          ? deadline.toISOString().slice(0, 10)
          : '',
        deadlineTime: !Number.isNaN(deadline.getTime())
          ? deadline.toISOString().slice(11, 16)
          : '',
        evidenceFiles: [],
        correctiveFiles: [],
      })
    } else {
      setEditingId(null)
      setFormState({
        createdByUserId: '',
        supervisorId: '',
        projectId: '',
        departmentId: '',
        categoryId: '',
        subcategoryId: '',
        workerFullName: '',
        workerProfession: '',
        riskLevel: 1,
        description: '',
        status: 'NEW',
        deadlineDate: '',
        deadlineTime: '',
        evidenceFiles: [],
        correctiveFiles: [],
      })
    }
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const deadline = new Date(`${formState.deadlineDate}T${formState.deadlineTime}`)
    if (Number.isNaN(deadline.getTime())) return

    const payload: ObservationInput = {
      createdByUserId: formState.createdByUserId,
      supervisorId: formState.supervisorId,
      projectId: formState.projectId,
      departmentId: formState.departmentId,
      categoryId: formState.categoryId,
      subcategoryId: formState.subcategoryId,
      workerFullName: formState.workerFullName,
      workerProfession: formState.workerProfession,
      riskLevel: formState.riskLevel,
      description: formState.description,
      deadline: deadline.toISOString(),
      status: formState.status,
    }

    let observationId = editingId
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: payload })
    } else {
      const created = await createMutation.mutateAsync(payload)
      observationId = created.id
    }

    if (observationId) {
      const uploads = [
        ...formState.evidenceFiles.map(file => ({
          isCorrective: false,
          file,
          uploader: formState.createdByUserId,
        })),
        ...formState.correctiveFiles.map(file => ({
          isCorrective: true,
          file,
          uploader: formState.supervisorId,
        })),
      ]
      for (const item of uploads) {
        const base64 = await fileToBase64(item.file)
        const type = item.file.type.startsWith('video') ? 'VIDEO' : 'IMAGE'
        await addMediaMutation.mutateAsync({
          observationId,
          data: {
            type,
            url: base64,
            uploadedByUserId: item.uploader,
            isCorrective: item.isCorrective,
          },
        })
      }
    }
    handleCloseDrawer()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.observations.title', { defaultValue: 'Observations' })}
        description={t('pages.observations.description', {
          defaultValue: 'Monitor safety observations and assignments.',
        })}
        actions={
          <Button type="button" variant="outline" onClick={() => handleOpenDrawer()}>
            <ClipboardList className="mr-2 h-4 w-4" />
            {t('observations.actions.add', { defaultValue: 'Add Observation' })}
          </Button>
        }
      />
      <Card>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <Th>{t('observations.table.project', { defaultValue: 'Project' })}</Th>
                  <Th>{t('observations.table.worker', { defaultValue: 'Worker' })}</Th>
                  <Th>{t('observations.table.supervisor', { defaultValue: 'Supervisor' })}</Th>
                  <Th>{t('observations.table.category', { defaultValue: 'Category' })}</Th>
                  <Th>{t('observations.table.status', { defaultValue: 'Status' })}</Th>
                  <Th>{t('observations.table.company', { defaultValue: 'Company' })}</Th>
                  <Th>{t('observations.table.deadline', { defaultValue: 'Deadline' })}</Th>
                  <Th className="w-24 text-center">
                    {t('observations.table.actions', { defaultValue: 'Actions' })}
                  </Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-sm text-muted-foreground">
                      {t('common.loading', { defaultValue: 'Loading...' })}
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-sm text-destructive">
                      {error.message}
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-sm text-muted-foreground">
                      {t('observations.table.empty', { defaultValue: 'No observations yet.' })}
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
                        <div className="flex flex-col">
                          <span>{row.workerFullName}</span>
                          <span className="text-xs text-muted-foreground">
                            {row.workerProfession}
                          </span>
                        </div>
                      </Td>
                      <Td>
                        {row.supervisor?.fullName ||
                          supervisorsQuery.data?.find(s => s.id === row.supervisorId)?.fullName ||
                          t('common.noData', { defaultValue: 'N/A' })}
                      </Td>
                      <Td>
                        <div className="flex flex-col">
                          <span>
                            {row.category?.categoryName ||
                              categoriesQuery.data?.find(c => c.id === row.categoryId)
                                ?.categoryName ||
                              t('common.noData', { defaultValue: 'N/A' })}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {row.subcategory?.subcategoryName ||
                              subcategoriesQuery.data?.find(s => s.id === row.subcategoryId)
                                ?.subcategoryName ||
                              t('common.noData', { defaultValue: 'N/A' })}
                          </span>
                        </div>
                      </Td>
                      <Td>{row.status}</Td>
                      <Td>
                        {row.company?.companyName ||
                          supervisorsQuery.data
                            ?.find(s => s.id === row.supervisorId)
                            ?.company?.companyName ||
                          t('common.noData', { defaultValue: 'N/A' })}
                      </Td>
                      <Td>{formatDateTime(row.deadline)}</Td>
                      <Td className="text-center">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          aria-label={t('common.edit', { defaultValue: 'Edit' })}
                          onClick={() => handleOpenDrawer(row)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
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
          <div className="h-screen w-full bg-background shadow-2xl md:w-[40%]">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingId
                    ? t('observations.form.editTitle', { defaultValue: 'Edit Observation' })
                    : t('observations.form.createTitle', { defaultValue: 'Add Observation' })}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('observations.form.subtitle', { defaultValue: 'Observation details' })}
                </p>
              </div>
              <Button variant="ghost" onClick={handleCloseDrawer}>
                {t('common.cancel', { defaultValue: 'Cancel' })}
              </Button>
            </div>
            <div className="h-[calc(100vh-64px)] overflow-y-auto p-4">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Field
                  label={t('observations.form.createdBy', { defaultValue: 'Created by user' })}
                  required
                >
                  <select
                    required
                    value={formState.createdByUserId}
                    onChange={e => setFormState(s => ({ ...s, createdByUserId: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <option value="">
                      {t('observations.form.createdByPlaceholder', {
                        defaultValue: 'Select user',
                      })}
                    </option>
                    {usersQuery.data?.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.fullName}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label={t('observations.form.supervisor', { defaultValue: 'Supervisor' })}
                  required
                >
                  <select
                    required
                    value={formState.supervisorId}
                    onChange={e => setFormState(s => ({ ...s, supervisorId: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <option value="">
                      {t('observations.form.supervisorPlaceholder', {
                        defaultValue: 'Select supervisor',
                      })}
                    </option>
                    {supervisorsQuery.data?.map(sup => (
                      <option key={sup.id} value={sup.id}>
                        {sup.fullName}
                      </option>
                    ))}
                  </select>
                </Field>

                <TwoCol>
                  <Field
                    label={t('observations.form.project', { defaultValue: 'Project' })}
                    required
                  >
                    <select
                      required
                      value={formState.projectId}
                      onChange={e =>
                        setFormState(s => ({
                          ...s,
                          projectId: e.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      <option value="">
                        {t('observations.form.projectPlaceholder', {
                          defaultValue: 'Select project',
                        })}
                      </option>
                      {projectsQuery.data?.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    label={t('observations.form.department', { defaultValue: 'Department' })}
                    required
                  >
                    <select
                      required
                      value={formState.departmentId}
                      onChange={e => setFormState(s => ({ ...s, departmentId: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      <option value="">
                        {t('observations.form.departmentPlaceholder', {
                          defaultValue: 'Select department',
                        })}
                      </option>
                      {departmentsQuery.data?.map(department => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </TwoCol>

                <TwoCol>
                  <Field
                    label={t('observations.form.category', { defaultValue: 'Category' })}
                    required
                  >
                    <select
                      required
                      value={formState.categoryId}
                      onChange={e =>
                        setFormState(s => ({
                          ...s,
                          categoryId: e.target.value,
                          subcategoryId: '',
                        }))
                      }
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      <option value="">
                        {t('observations.form.categoryPlaceholder', {
                          defaultValue: 'Select category',
                        })}
                      </option>
                      {categoriesQuery.data?.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    label={t('observations.form.subcategory', { defaultValue: 'Subcategory' })}
                    required
                  >
                    <select
                      required
                      value={formState.subcategoryId}
                      onChange={e => setFormState(s => ({ ...s, subcategoryId: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      disabled={!formState.categoryId}
                    >
                      <option value="">
                        {t('observations.form.subcategoryPlaceholder', {
                          defaultValue: 'Select subcategory',
                        })}
                      </option>
                      {filteredSubcategories.map(subcategory => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.subcategoryName}
                        </option>
                      ))}
                    </select>
                  </Field>
                </TwoCol>

                <TwoCol>
                  <Field
                    label={t('observations.form.workerName', { defaultValue: 'Worker name' })}
                    required
                  >
                    <input
                      required
                      type="text"
                      value={formState.workerFullName}
                      onChange={e => setFormState(s => ({ ...s, workerFullName: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </Field>
                  <Field
                    label={t('observations.form.workerProfession', {
                      defaultValue: 'Worker profession',
                    })}
                    required
                  >
                    <input
                      required
                      type="text"
                      value={formState.workerProfession}
                      onChange={e => setFormState(s => ({ ...s, workerProfession: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </Field>
                </TwoCol>

                <TwoCol>
                  <Field label={t('observations.form.risk', { defaultValue: 'Risk level (1-5)' })}>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={formState.riskLevel}
                      onChange={e =>
                        setFormState(s => ({ ...s, riskLevel: Number(e.target.value) }))
                      }
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </Field>
                  <Field label={t('observations.form.status', { defaultValue: 'Status' })}>
                    <select
                      value={formState.status}
                      onChange={e =>
                        setFormState(s => ({ ...s, status: e.target.value as ObservationStatus }))
                      }
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </Field>
                </TwoCol>

                <TwoCol>
                  <Field
                    label={t('observations.form.deadlineDate', { defaultValue: 'Deadline date' })}
                    required
                  >
                    <input
                      required
                      type="date"
                      value={formState.deadlineDate}
                      onChange={e => setFormState(s => ({ ...s, deadlineDate: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </Field>
                  <Field
                    label={t('observations.form.deadlineTime', { defaultValue: 'Deadline time' })}
                    required
                  >
                    <input
                      required
                      type="time"
                      value={formState.deadlineTime}
                      onChange={e => setFormState(s => ({ ...s, deadlineTime: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </Field>
                </TwoCol>

                <Field label={t('observations.form.evidence', { defaultValue: 'Evidence (images/videos)' })}>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={e =>
                      setFormState(s => ({
                        ...s,
                        evidenceFiles: e.target.files ? Array.from(e.target.files) : [],
                      }))
                    }
                    className="mt-1 block w-full text-sm"
                  />
                </Field>

                <Field
                  label={t('observations.form.corrective', {
                    defaultValue: 'Corrective action media (images/videos)',
                  })}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={e =>
                      setFormState(s => ({
                        ...s,
                        correctiveFiles: e.target.files ? Array.from(e.target.files) : [],
                      }))
                    }
                    className="mt-1 block w-full text-sm"
                  />
                </Field>

                <Field label={t('observations.form.description', { defaultValue: 'Description' })}>
                  <textarea
                    rows={4}
                    value={formState.description}
                    onChange={e => setFormState(s => ({ ...s, description: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </Field>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDrawer}>
                    {t('common.cancel', { defaultValue: 'Cancel' })}
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      !formState.createdByUserId ||
                      !formState.supervisorId ||
                      !formState.projectId ||
                      !formState.departmentId ||
                      !formState.categoryId ||
                      !formState.subcategoryId ||
                      !formState.workerFullName ||
                      !formState.workerProfession ||
                      !formState.deadlineDate ||
                      !formState.deadlineTime ||
                      isSaving
                    }
                  >
                    {editingId
                      ? t('common.save', { defaultValue: 'Save' })
                      : t('observations.actions.add', { defaultValue: 'Add Observation' })}
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

type ObservationForm = {
  createdByUserId: string
  supervisorId: string
  projectId: string
  departmentId: string
  categoryId: string
  subcategoryId: string
  workerFullName: string
  workerProfession: string
  riskLevel: number
  description: string
  deadlineDate: string
  deadlineTime: string
  status: ObservationStatus
  evidenceFiles: File[]
  correctiveFiles: File[]
}

const TwoCol = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{children}</div>
)

const Field = ({
  label,
  children,
  required,
}: {
  label: string
  children: React.ReactNode
  required?: boolean
}) => (
  <label className="space-y-1 text-sm font-medium text-foreground">
    <span>
      {label}
      {required ? <span className="text-destructive">*</span> : null}
    </span>
    {children}
  </label>
)

const Th = (props: React.HTMLAttributes<HTMLTableCellElement>) => (
  <th
    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
    {...props}
  />
)

const Td = (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className="px-4 py-3 text-sm text-foreground align-middle" {...props} />
)

const formatDateTime = (value?: string) => {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString()
}

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
