import type React from "react";
import { ClipboardList, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { useProjectsQuery } from "@/features/projects/api/hooks";
import { useDepartmentsQuery } from "@/features/departments/api/hooks";
import { useCategoriesQuery } from "@/features/categories/api/hooks";
import { useSubcategoriesQuery } from "@/features/subcategories/api/hooks";
import { useSupervisorsQuery } from "@/features/supervisors/api/hooks";
import { useLocationsQuery } from "@/features/locations/api/hooks";
import { useTypesQuery } from "@/features/types/api/hooks";
import {
  useAddObservationMediaMutation,
  useCreateObservationMutation,
  useDeleteObservationMutation,
  useObservationsQuery,
  useUpdateObservationMutation,
} from "../api/hooks";
import type {
  Observation,
  ObservationInput,
  ObservationStatus,
} from "../types/observation";

const statusOptions: ObservationStatus[] = [
  "NEW",
  "SEEN_BY_SUPERVISOR",
  "IN_PROGRESS",
  "FIXED_PENDING_CHECK",
  "REJECTED",
  "CLOSED",
];

export function ObservationsPage() {
  const { t } = useTranslation();
  const projectsQuery = useProjectsQuery();
  const departmentsQuery = useDepartmentsQuery();
  const locationsQuery = useLocationsQuery();
  const categoriesQuery = useCategoriesQuery("observation");
  const subcategoriesQuery = useSubcategoriesQuery("observation");
  const supervisorsQuery = useSupervisorsQuery();
  const typesQuery = useTypesQuery();
  const observationsQuery = useObservationsQuery();
  const createMutation = useCreateObservationMutation();
  const updateMutation = useUpdateObservationMutation();
  const deleteMutation = useDeleteObservationMutation();
  const addMediaMutation = useAddObservationMediaMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailObservation, setDetailObservation] = useState<Observation | null>(null);
  const [formState, setFormState] = useState<ObservationForm>({
    createdByUserId: "",
    supervisorId: "",
    projectId: "",
    locationId: "",
    departmentId: "",
    categoryId: "",
    subcategoryId: "",
    branchId: "",
    workerFullName: "",
    workerProfession: "",
    riskLevel: 1,
    description: "",
    status: "NEW",
    deadlineDate: "",
    evidenceFiles: [],
    correctiveFiles: [],
  });

  const rows = observationsQuery.data ?? [];
  const isLoading = observationsQuery.isLoading;
  const error = observationsQuery.error as Error | null | undefined;
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const filteredSubcategories =
    subcategoriesQuery.data?.filter(
      (sub) => sub.categoryId === formState.categoryId
    ) ?? [];
  const filteredLocations =
    locationsQuery.data?.filter(
      (loc) => loc.projectId === formState.projectId
    ) ?? [];
  const filteredBranches =
    typesQuery.data?.filter((type) => type.projectId === formState.projectId) ??
    [];

  const handleOpenDrawer = (row?: Observation) => {
    if (row) {
      const deadline = new Date(row.deadline);
      setEditingId(row.id);
      setFormState({
        createdByUserId: row.createdByUserId,
        supervisorId: row.supervisorId,
        projectId: row.projectId,
        locationId: row.locationId,
        departmentId: row.departmentId,
        categoryId: row.categoryId,
        subcategoryId: row.subcategoryId,
        branchId: row.branchId ?? "",
        workerFullName: row.workerFullName,
        workerProfession: row.workerProfession,
        riskLevel: row.riskLevel,
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
        subcategoryId: "",
        branchId: "",
        workerFullName: "",
        workerProfession: "",
        riskLevel: 1,
        description: "",
        status: "NEW",
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
    setDetailObservation(null);
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
        t("observations.form.supervisorMismatch", {
          defaultValue: "Creator and supervisor must be different",
        })
      );
      return;
    }

    const payload: ObservationInput = {
      createdByUserId: formState.createdByUserId,
      supervisorId: formState.supervisorId,
      projectId: formState.projectId,
      locationId: formState.locationId || undefined,
      departmentId: formState.departmentId,
      categoryId: formState.categoryId,
      subcategoryId: formState.subcategoryId,
      branchId: formState.branchId || undefined,
      workerFullName: formState.workerFullName,
      workerProfession: formState.workerProfession,
      riskLevel: formState.riskLevel,
      description: formState.description,
      deadline: deadline.toISOString(),
      status: formState.status,
    };

    let observationId = editingId;
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: payload });
    } else {
      const created = await createMutation.mutateAsync(payload);
      observationId = created.id;
    }

    if (observationId) {
      const uploads = [
        ...formState.evidenceFiles.map((file) => ({
          isCorrective: false,
          file,
          uploader: formState.createdByUserId,
        })),
        ...formState.correctiveFiles.map((file) => ({
          isCorrective: true,
          file,
          uploader: formState.supervisorId,
        })),
      ];
      for (const item of uploads) {
        const base64 = await fileToBase64(item.file);
        const type = item.file.type.startsWith("video") ? "VIDEO" : "IMAGE";
        await addMediaMutation.mutateAsync({
          observationId,
          data: {
            type,
            url: base64,
            uploadedByUserId: item.uploader,
            isCorrective: item.isCorrective,
          },
        });
      }
    }
    handleCloseDrawer();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("pages.observations.title", { defaultValue: "Observations" })}
        description={t("pages.observations.description", {
          defaultValue: "Monitor safety observations and assignments.",
        })}
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenDrawer()}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            {t("observations.actions.add", { defaultValue: "Add Observation" })}
          </Button>
        }
      />
      <Card>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <Th className="w-12 text-center">
                      {t("common.id", { defaultValue: "ID" })}
                    </Th>
                    <Th>
                      {t("observations.table.project", {
                        defaultValue: "Project",
                      })}
                    </Th>
                  <Th>
                    {t("observations.table.location", { defaultValue: "Area" })}
                  </Th>
                  <Th>
                    {t("observations.table.worker", { defaultValue: "Worker" })}
                  </Th>
                  <Th>
                    {t("observations.table.supervisor", {
                      defaultValue: "Supervisor",
                    })}
                  </Th>
                  <Th>
                    {t("observations.table.category", {
                      defaultValue: "Category",
                    })}
                  </Th>
                  <Th>
                    {t("observations.table.status", { defaultValue: "Status" })}
                  </Th>
                  <Th>
                    {t("observations.table.company", {
                      defaultValue: "Company",
                    })}
                  </Th>
                  <Th>
                    {t("observations.table.deadline", {
                      defaultValue: "Deadline",
                    })}
                  </Th>
                  <Th className="w-28 text-center">
                    {t("observations.table.actions", {
                      defaultValue: "Actions",
                    })}
                  </Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      {t("common.loading", { defaultValue: "Loading..." })}
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-6 text-center text-sm text-destructive"
                    >
                      {error.message}
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      {t("observations.table.empty", {
                        defaultValue: "No observations yet.",
                      })}
                    </td>
                  </tr>
                ) : (
                  rows.map((row, index) => (
                    <tr
                      key={row.id}
                      className="hover:bg-muted/40 cursor-pointer"
                      onClick={() => setDetailObservation(row)}
                    >
                      <Td className="text-center font-semibold">{index + 1}</Td>
                      <Td>
                        {row.project?.name ||
                          projectsQuery.data?.find(
                            (p) => p.id === row.projectId
                          )?.name ||
                          t("common.noData", { defaultValue: "N/A" })}
                      </Td>
                      <Td>
                        {row.location?.name ||
                          locationsQuery.data?.find(
                            (loc) => loc.id === row.locationId
                          )?.name ||
                          t("common.noData", { defaultValue: "N/A" })}
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
                          supervisorsQuery.data?.find(
                            (s) => s.id === row.supervisorId
                          )?.fullName ||
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
                          <span className="text-xs text-muted-foreground">
                            {row.subcategory?.subcategoryName ||
                              subcategoriesQuery.data?.find(
                                (s) => s.id === row.subcategoryId
                              )?.subcategoryName ||
                              t("common.noData", { defaultValue: "N/A" })}
                          </span>
                        </div>
                      </Td>
                      <Td>{row.status}</Td>
                      <Td>
                        {row.company?.companyName ||
                          supervisorsQuery.data?.find(
                            (s) => s.id === row.supervisorId
                          )?.company?.companyName ||
                          t("common.noData", { defaultValue: "N/A" })}
                      </Td>
                      <Td>{formatDateTime(row.deadline)}</Td>
                      <Td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            aria-label={t("common.edit", {
                              defaultValue: "Edit",
                            })}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDrawer(row);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            aria-label={t("common.delete", {
                              defaultValue: "Delete",
                            })}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(row.id);
                            }}
                            disabled={isDeleting}
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
          <div className="h-screen w-full bg-background shadow-2xl md:w-[40%]">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-lg font-semibold uppercase">
                  {editingId
                    ? t("observations.form.editTitle", {
                        defaultValue: "Edit Observation",
                      })
                    : t("observations.form.createTitle", {
                        defaultValue: "Add Observation",
                      })}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("observations.form.subtitle", {
                    defaultValue: "Observation details",
                  })}
                </p>
              </div>
              <Button variant="ghost" onClick={handleCloseDrawer}>
                {t("common.cancel", { defaultValue: "Cancel" })}
              </Button>
            </div>
            <div className="h-[calc(100vh-64px)] overflow-y-auto p-4">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Field
                  label={t("observations.form.createdBy", {
                    defaultValue: "Created by supervisor",
                  })}
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
                      {t("observations.form.createdByPlaceholder", {
                        defaultValue: "Select supervisor",
                      })}
                    </option>
                    {supervisorsQuery.data?.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.fullName}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label={t("observations.form.supervisor", {
                    defaultValue: "Supervisor",
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
                      {t("observations.form.supervisorPlaceholder", {
                        defaultValue: "Select supervisor",
                      })}
                    </option>
                    {supervisorsQuery.data?.map((sup) => (
                      <option key={sup.id} value={sup.id}>
                        {sup.fullName}
                      </option>
                    ))}
                  </select>
                </Field>

                <TwoCol>
                  <Field
                    label={t("observations.form.project", {
                      defaultValue: "Project",
                    })}
                    required
                  >
                    <select
                      required
                      value={formState.projectId}
                      onChange={(e) =>
                        setFormState((s) => ({
                          ...s,
                          projectId: e.target.value,
                          locationId: "",
                          branchId: "",
                        }))
                      }
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      <option value="">
                        {t("observations.form.projectPlaceholder", {
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
                    label={t("observations.form.department", {
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
                        {t("observations.form.departmentPlaceholder", {
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
                    label={t("observations.form.branch", {
                      defaultValue: "Branch",
                    })}
                    required
                  >
                    <select
                      required
                      value={formState.branchId}
                      onChange={(e) =>
                        setFormState((s) => ({
                          ...s,
                          branchId: e.target.value,
                        }))
                      }
                      disabled={!formState.projectId}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      <option value="">
                        {t("observations.form.branchPlaceholder", {
                          defaultValue: formState.projectId
                            ? "Select branch"
                            : "Select project first",
                        })}
                      </option>
                      {filteredBranches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.typeName}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    label={t("observations.form.location", {
                      defaultValue: "Location",
                    })}
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
                        {t("observations.form.locationPlaceholder", {
                          defaultValue: formState.projectId
                            ? "Select location"
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
                </TwoCol>

                <TwoCol>
                  <Field
                    label={t("observations.form.category", {
                      defaultValue: "Category",
                    })}
                    required
                  >
                    <select
                      required
                      value={formState.categoryId}
                      onChange={(e) =>
                        setFormState((s) => ({
                          ...s,
                          categoryId: e.target.value,
                          subcategoryId: "",
                        }))
                      }
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      <option value="">
                        {t("observations.form.categoryPlaceholder", {
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
                  <Field
                    label={t("observations.form.subcategory", {
                      defaultValue: "Subcategory",
                    })}
                    required
                  >
                    <select
                      required
                      value={formState.subcategoryId}
                      onChange={(e) =>
                        setFormState((s) => ({
                          ...s,
                          subcategoryId: e.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      disabled={!formState.categoryId}
                    >
                      <option value="">
                        {t("observations.form.subcategoryPlaceholder", {
                          defaultValue: "Select subcategory",
                        })}
                      </option>
                      {filteredSubcategories.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.subcategoryName}
                        </option>
                      ))}
                    </select>
                  </Field>
                </TwoCol>

                <TwoCol>
                  <Field
                    label={t("observations.form.workerName", {
                      defaultValue: "Worker name",
                    })}
                    required
                  >
                    <input
                      required
                      type="text"
                      value={formState.workerFullName}
                      onChange={(e) =>
                        setFormState((s) => ({
                          ...s,
                          workerFullName: e.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </Field>
                  <Field
                    label={t("observations.form.workerProfession", {
                      defaultValue: "Worker profession",
                    })}
                    required
                  >
                    <input
                      required
                      type="text"
                      value={formState.workerProfession}
                      onChange={(e) =>
                        setFormState((s) => ({
                          ...s,
                          workerProfession: e.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </Field>
                </TwoCol>

                <TwoCol>
                  <Field
                    label={t("observations.form.risk", {
                      defaultValue: "Risk level (1-5)",
                    })}
                  >
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={formState.riskLevel}
                      onChange={(e) =>
                        setFormState((s) => ({
                          ...s,
                          riskLevel: Number(e.target.value),
                        }))
                      }
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </Field>
                  <Field
                    label={t("observations.form.status", {
                      defaultValue: "Status",
                    })}
                  >
                    <select
                      value={formState.status}
                      onChange={(e) =>
                        setFormState((s) => ({
                          ...s,
                          status: e.target.value as ObservationStatus,
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
                </TwoCol>

                <Field
                  label={t("observations.form.deadlineDate", {
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

                <Field
                  label={t("observations.form.evidence", {
                    defaultValue: "Evidence (images/videos)",
                  })}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) =>
                      setFormState((s) => ({
                        ...s,
                        evidenceFiles: e.target.files
                          ? Array.from(e.target.files)
                          : [],
                      }))
                    }
                    className="mt-1 block w-full text-sm"
                  />
                </Field>

                <Field
                  label={t("observations.form.corrective", {
                    defaultValue: "Corrective action media (images/videos)",
                  })}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) =>
                      setFormState((s) => ({
                        ...s,
                        correctiveFiles: e.target.files
                          ? Array.from(e.target.files)
                          : [],
                      }))
                    }
                    className="mt-1 block w-full text-sm"
                  />
                </Field>

                <Field
                  label={t("observations.form.description", {
                    defaultValue: "Description",
                  })}
                >
                  <textarea
                    rows={4}
                    value={formState.description}
                    onChange={(e) =>
                      setFormState((s) => ({
                        ...s,
                        description: e.target.value,
                      }))
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
                      !formState.subcategoryId ||
                      !formState.branchId ||
                      !formState.workerFullName ||
                      !formState.workerProfession ||
                      !formState.deadlineDate ||
                      isSaving
                    }
                  >
                    {editingId
                      ? t("common.save", { defaultValue: "Save" })
                      : t("observations.actions.add", {
                          defaultValue: "Add Observation",
                        })}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      {detailObservation ? (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="flex-1 bg-black/40" onClick={handleCloseDetails} />
          <div className="h-full w-full max-w-md overflow-y-auto bg-background p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold uppercase">
                  {t("observations.drawer.viewTitle", {
                    defaultValue: "Observation details",
                  })}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("observations.drawer.viewSubtitle", {
                    defaultValue: "Full observation information",
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
                label={t("observations.table.project", { defaultValue: "Project" })}
                value={
                  detailObservation.project?.name ||
                  projectsQuery.data?.find((p) => p.id === detailObservation.projectId)?.name ||
                  t("common.noData", { defaultValue: "N/A" })
                }
              />
              <DetailRow
                label={t("observations.table.location", { defaultValue: "Area" })}
                value={
                  detailObservation.location?.name ||
                  locationsQuery.data?.find((l) => l.id === detailObservation.locationId)?.name ||
                  t("common.noData", { defaultValue: "N/A" })
                }
              />
              <DetailRow
                label={t("observations.form.branch", { defaultValue: "Branch" })}
                value={
                  detailObservation.branch?.typeName ||
                  typesQuery.data?.find((b) => b.id === detailObservation.branchId)?.typeName ||
                  t("common.noData", { defaultValue: "N/A" })
                }
              />
              <DetailRow
                label={t("observations.form.department", { defaultValue: "Department" })}
                value={
                  detailObservation.department?.name ||
                  departmentsQuery.data?.find((d) => d.id === detailObservation.departmentId)?.name ||
                  t("common.noData", { defaultValue: "N/A" })
                }
              />
              <DetailRow
                label={t("observations.form.category", { defaultValue: "Category" })}
                value={
                  detailObservation.category?.categoryName ||
                  categoriesQuery.data?.find((c) => c.id === detailObservation.categoryId)?.categoryName ||
                  t("common.noData", { defaultValue: "N/A" })
                }
              />
              <DetailRow
                label={t("observations.form.subcategory", { defaultValue: "Subcategory" })}
                value={
                  detailObservation.subcategory?.subcategoryName ||
                  subcategoriesQuery.data?.find((s) => s.id === detailObservation.subcategoryId)?.subcategoryName ||
                  t("common.noData", { defaultValue: "N/A" })
                }
              />
              <DetailRow
                label={t("observations.form.createdBy", { defaultValue: "Issued by" })}
                value={
                  detailObservation.createdBy?.fullName ||
                  supervisorsQuery.data?.find((u) => u.id === detailObservation.createdByUserId)?.fullName ||
                  t("common.noData", { defaultValue: "N/A" })
                }
              />
              <DetailRow
                label={t("observations.form.supervisor", { defaultValue: "Responsible" })}
                value={
                  detailObservation.supervisor?.fullName ||
                  supervisorsQuery.data?.find((s) => s.id === detailObservation.supervisorId)?.fullName ||
                  t("common.noData", { defaultValue: "N/A" })
                }
              />
              <DetailRow
                label={t("observations.table.worker", { defaultValue: "Worker" })}
                value={detailObservation.workerFullName}
              />
              <DetailRow
                label={t("observations.form.workerProfession", { defaultValue: "Profession" })}
                value={detailObservation.workerProfession}
              />
              <DetailRow
                label={t("observations.form.riskLevel", { defaultValue: "Risk level" })}
                value={detailObservation.riskLevel}
              />
              <DetailRow
                label={t("observations.table.company", { defaultValue: "Company" })}
                value={detailObservation.company?.companyName || t("common.noData", { defaultValue: "N/A" })}
              />
              <DetailRow
                label={t("observations.table.status", { defaultValue: "Status" })}
                value={detailObservation.status}
              />
              <DetailRow
                label={t("observations.table.deadline", { defaultValue: "Deadline" })}
                value={formatDateTime(detailObservation.deadline)}
              />
              <DetailRow
                label={t("observations.drawer.createdAt", { defaultValue: "Created at" })}
                value={formatDateTime(detailObservation.createdAt)}
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("observations.form.description", { defaultValue: "Description" })}
                </p>
                <p className="mt-1 whitespace-pre-line text-sm text-foreground">
                  {detailObservation.description ||
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

type ObservationForm = {
  createdByUserId: string;
  supervisorId: string;
  projectId: string;
  locationId: string;
  departmentId: string;
  categoryId: string;
  subcategoryId: string;
  branchId: string;
  workerFullName: string;
  workerProfession: string;
  riskLevel: number;
  description: string;
  deadlineDate: string;
  status: ObservationStatus;
  evidenceFiles: File[];
  correctiveFiles: File[];
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

const formatDateTime = (value?: string) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleString();
};

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className="flex items-start justify-between gap-4 rounded-md border border-border p-3">
    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {label}
    </div>
    <div className="text-sm text-foreground text-right">
      {value !== undefined && value !== null && value !== "" ? value : "N/A"}
    </div>
  </div>
);

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

