import type React from "react";
import { Building2, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { cn } from "@/shared/lib/cn";
import { useProjectsQuery } from "@/features/projects/api/hooks";
import {
  useCreateLocationMutation,
  useDeleteLocationMutation,
  useLocationsQuery,
  useUpdateLocationMutation,
} from "../api/hooks";
import type { Location, LocationInput } from "../types/location";

type LocationForm = LocationInput;

export function LocationsPage() {
  const { t } = useTranslation();
  const projectsQuery = useProjectsQuery();
  const locationsQuery = useLocationsQuery();
  const createMutation = useCreateLocationMutation();
  const updateMutation = useUpdateLocationMutation();
  const deleteMutation = useDeleteLocationMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<LocationForm>({
    projectId: "",
    name: "",
  });

  const rows = locationsQuery.data ?? [];
  const isLoading = locationsQuery.isLoading;
  const error = locationsQuery.error as Error | null | undefined;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleOpenDrawer = (row?: Location) => {
    if (row) {
      setEditingId(row.id);
      setFormState({ projectId: row.projectId, name: row.name });
    } else {
      setEditingId(null);
      setFormState({ projectId: "", name: "" });
    }
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: LocationInput = { ...formState };

    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    handleCloseDrawer();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("pages.locations.title", { defaultValue: "Locations" })}
        description={t("pages.locations.description", {
          defaultValue: "Manage project locations.",
        })}
        actions={
          <Button type="button" variant="outline" onClick={() => handleOpenDrawer()}>
            <Building2 className="mr-2 h-4 w-4" />
            {t("locations.actions.add", { defaultValue: "Add Location" })}
          </Button>
        }
      />
      <Card>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <Th>{t("locations.table.project", { defaultValue: "Project" })}</Th>
                  <Th>{t("locations.table.name", { defaultValue: "Location Name" })}</Th>
                  <Th className="w-32 text-center">
                    {t("locations.table.actions", { defaultValue: "Actions" })}
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
                      {t("common.loading", { defaultValue: "Loading..." })}
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
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      {t("locations.table.empty", { defaultValue: "No locations yet." })}
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="hover:bg-muted/40">
                      <Td>
                        {row.project?.name ||
                          projectsQuery.data?.find((p) => p.id === row.projectId)?.name ||
                          t("common.noData", { defaultValue: "N/A" })}
                      </Td>
                      <Td>{row.name}</Td>
                      <Td className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            aria-label={t("common.edit", { defaultValue: "Edit" })}
                            onClick={() => handleOpenDrawer(row)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            aria-label={t("common.delete", { defaultValue: "Delete" })}
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
                <h2 className="text-lg font-semibold uppercase">
                  {editingId
                    ? t("locations.form.editTitle", { defaultValue: "Edit Location" })
                    : t("locations.form.createTitle", { defaultValue: "Add Location" })}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("locations.form.subtitle", {
                    defaultValue: "Location details",
                  })}
                </p>
              </div>
              <Button variant="ghost" onClick={handleCloseDrawer}>
                {t("common.cancel")}
              </Button>
            </div>
            <div className="h-[calc(100vh-64px)] overflow-y-auto p-4">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="space-y-1 text-sm font-medium text-foreground">
                  <span>
                    {t("locations.form.project", { defaultValue: "Project" })}
                    <span className="text-destructive">*</span>
                  </span>
                  <select
                    required
                    value={formState.projectId}
                    onChange={(e) => setFormState((s) => ({ ...s, projectId: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <option value="" disabled>
                      {t("locations.form.projectPlaceholder", {
                        defaultValue: "Select project",
                      })}
                    </option>
                    {(projectsQuery.data ?? []).map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1 text-sm font-medium text-foreground">
                  <span>
                    {t("locations.form.name", { defaultValue: "Location name" })}
                    <span className="text-destructive">*</span>
                  </span>
                  <input
                    required
                    value={formState.name}
                    onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </label>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDrawer}>
                    {t("common.cancel")}
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {editingId
                      ? t("locations.form.save", { defaultValue: "Save changes" })
                      : t("locations.form.create", { defaultValue: "Create" })}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const Th = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <th
    scope="col"
    className={cn(
      "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
      className
    )}
  >
    {children}
  </th>
);

const Td = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <td className={cn("whitespace-nowrap px-4 py-3 text-sm text-foreground", className)}>
    {children}
  </td>
);
