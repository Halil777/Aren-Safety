import { getDb } from "./db";
import { countPendingMutations, getPendingMutations } from "./queue";

export async function initializeOfflineStore() {
  await getDb();
}

export type SyncRunResult = {
  pendingMutations: number;
};

export async function syncOnce(): Promise<SyncRunResult> {
  await getDb();
  const pending = await getPendingMutations();
  // Actual push/pull will be added next; for now we only surface queue depth.
  return { pendingMutations: pending.length };
}

export async function refreshPendingCount(): Promise<number> {
  return countPendingMutations();
}
