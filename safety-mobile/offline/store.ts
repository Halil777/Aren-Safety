import { getDb } from "./db";
import { enqueueMutation } from "./queue";
import { generateId, nowIso } from "./utils";
import { type SyncStatus } from "./types";

export type ObservationDto = {
  id: string;
  locationId: string;
  projectId: string;
  departmentId: string;
  categoryId: string;
  subcategoryId?: string;
  createdByUserId: string;
  supervisorId: string;
  workerFullName: string;
  workerProfession: string;
  riskLevel: number;
  description: string;
  deadline: string;
  status: string;
  locationName?: string;
  projectName?: string;
  departmentName?: string;
  categoryName?: string;
  subcategoryName?: string;
  companyId?: string | null;
  companyName?: string | null;
  supervisorName?: string;
  createdByName?: string;
  supervisorAnswer?: string | null;
  answeredAt?: string | null;
  rejectionReason?: string | null;
  media?: {
    id?: string;
    type: "IMAGE" | "VIDEO";
    url: string;
    isCorrective: boolean;
    uploadedByUserId?: string;
  }[];
  version?: number;
  updatedAt?: string;
};

export type TaskDto = {
  id: string;
  projectId: string;
  departmentId: string;
  categoryId: string;
  createdByUserId: string;
  supervisorId: string;
  description: string;
  deadline: string;
  status: string;
  projectName?: string;
  departmentName?: string;
  categoryName?: string;
  companyId?: string | null;
  companyName?: string | null;
  supervisorName?: string;
  createdByName?: string;
  supervisorAnswer?: string | null;
  answeredAt?: string | null;
  rejectionReason?: string | null;
  media?: {
    id?: string;
    type: "IMAGE" | "VIDEO" | "FILE";
    url: string;
    isCorrective: boolean;
    uploadedByUserId?: string;
  }[];
  completion?: number | null;
  version?: number;
  updatedAt?: string;
};

type ObservationRow = {
  local_id: string;
  server_id: string | null;
  location_id: string | null;
  project_id: string | null;
  department_id: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  created_by_user_id: string | null;
  supervisor_id: string | null;
  worker_full_name: string | null;
  worker_profession: string | null;
  risk_level: number | null;
  description: string | null;
  deadline: string | null;
  status: string | null;
  location_name: string | null;
  project_name: string | null;
  department_name: string | null;
  category_name: string | null;
  subcategory_name: string | null;
  company_id: string | null;
  company_name: string | null;
  supervisor_name: string | null;
  created_by_name: string | null;
  rejection_reason: string | null;
  answered_at: string | null;
  supervisor_answer: string | null;
  media_json: string | null;
  version: number | null;
  updated_at: string | null;
  deleted_at: string | null;
  sync_status: SyncStatus;
};

type TaskRow = {
  local_id: string;
  server_id: string | null;
  project_id: string | null;
  department_id: string | null;
  category_id: string | null;
  created_by_user_id: string | null;
  supervisor_id: string | null;
  description: string | null;
  deadline: string | null;
  status: string | null;
  project_name: string | null;
  department_name: string | null;
  category_name: string | null;
  company_id: string | null;
  company_name: string | null;
  supervisor_answer: string | null;
  answered_at: string | null;
  rejection_reason: string | null;
  media_json: string | null;
  completion: number | null;
  version: number | null;
  updated_at: string | null;
  deleted_at: string | null;
  sync_status: SyncStatus;
};

type ProjectRow = { id: string; name: string; updated_at: string | null };
type DepartmentRow = { id: string; name: string; updated_at: string | null };
type SupervisorRow = { id: string; full_name: string; updated_at: string | null };
type CategoryRow = { id: string; name: string; type: string | null; updated_at: string | null };
type SubcategoryRow = {
  id: string;
  name: string;
  category_id: string | null;
  type: string | null;
  updated_at: string | null;
};
type LocationRow = { id: string; name: string; project_id: string | null; updated_at: string | null };

