import { getDb } from "./db";
import { getSyncAuthToken } from "./auth";
import { countPendingMutations, deleteMutation, getPendingMutations, updateMutationStatus } from "./queue";
import { markObservationSynced, markTaskSynced } from "./store";
import {
  createObservationOnline,
  createTaskOnline,
  updateObservationOnline,
  updateTaskOnline,
  deleteObservationOnline,
  deleteTaskOnline
} from "../services/api";

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

      // Handle observation operations
      if (item.entityType === "observation" && item.operation === "CREATE") {
        const { localId, payload } = (item.payload as any) ?? {};
        const created = await createObservationOnline(token, payload);
        await markObservationSynced({ localId, server: created });
        await deleteMutation(item.id);
      } else if (item.entityType === "observation" && item.operation === "UPDATE") {
        const { serverId, payload } = (item.payload as any) ?? {};
        if (!serverId) {
          throw new Error("UPDATE requires serverId");
        }
        const updated = await updateObservationOnline(token, serverId, payload);
        await markObservationSynced({ localId: updated.id, server: updated });
        await deleteMutation(item.id);
      } else if (item.entityType === "observation" && item.operation === "DELETE") {
        const { serverId } = (item.payload as any) ?? {};
        if (!serverId) {
          throw new Error("DELETE requires serverId");
        }
        await deleteObservationOnline(token, serverId);
        await deleteMutation(item.id);
      }
      // Handle task operations
      else if (item.entityType === "task" && item.operation === "CREATE") {
        const { localId, payload } = (item.payload as any) ?? {};
        const created = await createTaskOnline(token, payload);
        await markTaskSynced({ localId, server: created });
        await deleteMutation(item.id);
      } else if (item.entityType === "task" && item.operation === "UPDATE") {
        const { serverId, payload } = (item.payload as any) ?? {};
        if (!serverId) {
          throw new Error("UPDATE requires serverId");
        }
        const updated = await updateTaskOnline(token, serverId, payload);
        await markTaskSynced({ localId: updated.id, server: updated });
        await deleteMutation(item.id);
      } else if (item.entityType === "task" && item.operation === "DELETE") {
        const { serverId } = (item.payload as any) ?? {};
        if (!serverId) {
          throw new Error("DELETE requires serverId");
        }
        await deleteTaskOnline(token, serverId);
        await deleteMutation(item.id);
      }
      // Handle media attachment operations (to be implemented)
      else if (item.entityType === "attachment") {
        // TODO: Implement media attachment sync
        await updateMutationStatus({
          id: item.id,
          status: "FAILED",
          lastError: "Media attachment sync not yet implemented",
          retryCount: item.retryCount + 1,
        });
      }
      // Unsupported operations
      else {
        await updateMutationStatus({
          id: item.id,
          status: "FAILED",
          lastError: `Unsupported operation: ${item.entityType} ${item.operation}`,
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
