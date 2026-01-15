export type EntityType = "observation" | "task" | "profile" | "attachment";

export type SyncStatus = "SYNCED" | "PENDING" | "FAILED" | "NEEDS_REVIEW";

export type MutationOperation = "CREATE" | "UPDATE" | "DELETE" | "UPLOAD";

export type MutationStatus = "PENDING" | "PROCESSING" | "FAILED" | "DONE";

export type CursorKey = "observations" | "tasks" | "profiles";

export type QueueItem = {
  id: string;
  entityType: EntityType;
  operation: MutationOperation;
  payload: unknown;
  baseVersion?: number | null;
  status: MutationStatus;
  retryCount: number;
  lastError?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MigrationStep = {
  toVersion: number;
  statements: string[];
};
