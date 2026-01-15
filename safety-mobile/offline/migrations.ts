import { type MigrationStep } from "./types";

export const MIGRATIONS: MigrationStep[] = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS metadata (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS observations (
        local_id TEXT PRIMARY KEY NOT NULL,
        server_id TEXT UNIQUE,
        location_id TEXT,
        project_id TEXT,
        department_id TEXT,
        category_id TEXT,
        subcategory_id TEXT,
        created_by_user_id TEXT,
        supervisor_id TEXT,
        worker_full_name TEXT,
        worker_profession TEXT,
        risk_level INTEGER,
        description TEXT,
        deadline TEXT,
        status TEXT,
        location_name TEXT,
        project_name TEXT,
        department_name TEXT,
        category_name TEXT,
        subcategory_name TEXT,
        company_id TEXT,
        company_name TEXT,
        supervisor_name TEXT,
        created_by_name TEXT,
        rejection_reason TEXT,
        answered_at TEXT,
        supervisor_answer TEXT,
        media_json TEXT,
        version INTEGER DEFAULT 0,
        updated_at TEXT,
        deleted_at TEXT,
        sync_status TEXT NOT NULL DEFAULT 'SYNCED',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS tasks (
        local_id TEXT PRIMARY KEY NOT NULL,
        server_id TEXT UNIQUE,
        project_id TEXT,
        department_id TEXT,
        category_id TEXT,
        created_by_user_id TEXT,
        supervisor_id TEXT,
        description TEXT,
        deadline TEXT,
        status TEXT,
        project_name TEXT,
        department_name TEXT,
        category_name TEXT,
        company_id TEXT,
        company_name TEXT,
        supervisor_answer TEXT,
        answered_at TEXT,
        rejection_reason TEXT,
        media_json TEXT,
        completion INTEGER,
        version INTEGER DEFAULT 0,
        updated_at TEXT,
        deleted_at TEXT,
        sync_status TEXT NOT NULL DEFAULT 'SYNCED',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS profiles (
        local_id TEXT PRIMARY KEY NOT NULL,
        server_id TEXT UNIQUE,
        full_name TEXT,
        phone_number TEXT,
        email TEXT,
        role TEXT,
        project_name TEXT,
        company_name TEXT,
        raw_json TEXT,
        version INTEGER DEFAULT 0,
        updated_at TEXT,
        deleted_at TEXT,
        sync_status TEXT NOT NULL DEFAULT 'SYNCED'
      );`,
      `CREATE TABLE IF NOT EXISTS attachments (
        local_id TEXT PRIMARY KEY NOT NULL,
        entity_type TEXT NOT NULL,
        entity_local_id TEXT NOT NULL,
        path TEXT,
        kind TEXT,
        is_corrective INTEGER DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'PENDING',
        mime_type TEXT,
        size_bytes INTEGER,
        payload TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY NOT NULL,
        entity_type TEXT NOT NULL,
        operation TEXT NOT NULL,
        payload TEXT NOT NULL,
        base_version INTEGER,
        status TEXT NOT NULL DEFAULT 'PENDING',
        retry_count INTEGER NOT NULL DEFAULT 0,
        last_error TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE INDEX IF NOT EXISTS idx_observations_server ON observations(server_id);`,
      `CREATE INDEX IF NOT EXISTS idx_observations_updated_at ON observations(updated_at);`,
      `CREATE INDEX IF NOT EXISTS idx_observations_deleted_at ON observations(deleted_at);`,
      `CREATE INDEX IF NOT EXISTS idx_tasks_server ON tasks(server_id);`,
      `CREATE INDEX IF NOT EXISTS idx_tasks_updated_at ON tasks(updated_at);`,
      `CREATE INDEX IF NOT EXISTS idx_tasks_deleted_at ON tasks(deleted_at);`,
      `CREATE INDEX IF NOT EXISTS idx_attachments_entity ON attachments(entity_type, entity_local_id);`,
      `CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);`
    ],
  },
  {
    toVersion: 2,
    statements: [
      `CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        updated_at TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS departments (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        updated_at TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS supervisors (
        id TEXT PRIMARY KEY NOT NULL,
        full_name TEXT NOT NULL,
        updated_at TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        type TEXT,
        updated_at TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS subcategories (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        category_id TEXT,
        type TEXT,
        updated_at TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS locations (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        project_id TEXT,
        updated_at TEXT
      );`,
      `CREATE INDEX IF NOT EXISTS idx_subcategories_category ON subcategories(category_id);`,
      `CREATE INDEX IF NOT EXISTS idx_locations_project ON locations(project_id);`
    ],
  },
];

export const SCHEMA_VERSION = MIGRATIONS[MIGRATIONS.length - 1]?.toVersion ?? 1;
