import { getDb } from "./db";
import { generateId, nowIso } from "./utils";
import {
  type EntityType,
  type MutationOperation,
  type MutationStatus,
  type QueueItem,
} from "./types";

type QueueRow = {
  id: string;
  entity_type: EntityType;
  operation: MutationOperation;
  payload: string;
  base_version: number | null;
  status: MutationStatus;
  retry_count: number;
  last_error: string | null;
  created_at: string;
  updated_at: string;
};

export type EnqueueParams = {
  id?: string;
  entityType: EntityType;
  operation: MutationOperation;
  payload: unknown;
  baseVersion?: number | null;
  status?: MutationStatus;
  retryCount?: number;
  lastError?: string | null;
};

function rowToItem(row: QueueRow): QueueItem {
  return {
    id: row.id,
    entityType: row.entity_type,
    operation: row.operation,
    payload: safeParse(row.payload),
    baseVersion: row.base_version,
    status: row.status,
    retryCount: row.retry_count,
    lastError: row.last_error,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function safeParse(raw: string) {
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.warn("[offline] failed to parse queue payload", err);
    return raw;
  }
}

export async function enqueueMutation(input: EnqueueParams): Promise<QueueItem> {
  const db = await getDb();
  const id = input.id ?? generateId();
  const now = nowIso();
  const status = input.status ?? "PENDING";
  const retryCount = input.retryCount ?? 0;
  const payload = JSON.stringify(input.payload ?? null);

  await db.runAsync(
    `INSERT INTO sync_queue (id, entity_type, operation, payload, base_version, status, retry_count, last_error, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       payload = excluded.payload,
       operation = excluded.operation,
       base_version = excluded.base_version,
       status = excluded.status,
       retry_count = excluded.retry_count,
       last_error = excluded.last_error,
       updated_at = excluded.updated_at`,
    id,
    input.entityType,
    input.operation,
    payload,
    input.baseVersion ?? null,
    status,
    retryCount,
    input.lastError ?? null,
    now,
    now
  );

  return {
    id,
    entityType: input.entityType,
    operation: input.operation,
    payload: input.payload,
    baseVersion: input.baseVersion ?? null,
    status,
    retryCount,
    lastError: input.lastError ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

export async function getPendingMutations(): Promise<QueueItem[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<QueueRow>(
    "SELECT * FROM sync_queue WHERE status IN ('PENDING', 'FAILED') ORDER BY created_at ASC"
  );
  return rows.map(rowToItem);
}

export async function updateMutationStatus(params: {
  id: string;
  status: MutationStatus;
  retryCount?: number;
  lastError?: string | null;
}) {
  const db = await getDb();
  const now = nowIso();
  await db.runAsync(
    `UPDATE sync_queue
     SET status = ?, retry_count = ?, last_error = ?, updated_at = ?
     WHERE id = ?`,
    params.status,
    params.retryCount ?? 0,
    params.lastError ?? null,
    now,
    params.id
  );
}

export async function deleteMutation(id: string) {
  const db = await getDb();
  await db.runAsync("DELETE FROM sync_queue WHERE id = ?", id);
}

export async function countPendingMutations(): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM sync_queue WHERE status IN ('PENDING', 'FAILED')"
  );
  return row?.count ?? 0;
}
