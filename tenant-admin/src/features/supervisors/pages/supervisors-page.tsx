import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ShieldPlus,
  Pencil,
  Trash2,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Power,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { PageHeader } from "@/shared/ui/page-header";
import { cn } from "@/shared/lib/cn";

import { useProjectsQuery } from "@/features/projects/api/hooks";
import { useDepartmentsQuery } from "@/features/departments/api/hooks";
import {
  useCreateSupervisorMutation,
  useDeleteSupervisorMutation,
  useSupervisorsQuery,
  useUpdateSupervisorMutation,
} from "../api/hooks";
import type { Supervisor, SupervisorInput } from "../types/supervisor";

// shadcn/ui (recommended for premium feel)
import { Badge } from "@/shared/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Separator } from "@/shared/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

type SortKey = "name" | "login" | "status";
type SortDir = "asc" | "desc";

export function SupervisorsPage() {
  const { t } = useTranslation();

  const projectsQuery = useProjectsQuery();
  const departmentsQuery = useDepartmentsQuery();
  const supervisorsQuery = useSupervisorsQuery();

  const createMutation = useCreateSupervisorMutation();
  const updateMutation = useUpdateSupervisorMutation();
  const deleteMutation = useDeleteSupervisorMutation();

  const rows = supervisorsQuery.data ?? [];
  const isLoading = supervisorsQuery.isLoading;
  const error = supervisorsQuery.error as Error | null | undefined;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  // UI state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // search (debounced)
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(searchTerm), 220);
    return () => window.clearTimeout(id);
  }, [searchTerm]);

  // sorting
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");

  const [formState, setFormState] = useState<SupervisorForm>({
    fullName: "",
    phoneNumber: "",
    email: "",
    profession: "",
    login: "",
    password: "",
    departmentId: "",
    projectIds: [],
    isActive: true,
  });

  const departmentNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const d of departmentsQuery.data ?? []) map.set(d.id, d.name);
    return map;
  }, [departmentsQuery.data]);

  const projectNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of projectsQuery.data ?? []) map.set(p.id, p.name);
    return map;
  }, [projectsQuery.data]);

  const filteredRows = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();

    let out = rows;

    // search
    if (term) {
      out = out.filter((r) => {
        const depName =
          r.department?.name ||
          (r.departmentId ? departmentNameById.get(r.departmentId) : "") ||
          "";
        const projNames =
          r.projects?.map((p) => p.name).join(", ") ||
          (r.projectIds ?? [])
            .map((pid) => projectNameById.get(pid) ?? "")
            .filter(Boolean)
            .join(", ");

        const s = [
          r.fullName,
          r.login,
          r.email ?? "",
          r.phoneNumber,
          r.profession ?? "",
          depName,
          projNames,
          r.isActive ? "active" : "inactive",
        ]
          .join(" ")
          .toLowerCase();

        return s.includes(term);
      });
    }

    // sort
    const dir = sortDir === "asc" ? 1 : -1;
    out = [...out].sort((a, b) => {
      if (sortKey === "status") {
        // active first in asc
        const av = a.isActive ? 1 : 0;
        const bv = b.isActive ? 1 : 0;
        return (bv - av) * dir;
      }
      const av = (sortKey === "name" ? a.fullName : a.login).toLowerCase();
      const bv = (sortKey === "name" ? b.fullName : b.login).toLowerCase();
      return av.localeCompare(bv) * dir;
    });

    return out;
  }, [
    rows,
    debouncedSearch,
    sortKey,
    sortDir,
    departmentNameById,
    projectNameById,
  ]);

  const toggleProject = (id: string) => {
    setFormState((s) => ({
      ...s,
      projectIds: s.projectIds.includes(id)
        ? s.projectIds.filter((pid) => pid !== id)
        : [...s.projectIds, id],
    }));
  };

  const handleOpenDrawer = (row?: Supervisor) => {
    if (row) {
      setEditingId(row.id);
      setFormState({
        fullName: row.fullName,
        phoneNumber: row.phoneNumber,
        email: row.email ?? "",
        profession: row.profession ?? "",
        login: row.login,
        password: "",
        departmentId: row.departmentId ?? "",
        projectIds: row.projects?.map((p) => p.id) ?? row.projectIds ?? [],
        isActive: row.isActive,
      });
    } else {
      setEditingId(null);
      setFormState({
        fullName: "",
        phoneNumber: "",
        email: "",
        profession: "",
        login: "",
        password: "",
        departmentId: "",
        projectIds: [],
        isActive: true,
      });
    }
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: SupervisorInput = {
      fullName: formState.fullName,
      phoneNumber: formState.phoneNumber,
      email: formState.email || undefined,
      profession: formState.profession || undefined,
      login: formState.login,
      password: formState.password || undefined,
      departmentId: formState.departmentId || undefined,
      projectIds: formState.projectIds,
      isActive: formState.isActive,
    };

    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    handleCloseDrawer();
  };

  const openDeleteDialog = (row: Supervisor) => {
    setDeleteId(row.id);
    setDeleteName(row.fullName);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
    setDeleteName("");
  };

  const toggleStatus = async (row: Supervisor) => {
    const payload: SupervisorInput = {
      fullName: row.fullName,
      phoneNumber: row.phoneNumber,
      email: row.email ?? undefined,
      profession: row.profession ?? undefined,
      login: row.login,
      departmentId: row.departmentId ?? undefined,
      projectIds: row.projects?.map((p) => p.id) ?? row.projectIds ?? [],
      isActive: !row.isActive,
    };
    await updateMutation.mutateAsync({ id: row.id, data: payload });
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
      return;
    }
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <PageHeader
          title={t("pages.supervisors.title", { defaultValue: "Supervisors" })}
          description={t("pages.supervisors.description", {
            defaultValue: "Assign and monitor supervisors across projects.",
          })}
          actions={
            <div className="flex items-center gap-2">
              <Button type="button" onClick={() => handleOpenDrawer()}>
                <ShieldPlus className="mr-2 h-4 w-4" />
                {t("supervisors.actions.add", {
                  defaultValue: "Add Supervisor",
                })}
              </Button>
            </div>
          }
        />

        <Card className="shadow-sm">
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <label className="relative w-full md:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t("supervisors.searchPlaceholder", {
                    defaultValue: "Search supervisors...",
                  })}
                  aria-label={t("supervisors.searchPlaceholder", {
                    defaultValue: "Search supervisors...",
                  })}
                  className="pl-9"
                />
              </label>
            </div>

            <Separator />

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <ThButton
                      onClick={() => toggleSort("name")}
                      active={sortKey === "name"}
                    >
                      {t("supervisors.table.name", { defaultValue: "Name" })}
                      <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                    </ThButton>

                    <ThButton
                      onClick={() => toggleSort("login")}
                      active={sortKey === "login"}
                    >
                      {t("supervisors.table.login", { defaultValue: "Login" })}
                      <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                    </ThButton>

                    <Th>
                      {t("supervisors.table.department", {
                        defaultValue: "Department",
                      })}
                    </Th>
                    <Th>
                      {t("supervisors.table.projects", {
                        defaultValue: "Projects",
                      })}
                    </Th>

                    <ThButton
                      onClick={() => toggleSort("status")}
                      active={sortKey === "status"}
                    >
                      {t("supervisors.table.status", {
                        defaultValue: "Status",
                      })}
                      <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                    </ThButton>

                    <Th className="w-14 text-right">
                      {t("supervisors.table.actions", {
                        defaultValue: "Actions",
                      })}
                    </Th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    <SkeletonRows />
                  ) : error ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-10 text-center text-sm text-destructive"
                      >
                        {error.message}
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-10 text-center text-sm text-muted-foreground"
                      >
                        {t("supervisors.table.empty", {
                          defaultValue: "No supervisors yet.",
                        })}
                      </td>
                    </tr>
                  ) : filteredRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-10 text-center text-sm text-muted-foreground"
                      >
                        {t("supervisors.table.noResults", {
                          defaultValue: "No supervisors match your filters.",
                        })}
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => {
                      const dept =
                        row.department?.name ||
                        (row.departmentId
                          ? departmentNameById.get(row.departmentId)
                          : "") ||
                        t("common.noData", { defaultValue: "N/A" });

                      return (
                        <tr
                          key={row.id}
                          className="transition hover:bg-muted/40"
                        >
                          <Td className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="grid h-8 w-8 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                                {initials(row.fullName)}
                              </div>
                              <div className="min-w-0">
                                <div className="truncate">{row.fullName}</div>
                                <div className="truncate text-xs text-muted-foreground">
                                  {row.phoneNumber}
                                </div>
                              </div>
                            </div>
                          </Td>

                          <Td>
                            <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                              {row.login}
                            </span>
                          </Td>

                          <Td className="text-muted-foreground">{dept}</Td>

                          <Td>
                            <ProjectsBadges
                              row={row}
                              projectNameById={projectNameById}
                            />
                          </Td>

                          <Td>
                            {row.isActive ? (
                              <Badge className="gap-1" variant="default">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {t("common.active", { defaultValue: "Active" })}
                              </Badge>
                            ) : (
                              <Badge className="gap-1" variant="secondary">
                                <XCircle className="h-3.5 w-3.5" />
                                {t("common.inactive", {
                                  defaultValue: "Inactive",
                                })}
                              </Badge>
                            )}
                          </Td>

                          <Td className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenDrawer(row)}
                                className="rounded-md border border-border bg-background p-2 text-muted-foreground transition hover:text-foreground"
                                aria-label={t("common.edit", {
                                  defaultValue: "Edit",
                                })}
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleStatus(row)}
                                disabled={updateMutation.isPending}
                                className="rounded-md border border-border bg-background p-2 text-muted-foreground transition hover:text-foreground disabled:opacity-50"
                                aria-label={
                                  row.isActive
                                    ? t("supervisors.actions.deactivate", {
                                        defaultValue: "Deactivate",
                                      })
                                    : t("supervisors.actions.activate", {
                                        defaultValue: "Activate",
                                      })
                                }
                              >
                                <Power
                                  className={cn(
                                    "h-4 w-4",
                                    row.isActive
                                      ? "text-emerald-600"
                                      : "text-amber-600"
                                  )}
                                />
                              </button>
                              <button
                                type="button"
                                onClick={() => openDeleteDialog(row)}
                                className="rounded-md border border-border bg-background p-2 text-muted-foreground transition hover:text-destructive"
                                aria-label={t("common.delete", {
                                  defaultValue: "Delete",
                                })}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </Td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Drawer */}
        {drawerOpen ? (
          <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-sm">
            <div className="flex h-screen w-full flex-col bg-background shadow-2xl md:w-[420px]">
              <div className="border-b border-border px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold uppercase">
                      {editingId
                        ? t("supervisors.form.editTitle", {
                            defaultValue: "Edit Supervisor",
                          })
                        : t("supervisors.form.createTitle", {
                            defaultValue: "Add Supervisor",
                          })}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t("supervisors.form.subtitle", {
                        defaultValue: "Supervisor details",
                      })}
                    </p>
                  </div>
                  <Button variant="ghost" onClick={handleCloseDrawer}>
                    {t("common.close", { defaultValue: "Close" })}
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <Section
                    title={t("supervisors.form.sectionIdentity", {
                      defaultValue: "Identity",
                    })}
                  >
                    <TwoCol>
                      <Field
                        label={t("supervisors.form.name", {
                          defaultValue: "Full name",
                        })}
                        required
                      >
                        <input
                          required
                          type="text"
                          value={formState.fullName}
                          onChange={(e) =>
                            setFormState((s) => ({
                              ...s,
                              fullName: e.target.value,
                            }))
                          }
                          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        />
                      </Field>

                      <Field
                        label={t("supervisors.form.login", {
                          defaultValue: "Login",
                        })}
                        required
                      >
                        <input
                          required
                          type="text"
                          value={formState.login}
                          onChange={(e) =>
                            setFormState((s) => ({
                              ...s,
                              login: e.target.value,
                            }))
                          }
                          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        />
                      </Field>
                    </TwoCol>

                    <TwoCol>
                      <Field
                        label={t("supervisors.form.phone", {
                          defaultValue: "Phone number",
                        })}
                        required
                      >
                        <input
                          required
                          type="tel"
                          value={formState.phoneNumber}
                          onChange={(e) =>
                            setFormState((s) => ({
                              ...s,
                              phoneNumber: e.target.value,
                            }))
                          }
                          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        />
                      </Field>

                      <Field
                        label={t("supervisors.form.email", {
                          defaultValue: "Email",
                        })}
                      >
                        <input
                          type="email"
                          value={formState.email}
                          onChange={(e) =>
                            setFormState((s) => ({
                              ...s,
                              email: e.target.value,
                            }))
                          }
                          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        />
                      </Field>
                    </TwoCol>

                    <Field
                      label={t("supervisors.form.profession", {
                        defaultValue: "Profession",
                      })}
                    >
                      <input
                        type="text"
                        value={formState.profession}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            profession: e.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      />
                    </Field>
                  </Section>

                  <Section
                    title={t("supervisors.form.sectionAccess", {
                      defaultValue: "Access & Assignment",
                    })}
                  >
                    <Field
                      label={t("supervisors.form.department", {
                        defaultValue: "Department",
                      })}
                    >
                      <select
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
                          {t("supervisors.form.departmentPlaceholder", {
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

                    <Field
                      label={t("supervisors.form.password", {
                        defaultValue: "Password",
                      })}
                    >
                      <input
                        type="password"
                        value={formState.password}
                        placeholder={
                          editingId
                            ? t("users.form.passwordPlaceholderEdit", {
                                defaultValue: "Leave blank to keep current",
                              })
                            : t("users.form.passwordPlaceholder", {
                                defaultValue: "Set initial password",
                              })
                        }
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            password: e.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      />
                    </Field>

                    <Field
                      label={t("supervisors.form.projects", {
                        defaultValue: "Projects",
                      })}
                      required
                    >
                      <div className="flex flex-wrap gap-2">
                        {projectsQuery.data?.map((project) => {
                          const selected = formState.projectIds.includes(
                            project.id
                          );
                          return (
                            <button
                              type="button"
                              key={project.id}
                              onClick={() => toggleProject(project.id)}
                              className={cn(
                                "rounded-full border px-3 py-1 text-sm transition",
                                selected
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border text-foreground hover:bg-muted/40"
                              )}
                            >
                              {project.name}
                            </button>
                          );
                        })}
                        {!projectsQuery.data?.length
                          ? t("common.noData", { defaultValue: "N/A" })
                          : null}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {t("supervisors.form.projectsHint", {
                          defaultValue:
                            "Select one or more projects for this supervisor.",
                        })}
                      </p>
                    </Field>

                    <Field
                      label={t("supervisors.form.status", {
                        defaultValue: "Status",
                      })}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formState.isActive}
                          onChange={(e) =>
                            setFormState((s) => ({
                              ...s,
                              isActive: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 rounded border-border"
                        />
                        <span className="text-sm">
                          {formState.isActive
                            ? t("common.active", { defaultValue: "Active" })
                            : t("common.inactive", {
                                defaultValue: "Inactive",
                              })}
                        </span>
                      </div>
                    </Field>
                  </Section>
                </form>
              </div>

              {/* Sticky footer */}
              <div className="border-t border-border bg-background/80 px-4 py-3 backdrop-blur">
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDrawer}
                  >
                    {t("common.cancel", { defaultValue: "Cancel" })}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      // submit programmatically
                      const form =
                        document.querySelector<HTMLFormElement>("form");
                      form?.requestSubmit();
                    }}
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
                      ? t("common.save", { defaultValue: "Save" })
                      : t("supervisors.actions.add", {
                          defaultValue: "Add Supervisor",
                        })}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Delete Dialog */}
        <Dialog
          open={!!deleteId}
          onOpenChange={(open) => (!open ? setDeleteId(null) : null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t("common.confirmDeleteTitle", {
                  defaultValue: "Delete supervisor?",
                })}
              </DialogTitle>
              <DialogDescription>
                {t("common.confirmDelete", {
                  defaultValue: "Are you sure you want to delete?",
                })}{" "}
                <span className="font-medium text-foreground">
                  {deleteName}
                </span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                {t("common.cancel", { defaultValue: "Cancel" })}
              </Button>

              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("common.delete", { defaultValue: "Delete" })}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

/* ------------------ helpers ------------------ */

type SupervisorForm = {
  fullName: string;
  phoneNumber: string;
  email: string;
  profession: string;
  login: string;
  password: string;
  departmentId: string;
  projectIds: string[];
  isActive: boolean;
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
    <span className="flex items-center gap-1">
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

const ThButton = ({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) => (
  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-md px-1 py-0.5 transition hover:text-foreground",
        active ? "text-foreground" : "text-muted-foreground"
      )}
    >
      {children}
    </button>
  </th>
);

const Td = (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td
    className={cn(
      "px-4 py-3 text-sm text-foreground align-middle",
      props.className
    )}
    {...props}
  />
);

function initials(name: string) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || "—";
}

function ProjectsBadges({
  row,
  projectNameById,
}: {
  row: Supervisor;
  projectNameById: Map<string, string>;
}) {
  const projects =
    row.projects?.map((p) => p.name) ??
    (row.projectIds ?? [])
      .map((id) => projectNameById.get(id) ?? "")
      .filter(Boolean);
  if (!projects.length)
    return <span className="text-muted-foreground">N/A</span>;

  const visible = projects.slice(0, 2);
  const rest = projects.length - visible.length;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((name, idx) => (
        <Badge
          key={`${row.id}_${idx}`}
          variant="secondary"
          className="font-normal"
        >
          {name}
        </Badge>
      ))}

      {rest > 0 ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="cursor-help font-normal">
              +{rest}
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="text-xs">{projects.slice(2).join(", ")}</div>
          </TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  );
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i}>
          <td colSpan={6} className="px-4 py-3">
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          </td>
        </tr>
      ))}
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-border p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