function mapObservationRow(row: ObservationRow): ObservationDto & {
  syncStatus: SyncStatus;
  localId: string;
  serverId: string | null;
} {
  const media = row.media_json ? safeParse(row.media_json) : undefined;
  return {
    id: row.server_id || row.local_id,
    localId: row.local_id,
    serverId: row.server_id,
    locationId: row.location_id ?? "",
    projectId: row.project_id ?? "",
    departmentId: row.department_id ?? "",
    categoryId: row.category_id ?? "",
    subcategoryId: row.subcategory_id ?? undefined,
    createdByUserId: row.created_by_user_id ?? "",
    supervisorId: row.supervisor_id ?? "",
    workerFullName: row.worker_full_name ?? "",
    workerProfession: row.worker_profession ?? "",
    riskLevel: Number(row.risk_level ?? 0),
    description: row.description ?? "",
    deadline: row.deadline ?? "",
    status: row.status ?? "PENDING",
    locationName: row.location_name ?? undefined,
    projectName: row.project_name ?? undefined,
    departmentName: row.department_name ?? undefined,
    categoryName: row.category_name ?? undefined,
    subcategoryName: row.subcategory_name ?? undefined,
    companyId: row.company_id ?? undefined,
    companyName: row.company_name ?? undefined,
    supervisorName: row.supervisor_name ?? undefined,
    createdByName: row.created_by_name ?? undefined,
    rejectionReason: row.rejection_reason ?? undefined,
    answeredAt: row.answered_at ?? undefined,
    supervisorAnswer: row.supervisor_answer ?? undefined,
    media,
    version: row.version ?? undefined,
    updatedAt: row.updated_at ?? undefined,
    syncStatus: row.sync_status,
  };
}

function mapTaskRow(row: TaskRow): TaskDto & {
  syncStatus: SyncStatus;
  localId: string;
  serverId: string | null;
} {
  const media = row.media_json ? safeParse(row.media_json) : undefined;
  return {
    id: row.server_id || row.local_id,
    localId: row.local_id,
    serverId: row.server_id,
    projectId: row.project_id ?? "",
    departmentId: row.department_id ?? "",
    categoryId: row.category_id ?? "",
    createdByUserId: row.created_by_user_id ?? "",
    supervisorId: row.supervisor_id ?? "",
    description: row.description ?? "",
    deadline: row.deadline ?? "",
    status: row.status ?? "PENDING",
    projectName: row.project_name ?? undefined,
    departmentName: row.department_name ?? undefined,
    categoryName: row.category_name ?? undefined,
    companyId: row.company_id ?? undefined,
    companyName: row.company_name ?? undefined,
    supervisorName: row.supervisor_name ?? undefined,
    createdByName: row.created_by_name ?? undefined,
    supervisorAnswer: row.supervisor_answer ?? undefined,
    answeredAt: row.answered_at ?? undefined,
    rejectionReason: row.rejection_reason ?? undefined,
    media,
    completion: row.completion ?? undefined,
    version: row.version ?? undefined,
    updatedAt: row.updated_at ?? undefined,
    syncStatus: row.sync_status,
  };
}

