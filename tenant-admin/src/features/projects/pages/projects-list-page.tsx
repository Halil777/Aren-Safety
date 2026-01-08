import { FolderPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import {
  useCreateProjectMutation,
  useProjectsQuery,
  useUpdateProjectMutation,
} from "../api/hooks";
import type { Project } from "../types/project";

export function ProjectsListPage() {
  const { t } = useTranslation();
  const { data: projects, isLoading, error } = useProjectsQuery();
  const createMutation = useCreateProjectMutation();
  const updateMutation = useUpdateProjectMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formState, setFormState] = useState<ProjectFormValues>({
    name: "",
    projectClient: "",
    projectLocation: "",
    projectHead: "",
    startDate: "",
    endDate: "",
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleOpen = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormState({
        name: project.name ?? "",
        projectClient: project.projectClient ?? "",
        projectLocation: project.projectLocation ?? "",
        projectHead: project.projectHead ?? "",
        startDate: project.startDate ? project.startDate.slice(0, 10) : "",
        endDate: project.endDate ? project.endDate.slice(0, 10) : "",
      });
    } else {
      setEditingProject(null);
      setFormState({
        name: "",
        projectClient: "",
        projectLocation: "",
        projectHead: "",
        startDate: "",
        endDate: "",
      });
    }
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Omit<Project, "id"> = {
      name: formState.name,
      projectClient: emptyToNull(formState.projectClient),
      projectLocation: emptyToNull(formState.projectLocation),
      projectHead: emptyToNull(formState.projectHead),
      startDate: emptyToNull(formState.startDate),
      endDate: emptyToNull(formState.endDate),
    };

    if (editingProject) {
      await updateMutation.mutateAsync({
        id: editingProject.id,
        data: payload,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }

    handleClose();
  };

  const rows = useMemo(() => projects ?? [], [projects]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("pages.projects.title")}
        description={t("pages.projects.description")}
        actions={
          <Button type="button" variant="outline" onClick={() => handleOpen()}>
            <FolderPlus className="mr-2 h-4 w-4" />
            {t("nav.projects")}
          </Button>
        }
      />
      <Card>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              {t("common.loading", { defaultValue: "Loading..." })}
            </p>
          ) : error ? (
            <p className="text-sm text-destructive">
              {(error as Error).message}
            </p>
          ) : !rows || rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("pages.placeholder", { defaultValue: "No projects yet." })}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <Th>
                      {t("projects.table.name", { defaultValue: "Name" })}
                    </Th>
                    <Th>
                      {t("projects.table.client", { defaultValue: "Client" })}
                    </Th>
                    <Th>
                      {t("projects.table.location", {
                        defaultValue: "Location",
                      })}
                    </Th>
                    <Th>
                      {t("projects.table.head", {
                        defaultValue: "Project Head",
                      })}
                    </Th>
                    <Th>
                      {t("projects.table.start", {
                        defaultValue: "Start Date",
                      })}
                    </Th>
                    <Th>
                      {t("projects.table.end", { defaultValue: "End Date" })}
                    </Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((project) => (
                    <tr key={project.id} className="hover:bg-muted/50">
                      <Td>
                        <div className="font-medium text-foreground">
                          {project.name}
                        </div>
                      </Td>
                      <Td>{project.projectClient || "—"}</Td>
                      <Td>{project.projectLocation || "—"}</Td>
                      <Td>{project.projectHead || "—"}</Td>
                      <Td>{formatDate(project.startDate)}</Td>
                      <Td>{formatDate(project.endDate)}</Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpen(project)}
                          >
                            {t("common.edit", { defaultValue: "Edit" })}
                          </Button>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {drawerOpen ? (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="h-full w-full bg-background shadow-2xl md:w-1/2">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-lg font-semibold uppercase">
                  {editingProject
                    ? t("projects.form.editTitle", {
                        defaultValue: "Edit project",
                      })
                    : t("projects.form.createTitle", {
                        defaultValue: "Create project",
                      })}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("projects.form.subtitle", {
                    defaultValue: "Project details",
                  })}
                </p>
              </div>
              <Button variant="ghost" onClick={handleClose}>
                {t("common.cancel")}
              </Button>
            </div>
            <div className="h-[calc(100%-64px)] overflow-y-auto p-4">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label={t("projects.form.name", { defaultValue: "Name" })}
                    value={formState.name}
                    onChange={(value) =>
                      setFormState((s) => ({ ...s, name: value }))
                    }
                    required
                  />
                  <Field
                    label={t("projects.form.client", {
                      defaultValue: "Client",
                    })}
                    value={formState.projectClient}
                    onChange={(value) =>
                      setFormState((s) => ({ ...s, projectClient: value }))
                    }
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label={t("projects.form.location", {
                      defaultValue: "Location",
                    })}
                    value={formState.projectLocation}
                    onChange={(value) =>
                      setFormState((s) => ({ ...s, projectLocation: value }))
                    }
                  />
                  <Field
                    label={t("projects.form.head", {
                      defaultValue: "Project head",
                    })}
                    value={formState.projectHead}
                    onChange={(value) =>
                      setFormState((s) => ({ ...s, projectHead: value }))
                    }
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label={t("projects.form.start", {
                      defaultValue: "Start date",
                    })}
                    type="date"
                    value={formState.startDate}
                    onChange={(value) =>
                      setFormState((s) => ({ ...s, startDate: value }))
                    }
                  />
                  <Field
                    label={t("projects.form.end", { defaultValue: "End date" })}
                    type="date"
                    value={formState.endDate}
                    onChange={(value) =>
                      setFormState((s) => ({ ...s, endDate: value }))
                    }
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSaving}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving || !formState.name.trim()}
                  >
                    {isSaving
                      ? t("common.saving", { defaultValue: "Saving..." })
                      : editingProject
                      ? t("common.save", { defaultValue: "Save" })
                      : t("common.create", { defaultValue: "Create" })}
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

function formatDate(date?: Project["startDate"]) {
  if (!date) return "—";
  const d = new Date(date);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

const Th = (props: React.HTMLAttributes<HTMLTableCellElement>) => (
  <th
    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap"
    {...props}
  />
);

const Td = (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className="px-4 py-3 text-sm text-foreground align-middle" {...props} />
);

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: FieldProps) {
  return (
    <label className="space-y-1 text-sm font-medium text-foreground">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      />
    </label>
  );
}

type ProjectFormValues = {
  name: string;
  projectClient: string;
  projectLocation: string;
  projectHead: string;
  startDate: string;
  endDate: string;
};

function emptyToNull(value?: string | null) {
  if (!value) return null;
  return value.trim() === "" ? null : value;
}
