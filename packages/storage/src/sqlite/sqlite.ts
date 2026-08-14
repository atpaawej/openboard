import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import Database from 'better-sqlite3';
import type { Board, BoardId, BoardMetadata, BoardSummary } from '@openboard/shared';
import { StorageOperationError } from '@openboard/shared';
import type { BoardRepository, ListBoardsOptions } from '../interface.js';
import { runMigrations } from './migrations.js';

export interface SQLiteBoardRepositoryOptions {
  /**
   * File path to the SQLite database.
   * Defaults to `~/.openboard/openboard.db`.
   * Pass `':memory:'` for an in-memory SQLite database.
   */
  dbPath?: string;
  /**
   * Optional pre-existing better-sqlite3 database instance.
   */
  db?: Database.Database;
}

interface BoardRow {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  favorite: number;
  thumbnail: string | null;
  document: string;
  deleted_at: string | null;
}

interface BoardSummaryRow {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  favorite: number;
  thumbnail: string | null;
}

/**
 * Resolves the default database path at `~/.openboard/openboard.db`.
 */
export function getDefaultOpenBoardDbPath(): string {
  return path.join(os.homedir(), '.openboard', 'openboard.db');
}

/**
 * SQLiteBoardRepository is a deep module that encapsulates all SQLite persistence.
 *
 * It manages:
 * - Automatic database directory creation (~/.openboard)
 * - Connection lifecycle & WAL pragmas
 * - Deterministic schema migrations
 * - Precompiled prepared statements
 * - Document JSON serialization / deserialization
 * - Safe transactions & soft delete lifecycle
 */
export class SQLiteBoardRepository implements BoardRepository {
  private readonly db: Database.Database;
  private readonly ownsDb: boolean;

  // Precompiled prepared statements
  private readonly stmtGet: Database.Statement<[string], BoardRow>;
  private readonly stmtGetAny: Database.Statement<[string], BoardRow>;
  private readonly stmtInsert: Database.Statement<
    [string, string, string | null, string, string, number, string | null, string]
  >;
  private readonly stmtUpdate: Database.Statement<
    [string, string | null, string, number, string | null, string, string]
  >;
  private readonly stmtSoftDelete: Database.Statement<[string, string]>;
  private readonly stmtRestore: Database.Statement<[string, string]>;
  private readonly stmtPermanentDelete: Database.Statement<[string]>;

