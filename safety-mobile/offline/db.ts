import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";
import { MIGRATIONS, SCHEMA_VERSION } from "./migrations";

let dbPromise: Promise<SQLiteDatabase> | null = null;

async function runStatementsInTransaction(db: SQLiteDatabase, statements: string[]) {
  if (typeof (db as any).withExclusiveTransactionAsync === "function") {
    await (db as any).withExclusiveTransactionAsync(async () => {
      for (const stmt of statements) {
        await db.execAsync(stmt);
      }
    });
    return;
  }

  // Web fallback: explicit BEGIN/COMMIT
  await db.execAsync("BEGIN");
  try {
    for (const stmt of statements) {
      await db.execAsync(stmt);
    }
    await db.execAsync("COMMIT");
  } catch (err) {
    try {
      await db.execAsync("ROLLBACK");
    } catch {
      // ignore rollback failure
    }
    throw err;
  }
}

async function applyMigrations(db: SQLiteDatabase) {
  const current = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
  let currentVersion = current?.user_version ?? 0;

  for (const migration of MIGRATIONS) {
    if (migration.toVersion <= currentVersion) continue;
    await runStatementsInTransaction(db, [
      ...migration.statements,
      `PRAGMA user_version = ${migration.toVersion};`,
    ]);
    currentVersion = migration.toVersion;
  }

  if (currentVersion !== SCHEMA_VERSION) {
    await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION};`);
  }
}

async function createDatabase(): Promise<SQLiteDatabase> {
  const db = await openDatabaseAsync("safety-offline.db");
  await db.execAsync("PRAGMA journal_mode = WAL;");
  await db.execAsync("PRAGMA foreign_keys = ON;");
  await applyMigrations(db);
  return db;
}

export async function getDb(): Promise<SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = createDatabase();
  }
  return dbPromise;
}