function safeParse(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function mediaToJson(media: unknown) {
  try {
    return JSON.stringify(media ?? null);
  } catch {
    return null;
  }
}

export async function persistObservationsFromServer(list: ObservationDto[]) {
  const db = await getDb();
  const now = nowIso();
  await runInsertStatements(
    db,
    list.map((item) => ({
      sql: `INSERT OR REPLACE INTO observations (
        local_id, server_id, location_id, project_id, department_id, category_id, subcategory_id,
        created_by_user_id, supervisor_id, worker_full_name, worker_profession, risk_level,
        description, deadline, status, location_name, project_name, department_name, category_name,
        subcategory_name, company_id, company_name, supervisor_name, created_by_name,
        rejection_reason, answered_at, supervisor_answer, media_json, version, updated_at, deleted_at, sync_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SYNCED')`,
      args: [
        item.id,
        item.id,
        item.locationId,
        item.projectId,
        item.departmentId,
        item.categoryId,
        item.subcategoryId ?? null,
        item.createdByUserId,
        item.supervisorId,
        item.workerFullName,
        item.workerProfession,
        item.riskLevel ?? 0,
        item.description,
        item.deadline,
        item.status,
        item.locationName ?? null,
        item.projectName ?? null,
        item.departmentName ?? null,
        item.categoryName ?? null,
        item.subcategoryName ?? null,
        item.companyId ?? null,
        item.companyName ?? null,
        item.supervisorName ?? null,
        item.createdByName ?? null,
        item.rejectionReason ?? null,
        item.answeredAt ?? null,
        item.supervisorAnswer ?? null,
        mediaToJson(item.media),
        item.version ?? 0,
        item.updatedAt ?? now,
        null,
      ],
    }))
  );
}

export async function persistTasksFromServer(list: TaskDto[]) {
  const db = await getDb();
  const now = nowIso();
  await runInsertStatements(
    db,
    list.map((item) => ({
      sql: `INSERT OR REPLACE INTO tasks (
        local_id, server_id, project_id, department_id, category_id, created_by_user_id,
        supervisor_id, description, deadline, status, project_name, department_name, category_name,
        company_id, company_name, supervisor_answer, answered_at, rejection_reason, media_json,
        completion, version, updated_at, deleted_at, sync_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SYNCED')`,
      args: [
        item.id,
        item.id,
        item.projectId,
        item.departmentId,
        item.categoryId,
        item.createdByUserId,
        item.supervisorId,
        item.description,
        item.deadline,
        item.status,
        item.projectName ?? null,
        item.departmentName ?? null,
        item.categoryName ?? null,
        item.companyId ?? null,
        item.companyName ?? null,
        item.supervisorAnswer ?? null,
        item.answeredAt ?? null,
        item.rejectionReason ?? null,
        mediaToJson(item.media),
        item.completion ?? null,
        item.version ?? 0,
        item.updatedAt ?? now,
        null,
      ],
    }))
  );
}

export async function getObservationsLocal(): Promise<ObservationDto[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<ObservationRow>(
    "SELECT * FROM observations WHERE deleted_at IS NULL ORDER BY datetime(updated_at) DESC"
  );
  return rows.map(mapObservationRow);
}

export async function getObservationLocalById(id: string) {
  const db = await getDb();
  const row = await db.getFirstAsync<ObservationRow>(
    "SELECT * FROM observations WHERE (server_id = ? OR local_id = ?) AND deleted_at IS NULL LIMIT 1",
    id,
    id
  );
  return row ? mapObservationRow(row) : null;
}

export async function getTasksLocal(): Promise<TaskDto[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<TaskRow>(
    "SELECT * FROM tasks WHERE deleted_at IS NULL ORDER BY datetime(updated_at) DESC"
  );
  return rows.map(mapTaskRow);
}

export async function getTaskLocalById(id: string) {
  const db = await getDb();
  const row = await db.getFirstAsync<TaskRow>(
    "SELECT * FROM tasks WHERE (server_id = ? OR local_id = ?) AND deleted_at IS NULL LIMIT 1",
    id,
    id
  );
  return row ? mapTaskRow(row) : null;
}

export async function persistProjectsFromServer(list: { id: string; name: string }[]) {
  const db = await getDb();
  const now = nowIso();
  await runInsertStatements(
    db,
    list.map((item) => ({
      sql: `INSERT OR REPLACE INTO projects (id, name, updated_at) VALUES (?, ?, ?)`,
      args: [item.id, item.name, now],
    }))
  );
}

export async function persistDepartmentsFromServer(list: { id: string; name: string }[]) {
  const db = await getDb();
  const now = nowIso();
  await runInsertStatements(
    db,
    list.map((item) => ({
      sql: `INSERT OR REPLACE INTO departments (id, name, updated_at) VALUES (?, ?, ?)`,
      args: [item.id, item.name, now],
    }))
  );
}

export async function persistSupervisorsFromServer(list: { id: string; fullName: string }[]) {
  const db = await getDb();
  const now = nowIso();
  await runInsertStatements(
    db,
    list.map((item) => ({
      sql: `INSERT OR REPLACE INTO supervisors (id, full_name, updated_at) VALUES (?, ?, ?)`,
      args: [item.id, item.fullName, now],
    }))
  );
}

export async function persistCategoriesFromServer(
  list: { id: string; name: string; type?: string | undefined }[]
) {
  const db = await getDb();
  const now = nowIso();
  await runInsertStatements(
    db,
    list.map((item) => ({
      sql: `INSERT OR REPLACE INTO categories (id, name, type, updated_at) VALUES (?, ?, ?, ?)`,
      args: [item.id, item.name, item.type ?? null, now],
    }))
  );
}

export async function persistSubcategoriesFromServer(
  list: { id: string; name: string; categoryId: string; type?: string | undefined }[]
) {
  const db = await getDb();
  const now = nowIso();
  await runInsertStatements(
    db,
    list.map((item) => ({
      sql: `INSERT OR REPLACE INTO subcategories (id, name, category_id, type, updated_at) VALUES (?, ?, ?, ?, ?)`,
      args: [item.id, item.name, item.categoryId, item.type ?? null, now],
    }))
  );
}

export async function persistLocationsFromServer(list: { id: string; name: string; projectId: string }[]) {
  const db = await getDb();
  const now = nowIso();
  await runInsertStatements(
    db,
    list.map((item) => ({
      sql: `INSERT OR REPLACE INTO locations (id, name, project_id, updated_at) VALUES (?, ?, ?, ?)`,
      args: [item.id, item.name, item.projectId ?? null, now],
    }))
  );
}

export async function getProjectsLocal(): Promise<ProjectRow[]> {
  const db = await getDb();
  return db.getAllAsync<ProjectRow>("SELECT * FROM projects");
}

export async function getDepartmentsLocal(): Promise<DepartmentRow[]> {
  const db = await getDb();
  return db.getAllAsync<DepartmentRow>("SELECT * FROM departments");
}

export async function getSupervisorsLocal(): Promise<SupervisorRow[]> {
  const db = await getDb();
  return db.getAllAsync<SupervisorRow>("SELECT * FROM supervisors");
}

export async function getCategoriesLocal(type?: string): Promise<CategoryRow[]> {
  const db = await getDb();
  if (type) {
    return db.getAllAsync<CategoryRow>("SELECT * FROM categories WHERE type = ?", type);
  }
  return db.getAllAsync<CategoryRow>("SELECT * FROM categories");
}

export async function getSubcategoriesLocal(type?: string, categoryId?: string): Promise<SubcategoryRow[]> {
  const db = await getDb();
  if (type && categoryId) {
    return db.getAllAsync<SubcategoryRow>(
      "SELECT * FROM subcategories WHERE type = ? AND category_id = ?",
      type,
      categoryId
    );
  }
  if (categoryId) {
    return db.getAllAsync<SubcategoryRow>("SELECT * FROM subcategories WHERE category_id = ?", categoryId);
  }
  if (type) {
    return db.getAllAsync<SubcategoryRow>("SELECT * FROM subcategories WHERE type = ?", type);
  }
  return db.getAllAsync<SubcategoryRow>("SELECT * FROM subcategories");
}

export async function getLocationsLocal(projectId?: string): Promise<LocationRow[]> {
  const db = await getDb();
  if (projectId) {
    return db.getAllAsync<LocationRow>("SELECT * FROM locations WHERE project_id = ?", projectId);
  }
  return db.getAllAsync<LocationRow>("SELECT * FROM locations");
}

export async function createObservationOffline(payload: Partial<ObservationDto>) {
  const localId = generateId();
  const now = nowIso();
  await getDb().then((db) =>
    db.runAsync(
      `INSERT INTO observations (
        local_id, server_id, location_id, project_id, department_id, category_id, subcategory_id,
        created_by_user_id, supervisor_id, worker_full_name, worker_profession, risk_level,
        description, deadline, status, location_name, project_name, department_name, category_name,
        subcategory_name, company_id, company_name, supervisor_name, created_by_name,
        rejection_reason, answered_at, supervisor_answer, media_json, version, updated_at, deleted_at, sync_status
      ) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 'PENDING')`,
      localId,
      payload.locationId ?? null,
      payload.projectId ?? null,
      payload.departmentId ?? null,
      payload.categoryId ?? null,
      payload.subcategoryId ?? null,
      payload.createdByUserId ?? null,
      payload.supervisorId ?? null,
      payload.workerFullName ?? null,
      payload.workerProfession ?? null,
      payload.riskLevel ?? 0,
      payload.description ?? "",
      payload.deadline ?? now,
      payload.status ?? "PENDING",
      payload.locationName ?? null,
      payload.projectName ?? null,
      payload.departmentName ?? null,
      payload.categoryName ?? null,
      payload.subcategoryName ?? null,
      payload.companyId ?? null,
      payload.companyName ?? null,
      payload.supervisorName ?? null,
      payload.createdByName ?? null,
      payload.rejectionReason ?? null,
      payload.answeredAt ?? null,
      payload.supervisorAnswer ?? null,
      mediaToJson(payload.media),
      payload.version ?? 0,
      payload.updatedAt ?? now
    )
  );

  await enqueueMutation({
    entityType: "observation",
    operation: "CREATE",
    payload: { localId, payload },
    baseVersion: null,
  });

  return {
    ...(payload as ObservationDto),
    id: localId,
    localId,
    serverId: null,
    syncStatus: "PENDING" as SyncStatus,
    version: payload.version ?? 0,
    updatedAt: payload.updatedAt ?? now,
  };
}

export async function createTaskOffline(payload: Partial<TaskDto>) {
  const localId = generateId();
  const now = nowIso();
  await getDb().then((db) =>
    db.runAsync(
      `INSERT INTO tasks (
        local_id, server_id, project_id, department_id, category_id, created_by_user_id,
        supervisor_id, description, deadline, status, project_name, department_name, category_name,
        company_id, company_name, supervisor_answer, answered_at, rejection_reason, media_json,
        completion, version, updated_at, deleted_at, sync_status
      ) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 'PENDING')`,
      localId,
      payload.projectId ?? null,
      payload.departmentId ?? null,
      payload.categoryId ?? null,
      payload.createdByUserId ?? null,
      payload.supervisorId ?? null,
      payload.description ?? "",
      payload.deadline ?? now,
      payload.status ?? "PENDING",
      payload.projectName ?? null,
      payload.departmentName ?? null,
      payload.categoryName ?? null,
      payload.companyId ?? null,
      payload.companyName ?? null,
      payload.supervisorAnswer ?? null,
      payload.answeredAt ?? null,
      payload.rejectionReason ?? null,
      mediaToJson(payload.media),
      payload.completion ?? null,
      payload.version ?? 0,
      payload.updatedAt ?? now
    )
  );

  await enqueueMutation({
    entityType: "task",
    operation: "CREATE",
    payload: { localId, payload },
    baseVersion: null,
  });

  return {
    ...(payload as TaskDto),
    id: localId,
    localId,
    serverId: null,
    syncStatus: "PENDING" as SyncStatus,
    version: payload.version ?? 0,
    updatedAt: payload.updatedAt ?? now,
  };
}

export async function markObservationSynced(params: {
  localId: string;
  server: ObservationDto;
}) {
  const db = await getDb();
  const { localId, server } = params;
  const updatedAt = server.updatedAt ?? nowIso();
  await db.runAsync(
    `UPDATE observations
     SET server_id = ?, version = ?, updated_at = ?, sync_status = 'SYNCED',
         status = COALESCE(?, status),
         project_id = COALESCE(?, project_id),
         department_id = COALESCE(?, department_id),
         category_id = COALESCE(?, category_id),
         subcategory_id = COALESCE(?, subcategory_id),
         created_by_user_id = COALESCE(?, created_by_user_id),
         supervisor_id = COALESCE(?, supervisor_id),
         worker_full_name = COALESCE(?, worker_full_name),
         worker_profession = COALESCE(?, worker_profession),
         risk_level = COALESCE(?, risk_level),
         description = COALESCE(?, description),
         deadline = COALESCE(?, deadline),
         media_json = COALESCE(?, media_json)
     WHERE local_id = ?`,
    server.id,
    server.version ?? 0,
    updatedAt,
    server.status ?? null,
    server.projectId ?? null,
    server.departmentId ?? null,
    server.categoryId ?? null,
    server.subcategoryId ?? null,
    server.createdByUserId ?? null,
    server.supervisorId ?? null,
    server.workerFullName ?? null,
    server.workerProfession ?? null,
    server.riskLevel ?? null,
    server.description ?? null,
    server.deadline ?? null,
    mediaToJson(server.media),
    localId
  );
}

export async function markTaskSynced(params: { localId: string; server: TaskDto }) {
  const db = await getDb();
  const { localId, server } = params;
  const updatedAt = server.updatedAt ?? nowIso();
  await db.runAsync(
    `UPDATE tasks
     SET server_id = ?, version = ?, updated_at = ?, sync_status = 'SYNCED',
         status = COALESCE(?, status),
         project_id = COALESCE(?, project_id),
         department_id = COALESCE(?, department_id),
         category_id = COALESCE(?, category_id),
         created_by_user_id = COALESCE(?, created_by_user_id),
         supervisor_id = COALESCE(?, supervisor_id),
         description = COALESCE(?, description),
         deadline = COALESCE(?, deadline),
         media_json = COALESCE(?, media_json)
     WHERE local_id = ?`,
    server.id,
    server.version ?? 0,
    updatedAt,
    server.status ?? null,
    server.projectId ?? null,
    server.departmentId ?? null,
    server.categoryId ?? null,
    server.createdByUserId ?? null,
    server.supervisorId ?? null,
    server.description ?? null,
    server.deadline ?? null,
    mediaToJson(server.media),
    localId
  );
}

async function runInsertStatements(
  db: Awaited<ReturnType<typeof getDb>>,
  statements: { sql: string; args: any[] }[]
) {
  if (!statements.length) return;
  await db.execAsync("BEGIN");
  try {
    for (const stmt of statements) {
      await db.runAsync(stmt.sql, ...stmt.args);
    }
    await db.execAsync("COMMIT");
  } catch (err) {
    try {
      await db.execAsync("ROLLBACK");
    } catch {
      // ignore rollback failures
    }
    throw err;
  }
}
