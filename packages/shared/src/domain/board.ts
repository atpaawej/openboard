/**
 * Unique identifier for an OpenBoard board.
 */
export type BoardId = string;

/**
 * Metadata associated with a board, keeping lightweight indexing
 * completely separate from the heavy canvas scene/document.
 */
export interface BoardMetadata {
  readonly id: BoardId;
  name: string;
  readonly createdAt: string; // ISO 8601 string
  updatedAt: string;         // ISO 8601 string
  favorite: boolean;
  thumbnail?: string | null;
  description?: string;
}

/**
 * Encapsulated canvas document state.
 * Structured to hold tldraw snapshot records without coupling
 * the shared layer directly to tldraw internals.
 */
export interface BoardDocument {
  readonly schemaVersion: number;
  readonly records: Record<string, unknown>;
}

/**
 * Complete board representation combining metadata and canvas document.
 */
export interface Board {
  readonly metadata: BoardMetadata;
  readonly document: BoardDocument;
}

/**
 * Lightweight board summary for dashboard listings.
 */
export interface BoardSummary {
  readonly id: BoardId;
  readonly name: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly favorite: boolean;
  readonly thumbnail?: string | null;
  readonly description?: string;
}

/**
 * Input for creating a new board.
 */
export interface CreateBoardInput {
  name?: string;
  description?: string;
  favorite?: boolean;
  initialDocument?: BoardDocument;
}

/**
 * Input for updating an existing board's metadata or document.
 */
export interface UpdateBoardInput {
  name?: string;
  description?: string;
  favorite?: boolean;
  thumbnail?: string | null;
  document?: BoardDocument;
}