  constructor(options: SQLiteBoardRepositoryOptions = {}) {
    if (options.db) {
      this.db = options.db;
      this.ownsDb = false;
    } else {
      const rawPath = options.dbPath ?? getDefaultOpenBoardDbPath();
      if (rawPath !== ':memory:') {
        const resolvedDir = path.dirname(rawPath);
        if (!fs.existsSync(resolvedDir)) {
          fs.mkdirSync(resolvedDir, { recursive: true });
        }
      }
      this.db = new Database(rawPath);
      this.ownsDb = true;
    }

    // Configure SQLite performance and safety pragmas
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.db.pragma('busy_timeout = 5000');

    // Run deterministic migrations
    runMigrations(this.db);

    // Initialize prepared statements
    this.stmtGet = this.db.prepare<[string], BoardRow>(
      'SELECT * FROM boards WHERE id = ? AND deleted_at IS NULL',
    );

    this.stmtGetAny = this.db.prepare<[string], BoardRow>('SELECT * FROM boards WHERE id = ?');

    this.stmtInsert = this.db.prepare(
      `INSERT INTO boards (id, name, description, created_at, updated_at, favorite, thumbnail, document, deleted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
    );

    this.stmtUpdate = this.db.prepare(
      `UPDATE boards
       SET name = ?, description = ?, updated_at = ?, favorite = ?, thumbnail = ?, document = ?
       WHERE id = ? AND deleted_at IS NULL`,
    );

    this.stmtSoftDelete = this.db.prepare(
      `UPDATE boards
       SET deleted_at = ?
       WHERE id = ? AND deleted_at IS NULL`,
    );

    this.stmtRestore = this.db.prepare(
      `UPDATE boards
       SET deleted_at = NULL, updated_at = ?
       WHERE id = ? AND deleted_at IS NOT NULL`,
    );

    this.stmtPermanentDelete = this.db.prepare('DELETE FROM boards WHERE id = ?');
  }

  async listBoards(options: ListBoardsOptions = {}): Promise<BoardSummary[]> {
    try {
      const conditions: string[] = [];
      const params: unknown[] = [];

      if (options.deletedOnly) {
        conditions.push('deleted_at IS NOT NULL');
      } else if (!options.includeDeleted) {
        conditions.push('deleted_at IS NULL');
      }

      if (options.favoritesOnly) {
        conditions.push('favorite = 1');
      }

      if (options.searchQuery && options.searchQuery.trim().length > 0) {
        const q = `%${options.searchQuery.trim().toLowerCase()}%`;
        conditions.push(
          '(LOWER(name) LIKE ? OR (description IS NOT NULL AND LOWER(description) LIKE ?))',
        );
        params.push(q, q);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const allowedSortColumns: Record<string, string> = {
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        name: 'name',
      };
      const sortColumn = allowedSortColumns[options.sortBy ?? 'updatedAt'] ?? 'updated_at';
      const sortDirection = options.sortDirection === 'asc' ? 'ASC' : 'DESC';

      const sql = `
        SELECT id, name, description, created_at, updated_at, favorite, thumbnail
        FROM boards
        ${whereClause}
        ORDER BY ${sortColumn} ${sortDirection}
      `;

      const stmt = this.db.prepare<unknown[], BoardSummaryRow>(sql);
      const rows = stmt.all(...params);

      return rows.map((row) => this.mapRowToSummary(row));
    } catch (err) {
      throw new StorageOperationError('Failed to list boards from SQLite storage.', err);
    }
  }

  async getBoard(id: BoardId): Promise<Board | null> {
    try {
      const row = this.stmtGet.get(id);
      if (!row) {
        return null;
      }
      return this.mapRowToBoard(row);
    } catch (err) {
      throw new StorageOperationError(`Failed to get board "${id}" from SQLite storage.`, err);
    }
  }

  async createBoard(board: Board): Promise<void> {
    try {
      // Check if board already exists (including deleted)
      const existing = this.stmtGetAny.get(board.metadata.id);
      if (existing) {
        throw new StorageOperationError(`Board with ID "${board.metadata.id}" already exists.`);
      }

      const description = board.metadata.description ?? null;
      const thumbnail = board.metadata.thumbnail ?? null;
      const favorite = board.metadata.favorite ? 1 : 0;
      const documentJson = JSON.stringify(board.document);

      this.stmtInsert.run(
        board.metadata.id,
        board.metadata.name,
        description,
        board.metadata.createdAt,
        board.metadata.updatedAt,
        favorite,
        thumbnail,
        documentJson,
      );
    } catch (err) {
      if (err instanceof StorageOperationError) {
        throw err;
      }
      throw new StorageOperationError(
        `Failed to create board "${board.metadata.id}" in SQLite storage.`,
        err,
      );
    }
  }

  async updateBoard(board: Board): Promise<void> {
    try {
      const description = board.metadata.description ?? null;
      const thumbnail = board.metadata.thumbnail ?? null;
      const favorite = board.metadata.favorite ? 1 : 0;
      const documentJson = JSON.stringify(board.document);

      const result = this.stmtUpdate.run(
        board.metadata.name,
        description,
        board.metadata.updatedAt,
        favorite,
        thumbnail,
        documentJson,
        board.metadata.id,
      );

      if (result.changes === 0) {
        throw new StorageOperationError(`Board with ID "${board.metadata.id}" does not exist.`);
      }
    } catch (err) {
      if (err instanceof StorageOperationError) {
        throw err;
      }
      throw new StorageOperationError(
        `Failed to update board "${board.metadata.id}" in SQLite storage.`,
        err,
      );
    }
  }

  async deleteBoard(id: BoardId): Promise<boolean> {
    try {
      const now = new Date().toISOString();
      const result = this.stmtSoftDelete.run(now, id);
      return result.changes > 0;
    } catch (err) {
      throw new StorageOperationError(`Failed to delete board "${id}" from SQLite storage.`, err);
    }
  }

  async restoreBoard(id: BoardId): Promise<boolean> {
    try {
      const now = new Date().toISOString();
      const result = this.stmtRestore.run(now, id);
      return result.changes > 0;
    } catch (err) {
      throw new StorageOperationError(`Failed to restore board "${id}" in SQLite storage.`, err);
    }
  }

  async permanentDeleteBoard(id: BoardId): Promise<boolean> {
    try {
      const result = this.stmtPermanentDelete.run(id);
      return result.changes > 0;
    } catch (err) {
      throw new StorageOperationError(
        `Failed to permanently delete board "${id}" from SQLite storage.`,
        err,
      );
    }
  }

  close(): void {
    if (this.ownsDb && this.db.open) {
      this.db.close();
    }
  }

  private mapRowToSummary(row: BoardSummaryRow): BoardSummary {
    return {
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      favorite: Boolean(row.favorite),
      thumbnail: row.thumbnail,
      description: row.description ?? undefined,
    };
  }

  private mapRowToBoard(row: BoardRow): Board {
    let document: Board['document'];
    try {
      document = JSON.parse(row.document);
    } catch (err) {
      throw new StorageOperationError(
        `Corrupt document JSON in database for board "${row.id}".`,
        err,
      );
    }

    const metadata: BoardMetadata = {
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      favorite: Boolean(row.favorite),
      thumbnail: row.thumbnail,
      description: row.description ?? undefined,
    };

    return {
      metadata,
      document,
    };
  }
}
