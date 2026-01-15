import { getDb } from "./db";
import { type CursorKey } from "./types";

const UPSERT_METADATA = `
  INSERT INTO metadata (key, value)
  VALUES (?, ?)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value;
`;

function cursorKey(key: CursorKey) {
  return `${key}_cursor`;
}

export async function getMetadata(key: string): Promise<string | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ value: string | null }>(
    "SELECT value FROM metadata WHERE key = ?",
    key
  );
  return row?.value ?? null;
}

export async function setMetadata(key: string, value: string | null) {
  const db = await getDb();
  await db.runAsync(UPSERT_METADATA, key, value);
}

export async function getCursor(key: CursorKey): Promise<string | null> {
  return getMetadata(cursorKey(key));
}

export async function setCursor(key: CursorKey, value: string | null) {
  await setMetadata(cursorKey(key), value);
}
