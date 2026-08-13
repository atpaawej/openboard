import type { Board, BoardId, BoardSummary } from '@openboard/shared';
import { StorageOperationError } from '@openboard/shared';
import type { BoardRepository, ListBoardsOptions } from './interface.js';

/**
 * In-memory reference implementation of BoardRepository.
 * Deep module that isolates persistence semantics and clone behaviors.
 */
export class MemoryBoardRepository implements BoardRepository {
  private readonly boards = new Map<BoardId, Board>();
  private readonly deletedBoards = new Map<BoardId, Board>();

  constructor(initialBoards?: Board[]) {
    if (initialBoards) {
      for (const board of initialBoards) {
        this.boards.set(board.metadata.id, structuredClone(board));
      }
    }
  }

  async listBoards(options: ListBoardsOptions = {}): Promise<BoardSummary[]> {
    let sourceBoards: Board[];

    if (options.includeDeleted) {
      sourceBoards = [
        ...Array.from(this.boards.values()),
        ...Array.from(this.deletedBoards.values()),
      ];
    } else {
      sourceBoards = Array.from(this.boards.values());
    }

    let summaries: BoardSummary[] = sourceBoards.map((b) => ({
      id: b.metadata.id,
      name: b.metadata.name,
      createdAt: b.metadata.createdAt,
      updatedAt: b.metadata.updatedAt,
      favorite: b.metadata.favorite,
      thumbnail: b.metadata.thumbnail,
      description: b.metadata.description,
    }));

    if (options.favoritesOnly) {
      summaries = summaries.filter((b) => b.favorite);
    }

    if (options.searchQuery && options.searchQuery.trim().length > 0) {
      const q = options.searchQuery.toLowerCase().trim();
      summaries = summaries.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          (b.description && b.description.toLowerCase().includes(q)),
      );
    }

    const sortBy = options.sortBy ?? 'updatedAt';
    const direction = options.sortDirection ?? 'desc';
    const multiplier = direction === 'asc' ? 1 : -1;

    summaries.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name) * multiplier;
      }
      return (new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime()) * multiplier;
    });

    return structuredClone(summaries);
  }

  async getBoard(id: BoardId): Promise<Board | null> {
    const board = this.boards.get(id);
    if (!board) {
      return null;
    }
    return structuredClone(board);
  }

  async createBoard(board: Board): Promise<void> {
    if (this.boards.has(board.metadata.id) || this.deletedBoards.has(board.metadata.id)) {
      throw new StorageOperationError(`Board with ID "${board.metadata.id}" already exists.`);
    }
    this.boards.set(board.metadata.id, structuredClone(board));
  }

  async updateBoard(board: Board): Promise<void> {
    if (!this.boards.has(board.metadata.id)) {
      throw new StorageOperationError(`Board with ID "${board.metadata.id}" does not exist.`);
    }
    this.boards.set(board.metadata.id, structuredClone(board));
  }

  async deleteBoard(id: BoardId): Promise<boolean> {
    const board = this.boards.get(id);
    if (!board) {
      return false;
    }
    this.boards.delete(id);
    this.deletedBoards.set(id, board);
    return true;
  }

  async restoreBoard(id: BoardId): Promise<boolean> {
    const board = this.deletedBoards.get(id);
    if (!board) {
      return false;
    }
    this.deletedBoards.delete(id);
    this.boards.set(id, board);
    return true;
  }

  close(): void {
    this.boards.clear();
    this.deletedBoards.clear();
  }
}

/**
 * Backward compatibility alias for MemoryBoardRepository.
 */
export const MemoryBoardStorage = MemoryBoardRepository;
