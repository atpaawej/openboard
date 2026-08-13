import type {
  Board,
  BoardId,
  BoardMetadata,
  BoardSummary,
  CreateBoardInput,
  UpdateBoardInput,
} from '@openboard/shared';
import { BoardNotFoundError, BoardValidationError } from '@openboard/shared';
import type { BoardRepository, ListBoardsOptions } from '@openboard/storage';
import { generateBoardId } from './id.js';
import { createDefaultBoardDocument } from './defaults.js';

/**
 * BoardService is the central domain service for OpenBoard.
 *
 * It is a deep module that acts as the single source of truth for all board
 * business logic across the Web UI, the MCP agent server, and the CLI.
 * It manages timestamps, default document structures, validation, and ID generation
 * without exposing these complexities to callers or knowing anything about SQLite.
 */
export class BoardService {
  private readonly repository: BoardRepository;

  constructor(repository: BoardRepository) {
    this.repository = repository;
  }

  /**
   * Lists board summaries with optional search and filtering.
   */
  async listBoards(options?: ListBoardsOptions): Promise<BoardSummary[]> {
    return this.repository.listBoards(options);
  }

  /**
   * Retrieves a full board by ID. Throws BoardNotFoundError if not found.
   */
  async getBoard(id: BoardId): Promise<Board> {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new BoardValidationError('A valid board ID is required.');
    }
    const board = await this.repository.getBoard(id.trim());
    if (!board) {
      throw new BoardNotFoundError(id);
    }
    return board;
  }

  /**
   * Retrieves only board metadata by ID.
   */
  async getBoardMetadata(id: BoardId): Promise<BoardMetadata> {
    const board = await this.getBoard(id);
    return board.metadata;
  }

  /**
   * Creates a new board with sane defaults.
   */
  async createBoard(input: CreateBoardInput = {}): Promise<Board> {
    const now = new Date().toISOString();
    const id = generateBoardId();
    const name = input.name?.trim() || 'Untitled Board';

    const metadata: BoardMetadata = {
      id,
      name,
      createdAt: now,
      updatedAt: now,
      favorite: input.favorite ?? false,
      thumbnail: null,
      description: input.description?.trim(),
    };

    const document = input.initialDocument ?? createDefaultBoardDocument();

    const board: Board = {
      metadata,
      document,
    };

    await this.repository.createBoard(board);
    return board;
  }

  /**
   * Updates an existing board's metadata, contents, or both.
   */
  async updateBoard(id: BoardId, input: UpdateBoardInput): Promise<Board> {
    const existing = await this.getBoard(id);
    const now = new Date().toISOString();

    const updatedMetadata: BoardMetadata = {
      ...existing.metadata,
      name: input.name !== undefined ? (input.name.trim() || existing.metadata.name) : existing.metadata.name,
      description: input.description !== undefined ? input.description.trim() : existing.metadata.description,
      favorite: input.favorite !== undefined ? input.favorite : existing.metadata.favorite,
      thumbnail: input.thumbnail !== undefined ? input.thumbnail : existing.metadata.thumbnail,
      updatedAt: now,
    };

    const updatedBoard: Board = {
      metadata: updatedMetadata,
      document: input.document ?? existing.document,
    };

    await this.repository.updateBoard(updatedBoard);
    return updatedBoard;
  }

  /**
   * Toggles the favorite status of a board.
   */
  async toggleFavorite(id: BoardId): Promise<Board> {
    const existing = await this.getBoard(id);
    return this.updateBoard(id, {
      favorite: !existing.metadata.favorite,
    });
  }

  /**
   * Deletes a board by ID.
   */
  async deleteBoard(id: BoardId): Promise<boolean> {
    if (!id || typeof id !== 'string') {
      throw new BoardValidationError('A valid board ID is required.');
    }
    return this.repository.deleteBoard(id.trim());
  }

  /**
   * Restores a deleted board by ID.
   */
  async restoreBoard(id: BoardId): Promise<boolean> {
    if (!id || typeof id !== 'string') {
      throw new BoardValidationError('A valid board ID is required.');
    }
    return this.repository.restoreBoard(id.trim());
  }

  /**
   * Duplicates an existing board with a new ID and updated timestamp.
   */
  async duplicateBoard(id: BoardId, newName?: string): Promise<Board> {
    const source = await this.getBoard(id);
    const now = new Date().toISOString();
    const newId = generateBoardId();

    const duplicatedBoard: Board = {
      metadata: {
        id: newId,
        name: newName?.trim() || `${source.metadata.name} (Copy)`,
        createdAt: now,
        updatedAt: now,
        favorite: false,
        thumbnail: source.metadata.thumbnail,
        description: source.metadata.description,
      },
      document: structuredClone(source.document),
    };

    await this.repository.createBoard(duplicatedBoard);
    return duplicatedBoard;
  }
}
