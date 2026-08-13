import type Database from 'better-sqlite3';

export interface Migration {
  version: number;
  name: string;
  up(db: Database.Database): void;
}

/**
 * Migration 1: Initial schema for OpenBoard boards and indexes.
 */
const migration001: Migration = {
  version: 1,
  name: '001_initial_schema',
  up(db: Database.Database): void {
    db.exec(`
      CREATE TABLE IF NOT EXISTS boards (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        favorite INTEGER NOT NULL DEFAULT 0,
        thumbnail TEXT,
        document TEXT NOT NULL,
        deleted_at TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_boards_updated_at ON boards (updated_at DESC);
      CREATE INDEX IF NOT EXISTS idx_boards_favorite ON boards (favorite);
      CREATE INDEX IF NOT EXISTS idx_boards_deleted_at ON boards (deleted_at);
      CREATE INDEX IF NOT EXISTS idx_boards_name ON boards (name);
    `);
  },
};

export const MIGRATIONS: Migration[] = [migration001];

interface MigrationRow {
  max_version: number | null;
}

/**
 * Runs pending schema migrations deterministically in version order.
 */
export function runMigrations(db: Database.Database, migrations: Migration[] = MIGRATIONS): void {
  // Ensure the migrations table exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);

  const row = db
    .prepare<[], MigrationRow>('SELECT MAX(version) AS max_version FROM schema_migrations')
    .get();
  const currentVersion = row?.max_version ?? 0;

  const pendingMigrations = migrations
    .filter((m) => m.version > currentVersion)
    .sort((a, b) => a.version - b.version);

  if (pendingMigrations.length === 0) {
    return;
  }

  const stmtRecordMigration = db.prepare<[number, string, string]>(
    'INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)',
  );

  const applyMigrationsTx = db.transaction(() => {
    for (const migration of pendingMigrations) {
      migration.up(db);
      stmtRecordMigration.run(migration.version, migration.name, new Date().toISOString());
    }
  });

  applyMigrationsTx();
}
