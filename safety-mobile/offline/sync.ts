import { getDb } from "./db";
import { getSyncAuthToken } from "./auth";
import { countPendingMutations, deleteMutation, getPendingMutations, updateMutationStatus } from "./queue";
import { markObservationSynced, markTaskSynced } from "./store";
import { createObservationOnline, createTaskOnline } from "../services/api";

export async function initializeOfflineStore() {
  await getDb();
}

export type SyncRunResult = {
  pendingMutations: number;
};

export async function syncOnce(): Promise<SyncRunResult> {
  await getDb();
  const token = getSyncAuthToken();
  const pending = await getPendingMutations();

  if (!token || pending.length === 0) {
    return { pendingMutations: pending.length };
  }

  for (const item of pending) {
    try {
      await updateMutationStatus({ id: item.id, status: "PROCESSING", retryCount: item.retryCount + 1 });
      if (item.entityType === "observation" && item.operation === "CREATE") {
        const { localId, payload } = (item.payload as any) ?? {};
        const created = await createObservationOnline(token, payload);
        await markObservationSynced({ localId, server: created });
        await deleteMutation(item.id);
      } else if (item.entityType === "task" && item.operation === "CREATE") {
        const { localId, payload } = (item.payload as any) ?? {};
        const created = await createTaskOnline(token, payload);
        await markTaskSynced({ localId, server: created });
        await deleteMutation(item.id);
      } else {
        await updateMutationStatus({
          id: item.id,
          status: "FAILED",
          lastError: "Unsupported operation",
          retryCount: item.retryCount + 1,
        });
      }
    } catch (err: any) {
      await updateMutationStatus({
        id: item.id,
        status: "FAILED",
        lastError: err?.message ?? String(err),
        retryCount: item.retryCount + 1,
      });
    }
  }

  const remaining = await countPendingMutations();
  return { pendingMutations: remaining };
}

export async function refreshPendingCount(): Promise<number> {
  return countPendingMutations();
}
