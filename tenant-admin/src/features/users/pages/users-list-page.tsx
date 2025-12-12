import type React from 'react'
import { Plus, Pencil } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { PageHeader } from '@/shared/ui/page-header'
import { useProjectsQuery } from '@/features/projects/api/hooks'
import { useDepartmentsQuery } from '@/features/departments/api/hooks'
import { useCompaniesQuery } from '@/features/companies/api/hooks'
import {
  useCreateMobileUserMutation,
  useMobileUsersQuery,
  useUpdateMobileUserMutation,
} from '../api/hooks'
import {
  useCreateSupervisorMutation,
  useSupervisorsQuery,
  useUpdateSupervisorMutation,
} from '@/features/supervisors/api/hooks'
import type { Supervisor, SupervisorInput } from '@/features/supervisors/types/supervisor'
import type { MobileUser, MobileUserInput } from '../types/mobile-user'

export function UsersListPage() {
  const { t } = useTranslation()
  const projectsQuery = useProjectsQuery()
  const departmentsQuery = useDepartmentsQuery()
  const companiesQuery = useCompaniesQuery()
  const usersQuery = useMobileUsersQuery()
  const supervisorsQuery = useSupervisorsQuery()
  const createUserMutation = useCreateMobileUserMutation()
  const updateUserMutation = useUpdateMobileUserMutation()
  const createSupervisorMutation = useCreateSupervisorMutation()
  const updateSupervisorMutation = useUpdateSupervisorMutation()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [activeRole, setActiveRole] = useState<'USER' | 'SUPERVISOR'>('USER')
  const [formState, setFormState] = useState<UserForm>({
    fullName: '',
    phoneNumber: '',
    email: '',
    profession: '',
    login: '',
    password: '',
    projectIds: [],
    isActive: true,
    departmentId: '',
    companyId: '',
  })

  const isUsersTab = activeRole === 'USER'
  const rows = isUsersTab ? usersQuery.data ?? [] : supervisorsQuery.data ?? []
  const isLoading = isUsersTab ? usersQuery.isLoading : supervisorsQuery.isLoading
  const error = (isUsersTab ? usersQuery.error : supervisorsQuery.error) as
    | Error
    | null
    | undefined
  const isSaving =
    createUserMutation.isPending ||
    updateUserMutation.isPending ||
    createSupervisorMutation.isPending ||
    updateSupervisorMutation.isPending

const handleOpenDrawer = (row?: MobileUser | Supervisor) => {
    if (row) {
      setEditingId(row.id)
      setFormState({
        fullName: row.fullName,
        phoneNumber: row.phoneNumber,
        email: row.email ?? '',
        profession: row.profession ?? '',
        login: row.login,
        password: '',
        projectIds: row.projects?.map(p => p.id) ?? row.projectIds ?? [],
        isActive: row.isActive,
        departmentId: 'departmentId' in row ? row.departmentId ?? '' : '',
        companyId: 'companyId' in row ? row.companyId ?? '' : '',
      })
      setActiveRole('SUPERVISOR')
    } else {
      setEditingId(null)
      setFormState({
        fullName: '',
        phoneNumber: '',
        email: '',
        profession: '',
        login: '',
        password: '',
        projectIds: [],
        isActive: true,
        departmentId: '',
        companyId: '',
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
    const payload: MobileUserInput = {
      fullName: formState.fullName,
      phoneNumber: formState.phoneNumber,
      email: formState.email || undefined,
      profession: formState.profession || undefined,
      login: formState.login,
      password: formState.password || undefined,
      projectIds: formState.projectIds,
      isActive: formState.isActive,
    }

    if (activeRole === 'USER') {
      if (editingId) {
        await updateUserMutation.mutateAsync({ id: editingId, data: payload })
      } else {
        await createUserMutation.mutateAsync(payload)
      }
    } else {
      const supervisorPayload: SupervisorInput = {
        ...payload,
        departmentId: formState.departmentId || undefined,
        companyId: formState.companyId || undefined,
      }
      if (editingId) {
        await updateSupervisorMutation.mutateAsync({ id: editingId, data: supervisorPayload })
      } else {
        await createSupervisorMutation.mutateAsync(supervisorPayload)
      }
    }
    handleCloseDrawer()
  }

  const toggleProject = (id: string) => {
    setFormState(s => ({
      ...s,
      projectIds: s.projectIds.includes(id)
        ? s.projectIds.filter(pid => pid !== id)
        : [...s.projectIds, id],
    }))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.users.title')}
        description={t('pages.users.description')}
        actions={
          <Button type="button" variant="outline" onClick={() => handleOpenDrawer()}>
            <Plus className="mr-2 h-4 w-4" />
            {t('nav.users')}
          </Button>
        }
      />
      <div className="flex gap-2">
        <Button
          variant={activeRole === 'USER' ? 'default' : 'outline'}
          onClick={() => setActiveRole('USER')}
        >
          {t('nav.users')}
        </Button>
        <Button
          variant={activeRole === 'SUPERVISOR' ? 'default' : 'outline'}
          onClick={() => setActiveRole('SUPERVISOR')}
        >
          {t('nav.supervisors')}
        </Button>
      </div>
      <Card>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <Th>{t('users.table.name', { defaultValue: 'Name' })}</Th>
                  <Th>{t('users.table.login', { defaultValue: 'Login' })}</Th>
                  <Th>{t('users.table.projects', { defaultValue: 'Projects' })}</Th>
                  {activeRole === 'SUPERVISOR' ? (
                    <>
                      <Th>{t('supervisors.table.department', { defaultValue: 'Department' })}</Th>
                      <Th>{t('supervisors.table.company', { defaultValue: 'Company' })}</Th>
                    </>
                  ) : null}
                  <Th>{t('users.table.status', { defaultValue: 'Status' })}</Th>
                  <Th className="w-24 text-center">
                    {t('users.table.actions', { defaultValue: 'Actions' })}
                  </Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-muted-foreground">
                      {t('common.loading', { defaultValue: 'Loading...' })}
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-destructive">
                      {error.message}
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-muted-foreground">
                      {activeRole === 'USER'
                        ? t('users.table.empty', { defaultValue: 'No users yet.' })
                        : t('supervisors.table.empty', { defaultValue: 'No supervisors yet.' })}
                    </td>
                  </tr>
                ) : (
                  rows.map(row => (
                    <tr key={row.id} className="hover:bg-muted/40">
                      <Td>{row.fullName}</Td>
                      <Td>{row.login}</Td>
                      <Td>
                        <div className="flex flex-wrap gap-1">
                          {(row.projects && row.projects.length > 0
                            ? row.projects
                            : projectsQuery.data?.filter(p => row.projectIds?.includes(p.id)))?.map(
                              project => (
                                <span
                                  key={project.id}
                                  className="rounded-full bg-muted px-2 py-0.5 text-xs text-foreground"
                                >
                                  {project.name}
                                </span>
                              ),
                            ) || t('common.noData', { defaultValue: 'N/A' })}
                        </div>
                      </Td>
                      {activeRole === 'SUPERVISOR' ? (
                        <>
                          <Td>
                            {'department' in row
                              ? row.department?.name ||
                                departmentsQuery.data?.find(d => d.id === row.departmentId)?.name ||
                                t('common.noData', { defaultValue: 'N/A' })
                              : t('common.noData', { defaultValue: 'N/A' })}
                          </Td>
                          <Td>
                            {'company' in row
                              ? row.company?.companyName ||
                                companiesQuery.data?.find(c => c.id === row.companyId)?.companyName ||
                                t('common.noData', { defaultValue: 'N/A' })
                              : t('common.noData', { defaultValue: 'N/A' })}
                          </Td>
                        </>
                      ) : null}
                      <Td>
                        {row.isActive
                          ? t('common.active', { defaultValue: 'Active' })
                          : t('common.inactive', { defaultValue: 'Inactive' })}
                      </Td>
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
          <div className="h-screen w-full bg-background shadow-2xl md:w-[36%]">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingId
                    ? t('users.form.editTitle', { defaultValue: 'Edit User' })
                    : t('users.form.createTitle', { defaultValue: 'Add User' })}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('users.form.subtitle', { defaultValue: 'User details' })}
                </p>
              </div>
              <Button variant="ghost" onClick={handleCloseDrawer}>
                {t('common.cancel', { defaultValue: 'Cancel' })}
              </Button>
            </div>
            <div className="h-[calc(100vh-64px)] overflow-y-auto p-4">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <TwoCol>
                  <Field
                    label={
                      activeRole === 'USER'
                        ? t('users.form.name', { defaultValue: 'Full name' })
                        : t('supervisors.form.name', { defaultValue: 'Full name' })
                    }
                    required
                  >
                    <input
                      required
                      type="text"
                      value={formState.fullName}
                      onChange={e => setFormState(s => ({ ...s, fullName: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </Field>
                  <Field
                    label={t('users.form.login', { defaultValue: 'Login' })}
                    required
                  >
                    <input
                      required
                      type="text"
                      value={formState.login}
                      onChange={e => setFormState(s => ({ ...s, login: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </Field>
                </TwoCol>

                <TwoCol>
                  <Field
                    label={t('users.form.phone', { defaultValue: 'Phone number' })}
                    required
                  >
                    <input
                      required
                      type="tel"
                      value={formState.phoneNumber}
                      onChange={e => setFormState(s => ({ ...s, phoneNumber: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </Field>
                  <Field label={t('users.form.email', { defaultValue: 'Email' })}>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </Field>
                </TwoCol>

                  <Field
                    label={
                      activeRole === 'USER'
                        ? t('users.form.profession', { defaultValue: 'Profession' })
                        : t('supervisors.form.profession', { defaultValue: 'Profession' })
                    }
                  >
                  <input
                    type="text"
                    value={formState.profession}
                    onChange={e => setFormState(s => ({ ...s, profession: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </Field>

                <Field label={t('users.form.password', { defaultValue: 'Password' })}>
                  <input
                    type="password"
                    value={formState.password}
                    placeholder={
                      editingId
                        ? t('users.form.passwordPlaceholderEdit', {
                            defaultValue: 'Leave blank to keep current',
                          })
                        : t('users.form.passwordPlaceholder', {
                            defaultValue: 'Set initial password',
                          })
                    }
                    onChange={e => setFormState(s => ({ ...s, password: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </Field>

                <Field label={t('users.form.projects', { defaultValue: 'Projects' })} required>
                    <div className="flex flex-wrap gap-2">
                      {projectsQuery.data?.map(project => {
                        const selected = formState.projectIds.includes(project.id)
                        return (
                          <button
                            type="button"
                            key={project.id}
                          onClick={() => toggleProject(project.id)}
                          className={
                            'rounded-full border px-3 py-1 text-sm transition ' +
                            (selected
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border text-foreground')
                          }
                        >
                          {project.name}
                        </button>
                      )
                    })}
                    {!projectsQuery.data?.length
                      ? t('common.noData', { defaultValue: 'N/A' })
                      : null}
                  </div>
                </Field>

                {activeRole === 'SUPERVISOR' ? (
                  <>
                    <Field
                      label={t('supervisors.form.department', { defaultValue: 'Department' })}
                    >
                      <select
                        value={formState.departmentId}
                        onChange={e => setFormState(s => ({ ...s, departmentId: e.target.value }))}
                        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        <option value="">
                          {t('supervisors.form.departmentPlaceholder', {
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

                    <Field label={t('supervisors.form.company', { defaultValue: 'Company' })}>
                      <select
                        value={formState.companyId}
                        onChange={e => setFormState(s => ({ ...s, companyId: e.target.value }))}
                        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        <option value="">
                          {t('supervisors.form.companyPlaceholder', {
                            defaultValue: 'Select company',
                          })}
                        </option>
                        {companiesQuery.data?.map(company => (
                          <option key={company.id} value={company.id}>
                            {company.companyName}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </>
                ) : null}

                <Field label={t('users.form.status', { defaultValue: 'Status' })}>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formState.isActive}
                      onChange={e => setFormState(s => ({ ...s, isActive: e.target.checked }))}
                      className="h-4 w-4 rounded border-border"
                    />
                    <span className="text-sm">
                      {formState.isActive
                        ? t('common.active', { defaultValue: 'Active' })
                        : t('common.inactive', { defaultValue: 'Inactive' })}
                    </span>
                  </div>
                </Field>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDrawer}>
                    {t('common.cancel', { defaultValue: 'Cancel' })}
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      !formState.fullName ||
                      !formState.login ||
                      !formState.phoneNumber ||
                      formState.projectIds.length === 0 ||
                      (!editingId && !formState.password) ||
                      isSaving
                    }
                  >
                    {editingId
                      ? t('common.save', { defaultValue: 'Save' })
                      : t('users.actions.add', { defaultValue: 'Add User' })}
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

type UserForm = {
  fullName: string
  phoneNumber: string
  email: string
  profession: string
  login: string
  password: string
  projectIds: string[]
  isActive: boolean
  departmentId: string
  companyId: string
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
