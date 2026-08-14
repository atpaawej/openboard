import type { Board, BoardId, BoardSummary } from '@openboard/shared';

/**
 * Filter and sort options when querying boards.
 */
export interface ListBoardsOptions {
  favoritesOnly?: boolean;
  searchQuery?: string;
  sortBy?: 'updatedAt' | 'createdAt' | 'name';
  sortDirection?: 'asc' | 'desc';
  includeDeleted?: boolean;
  deletedOnly?: boolean;
}

/**
 * Deep module repository interface for board persistence.
 *
 * Conceals how boards are physically stored (SQLite database, in-memory, etc.)
 * behind a clean, semantic contract.
 */
export interface BoardRepository {
  /**
   * Retrieves a list of lightweight board summaries with optional filtering and sorting.
   */
  listBoards(options?: ListBoardsOptions): Promise<BoardSummary[]>;

  /**
   * Retrieves a full board (metadata + canvas document) by ID.
   * Returns null if not found.
   */
  getBoard(id: BoardId): Promise<Board | null>;

  /**
   * Persists a new board.
   * Throws StorageOperationError if a board with the ID already exists.
   */
  createBoard(board: Board): Promise<void>;

  /**
   * Updates an existing board's metadata, document, or both.
   * Throws StorageOperationError if the board does not exist.
   */
  updateBoard(board: Board): Promise<void>;

  /**
   * Soft deletes a board by ID.
   * Returns true if deleted, false if not found.
   */
  deleteBoard(id: BoardId): Promise<boolean>;

  /**
   * Restores a deleted board by ID.
   * Returns true if restored, false if not found in deleted state.
   */
  restoreBoard(id: BoardId): Promise<boolean>;

  /**
   * Permanently deletes a board from storage.
   * Returns true if deleted, false if not found.
   */
  permanentDeleteBoard(id: BoardId): Promise<boolean>;

  /**
   * Gracefully closes database connection and releases resources.
   */
  close?(): Promise<void> | void;
}

/**
 * Backward compatibility alias for BoardRepository.
 */
export type BoardStorage = BoardRepository;
