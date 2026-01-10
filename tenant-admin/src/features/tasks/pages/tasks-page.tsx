import type React from "react";
import { ListChecks, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { useProjectsQuery } from "@/features/projects/api/hooks";
import { useDepartmentsQuery } from "@/features/departments/api/hooks";
import { useCategoriesQuery } from "@/features/categories/api/hooks";
import { useSupervisorsQuery } from "@/features/supervisors/api/hooks";
import { useLocationsQuery } from "@/features/locations/api/hooks";
import {
  useAddTaskMediaMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useTasksQuery,
  useUpdateTaskMutation,
} from "../api/hooks";
import type { Task, TaskInput, TaskStatus } from "../types/task";

const statusOptions: TaskStatus[] = [
  "OPEN",
  "SEEN_BY_SUPERVISOR",
  "IN_PROGRESS",
  "FIXED_PENDING_CHECK",
  "REJECTED",
  "CLOSED",
];

export function TasksPage() {
  const { t } = useTranslation();
  const projectsQuery = useProjectsQuery();
  const departmentsQuery = useDepartmentsQuery();
  const locationsQuery = useLocationsQuery();
  const categoriesQuery = useCategoriesQuery("task");
  const supervisorsQuery = useSupervisorsQuery();

  const tasksQuery = useTasksQuery();
  const createMutation = useCreateTaskMutation();
  const updateMutation = useUpdateTaskMutation();
  const deleteMutation = useDeleteTaskMutation();
  const addMediaMutation = useAddTaskMediaMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [formState, setFormState] = useState<TaskForm>({
    createdByUserId: "",
    supervisorId: "",
    projectId: "",
    locationId: "",
    departmentId: "",
    categoryId: "",
    description: "",
    status: "OPEN",
    deadlineDate: "",
    files: [],
  });

  const rows = tasksQuery.data ?? [];
  const isLoading = tasksQuery.isLoading;
  const error = tasksQuery.error as Error | null | undefined;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const filteredLocations =
    locationsQuery.data?.filter(
      (loc) => loc.projectId === formState.projectId
    ) ?? [];

  const handleOpenDrawer = (row?: Task) => {
    if (row) {
      const deadline = new Date(row.deadline);
      setEditingId(row.id);
      setFormState({
        createdByUserId: row.createdByUserId,
        supervisorId: row.supervisorId,
        projectId: row.projectId,
        locationId: (row as any).locationId ?? "",
        departmentId: row.departmentId,
        categoryId: row.categoryId,
        description: row.description,
        status: row.status,
        deadlineDate: !Number.isNaN(deadline.getTime())
          ? deadline.toISOString().slice(0, 10)
          : "",
        evidenceFiles: [],
        correctiveFiles: [],
      });
    } else {
      setEditingId(null);
      setFormState({
        createdByUserId: "",
        supervisorId: "",
        projectId: "",
        locationId: "",
        departmentId: "",
        categoryId: "",
        description: "",
        status: "OPEN",
        deadlineDate: "",
        evidenceFiles: [],
        correctiveFiles: [],
      });
    }
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
  };

  const handleCloseDetails = () => {
    setDetailTask(null);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      t("common.confirmDelete", {
        defaultValue: "Are you sure you want to delete?",
      })
    );
    if (!confirmed) return;
    await deleteMutation.mutateAsync(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const deadline = new Date(formState.deadlineDate);
    if (Number.isNaN(deadline.getTime())) return;

    if (formState.createdByUserId === formState.supervisorId) {
      window.alert(
        t("tasks.form.supervisorMismatch", {
          defaultValue: "Creator and supervisor must be different",
        })
      );
      return;
    }

    const payload: TaskInput = {
      createdByUserId: formState.createdByUserId,
      supervisorId: formState.supervisorId,
      projectId: formState.projectId,
      // locationId omitted: backend does not accept this field
      departmentId: formState.departmentId,
      categoryId: formState.categoryId,
      description: formState.description,
      deadline: deadline.toISOString(),
      status: formState.status,
    };

    let taskId = editingId;
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: payload });
    } else {
      const created = await createMutation.mutateAsync(payload);
      taskId = created.id;
    }

    if (taskId && formState.files.length > 0) {
      for (const file of formState.files) {
        const base64 = await fileToBase64(file);
        const type = file.type.startsWith("video")
          ? "VIDEO"
          : file.type.startsWith("image")
          ? "IMAGE"
          : "FILE";
        await addMediaMutation.mutateAsync({
          taskId,
          data: {
            type,
            url: base64,
            uploadedByUserId: formState.createdByUserId,
            isCorrective: false,
          },
        });
      }
    }

    handleCloseDrawer();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("pages.tasks.title", { defaultValue: "Tasks" })}
        description={t("pages.tasks.description", {
          defaultValue: "Track and manage tasks.",
        })}
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenDrawer()}
          >
            <ListChecks className="mr-2 h-4 w-4" />
            {t("tasks.actions.add", { defaultValue: "Add Task" })}
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <Th>
                    {t("tasks.table.project", { defaultValue: "Project" })}
                  </Th>
                  <Th>
                    {t("tasks.table.issuedBy", {
                      defaultValue: "Issued by",
                    })}
                  </Th>
                  <Th>
                    {t("tasks.table.responsible", {
                      defaultValue: "Responsible",
                    })}
                  </Th>
                  <Th>
                    {t("tasks.table.location", { defaultValue: "Area" })}
                  </Th>
                  <Th>
                    {t("tasks.table.category", { defaultValue: "Category" })}
                  </Th>
                  <Th>{t("tasks.table.status", { defaultValue: "Status" })}</Th>
                  <Th>
                    {t("tasks.table.deadline", { defaultValue: "Deadline" })}
                  </Th>
                  <Th className="w-28 text-center">
                    {t("tasks.table.actions", { defaultValue: "Actions" })}
                  </Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      {t("common.loading", { defaultValue: "Loading..." })}
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-6 text-center text-sm text-destructive"
                    >
                      {error.message}
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      {t("tasks.table.empty", {
                        defaultValue: "No tasks yet.",
                      })}
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-muted/40 cursor-pointer"
                      onClick={() => setDetailTask(row)}
                    >
                      <Td>
                        {row.project?.name ||
                          projectsQuery.data?.find(
                            (p) => p.id === row.projectId
                          )?.name ||
                          t("common.noData", { defaultValue: "N/A" })}
                      </Td>
                      <Td>
                        {row.createdBy?.fullName ||
                          supervisorsQuery.data?.find(
                            (s) => s.id === row.createdByUserId
                          )?.fullName ||
                          t("common.noData", { defaultValue: "N/A" })}
                      </Td>
                      <Td>
                        {row.supervisor?.fullName ||
                          supervisorsQuery.data?.find(
                            (s) => s.id === row.supervisorId
                          )?.fullName ||
                          t("common.noData", { defaultValue: "N/A" })}
                      </Td>
                      <Td>
                        {row.location?.name ||
                          locationsQuery.data?.find(
                            (l) => l.id === (row.locationId as string | undefined)
                          )?.name ||
                          t("common.noData", { defaultValue: "N/A" })}
                      </Td>
                      <Td>
                        <div className="flex flex-col">
                          <span>
                            {row.category?.categoryName ||
                              categoriesQuery.data?.find(
                                (c) => c.id === row.categoryId
                              )?.categoryName ||
                              t("common.noData", { defaultValue: "N/A" })}
                          </span>
                        </div>
                      </Td>
                      <Td>{row.status}</Td>
                      <Td>{formatDate(row.deadline)}</Td>
                      <Td>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDrawer(row);
                            }}
                            className="rounded-md border border-border bg-background p-2 text-muted-foreground hover:text-foreground"
                            aria-label={t("common.edit", {
                              defaultValue: "Edit",
                            })}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(row.id);
                            }}
                            className="rounded-md border border-border bg-background p-2 text-muted-foreground hover:text-destructive"
                            aria-label={t("common.delete", {
                              defaultValue: "Delete",
                            })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-3xl rounded-lg bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold uppercase">
                {editingId
                  ? t("tasks.drawer.editTitle", { defaultValue: "Edit Task" })
                  : t("tasks.drawer.createTitle", { defaultValue: "New Task" })}
              </h2>
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={handleCloseDrawer}
              >
                {t("common.close", { defaultValue: "Close" })}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <TwoCol>
                <Field
                  label={t("tasks.form.creator", { defaultValue: "Issued by" })}
                  required
                >
                  <select
                    required
                    value={formState.createdByUserId}
                    onChange={(e) =>
                      setFormState((s) => ({
                        ...s,
                        createdByUserId: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <option value="">
                      {t("tasks.form.creatorPlaceholder", {
                        defaultValue: "Select Issued by",
                      })}
                    </option>
                    {supervisorsQuery.data?.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label={t("tasks.form.supervisor", {
                    defaultValue: "Responsible",
                  })}
                  required
                >
                  <select
                    required
                    value={formState.supervisorId}
                    onChange={(e) =>
                      setFormState((s) => ({
                        ...s,
                        supervisorId: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <option value="">
                      {t("tasks.form.supervisorPlaceholder", {
                        defaultValue: "Select supervisor",
                      })}
                    </option>
                    {supervisorsQuery.data
                      ?.filter((s) => s.id !== formState.createdByUserId)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.fullName}
                        </option>
                      ))}
                  </select>
                </Field>
              </TwoCol>

              <TwoCol>
                <Field
                  label={t("tasks.form.project", { defaultValue: "Project" })}
                  required
                >
                  <select
                    required
                    value={formState.projectId}
                    onChange={(e) =>
                      setFormState((s) => ({
                        ...s,
                        projectId: e.target.value,
                        departmentId: "",
                        categoryId: "",
                        locationId: "",
                      }))
                    }
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <option value="">
                      {t("tasks.form.projectPlaceholder", {
                        defaultValue: "Select project",
                      })}
                    </option>
                    {projectsQuery.data?.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label={t("tasks.form.department", {
                    defaultValue: "Department",
                  })}
                  required
                >
                  <select
                    required
                    value={formState.departmentId}
                    onChange={(e) =>
                      setFormState((s) => ({
                        ...s,
                        departmentId: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <option value="">
                      {t("tasks.form.departmentPlaceholder", {
                        defaultValue: "Select department",
                      })}
                    </option>
                    {departmentsQuery.data?.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </TwoCol>

              <TwoCol>
                <Field
                  label={t("tasks.form.location", { defaultValue: "Area" })}
                >
                  <select
                    value={formState.locationId}
                    onChange={(e) =>
                      setFormState((s) => ({
                        ...s,
                        locationId: e.target.value,
                      }))
                    }
                    disabled={!formState.projectId}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <option value="">
                      {t("tasks.form.locationPlaceholder", {
                        defaultValue: formState.projectId
                          ? "Select area"
                          : "Select project first",
                      })}
                    </option>
                    {filteredLocations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label={t("tasks.form.category", { defaultValue: "Category" })}
                  required
                >
                  <select
                    required
                    value={formState.categoryId}
                    onChange={(e) =>
                      setFormState((s) => ({
                        ...s,
                        categoryId: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <option value="">
                      {t("tasks.form.categoryPlaceholder", {
                        defaultValue: "Select category",
                      })}
                    </option>
                    {categoriesQuery.data?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </Field>
              </TwoCol>

              <TwoCol>
                <Field
                  label={t("tasks.form.status", { defaultValue: "Status" })}
                  required
                >
                  <select
                    value={formState.status}
                    onChange={(e) =>
                      setFormState((s) => ({
                        ...s,
                        status: e.target.value as TaskStatus,
                      }))
                    }
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label={t("tasks.form.deadlineDate", {
                    defaultValue: "Deadline date",
                  })}
                  required
                >
                  <input
                    required
                    type="date"
                    value={formState.deadlineDate}
                    onChange={(e) =>
                      setFormState((s) => ({
                        ...s,
                        deadlineDate: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </Field>
              </TwoCol>
              <Field
                label={t("tasks.form.files", {
                  defaultValue: "Attachments (Images/Videos/Documents)",
                })}
              >
                <div className="mt-1">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-primary transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="mb-1 text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Images, videos, and documents supported
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      onChange={(e) =>
                        setFormState((s) => ({
                          ...s,
                          files: e.target.files
                            ? Array.from(e.target.files)
                            : [],
                        }))
                      }
                      className="hidden"
                    />
                  </label>
                  {formState.files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formState.files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-muted/50 rounded-lg border border-border"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {file.type.startsWith("image") ? (
                              <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            ) : file.type.startsWith("video") ? (
                              <svg className="w-5 h-5 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            )}
                            <span className="text-sm truncate">{file.name}</span>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setFormState((s) => ({
                                ...s,
                                files: s.files.filter((_, i) => i !== idx),
                              }))
                            }
                            className="ml-2 text-destructive hover:text-destructive/80 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Field>

              <Field
                label={t("tasks.form.description", {
                  defaultValue: "Description",
                })}
              >
                <textarea
                  rows={4}
                  value={formState.description}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, description: e.target.value }))
                  }
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </Field>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDrawer}
                >
                  {t("common.cancel", { defaultValue: "Cancel" })}
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !formState.createdByUserId ||
                    !formState.supervisorId ||
                    !formState.projectId ||
                    !formState.departmentId ||
                    !formState.categoryId ||
                    !formState.deadlineDate ||
                    isSaving
                  }
                >
                  {editingId
                    ? t("common.save", { defaultValue: "Save" })
                    : t("tasks.actions.add", { defaultValue: "Add Task" })}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {detailTask ? (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="flex-1 bg-black/40" onClick={handleCloseDetails} />
          <div className="h-full w-full max-w-md overflow-y-auto bg-background p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold uppercase">
                  {t("tasks.drawer.viewTitle", { defaultValue: "Task details" })}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("tasks.drawer.viewSubtitle", {
                    defaultValue: "Full task information",
                  })}
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={handleCloseDetails}
              >
                {t("common.close", { defaultValue: "Close" })}
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <DetailRow
                label={t("tasks.table.project", { defaultValue: "Project" })}
                value={
                  detailTask.project?.name ||
                  projectsQuery.data?.find((p) => p.id === detailTask.projectId)
                    ?.name ||
                  t("common.noData", { defaultValue: "N/A" })
                }
              />
              <DetailRow
                label={t("tasks.form.department", { defaultValue: "Department" })}
                value={
                  detailTask.department?.name ||
                  departmentsQuery.data?.find((d) => d.id === detailTask.departmentId)
                    ?.name ||
                  t("common.noData", { defaultValue: "N/A" })
                }
              />
              <DetailRow
                label={t("tasks.table.location", { defaultValue: "Area" })}
                value={
                  detailTask.location?.name ||
                  locationsQuery.data?.find(
                    (l) => l.id === (detailTask.locationId as string | undefined)
                  )?.name ||
                  t("common.noData", { defaultValue: "N/A" })
                }
              />
              <DetailRow
                label={t("tasks.form.category", { defaultValue: "Category" })}
                value={
                  detailTask.category?.categoryName ||
                  categoriesQuery.data?.find((c) => c.id === detailTask.categoryId)
                    ?.categoryName ||
                  t("common.noData", { defaultValue: "N/A" })
                }
              />
              <DetailRow
                label={t("tasks.table.issuedBy", { defaultValue: "Issued by" })}
                value={
                  detailTask.createdBy?.fullName ||
                  supervisorsQuery.data?.find(
                    (s) => s.id === detailTask.createdByUserId
                  )?.fullName ||
                  t("common.noData", { defaultValue: "N/A" })
                }
              />
              <DetailRow
                label={t("tasks.table.responsible", { defaultValue: "Responsible" })}
                value={
                  detailTask.supervisor?.fullName ||
                  supervisorsQuery.data?.find(
                    (s) => s.id === detailTask.supervisorId
                  )?.fullName ||
                  t("common.noData", { defaultValue: "N/A" })
                }
              />
              <DetailRow
                label={t("tasks.table.status", { defaultValue: "Status" })}
                value={detailTask.status}
              />
              <DetailRow
                label={t("tasks.table.deadline", { defaultValue: "Deadline" })}
                value={formatDate(detailTask.deadline)}
              />
              <DetailRow
                label={t("tasks.drawer.createdAt", { defaultValue: "Created at" })}
                value={formatDate(detailTask.createdAt)}
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("tasks.form.description", { defaultValue: "Description" })}
                </p>
                <p className="mt-1 whitespace-pre-line text-sm text-foreground">
                  {detailTask.description ||
                    t("common.noData", { defaultValue: "N/A" })}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type TaskForm = {
  createdByUserId: string;
  supervisorId: string;
  projectId: string;
  locationId: string;
  departmentId: string;
  categoryId: string;
  description: string;
  deadlineDate: string;
  status: TaskStatus;
  files: File[];
};

const TwoCol = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{children}</div>
);

const Field = ({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="space-y-1 text-sm font-medium text-foreground">
    <span>
      {label}
      {required ? <span className="text-destructive">*</span> : null}
    </span>
    {children}
  </label>
);

const Th = (props: React.HTMLAttributes<HTMLTableCellElement>) => (
  <th
    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
    {...props}
  />
);

const Td = (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className="px-4 py-3 text-sm text-foreground align-middle" {...props} />
);

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString();
};

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <div className="flex items-start justify-between gap-4 rounded-md border border-border p-3">
    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {label}
    </div>
    <div className="text-sm text-foreground text-right">{value || "N/A"}</div>
  </div>
);

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
