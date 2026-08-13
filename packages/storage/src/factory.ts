import type { BoardRepository } from './interface.js';
import { MemoryBoardRepository } from './memory.js';
import { SQLiteBoardRepository, type SQLiteBoardRepositoryOptions } from './sqlite/sqlite.js';

export interface RepositoryConfig {
  type?: 'sqlite' | 'memory';
  sqliteOptions?: SQLiteBoardRepositoryOptions;
  dbPath?: string;
}

export type StorageConfig = RepositoryConfig;

/**
 * Factory creating BoardRepository implementations.
 * Keeps consumers decoupled from the exact storage mechanism.
 * Defaults to production SQLite repository.
 */
export function createBoardRepository(config: RepositoryConfig = {}): BoardRepository {
  const type = config.type ?? 'sqlite';
  switch (type) {
    case 'memory':
      return new MemoryBoardRepository();
    case 'sqlite':
      return new SQLiteBoardRepository({
        dbPath: config.dbPath ?? config.sqliteOptions?.dbPath,
        db: config.sqliteOptions?.db,
      });
    default:
      return new SQLiteBoardRepository();
  }
}

/**
 * Backward compatibility alias for createBoardRepository.
 */
export const createBoardStorage = createBoardRepository;
