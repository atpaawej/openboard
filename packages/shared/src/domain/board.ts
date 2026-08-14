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
  updatedAt: string; // ISO 8601 string
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

/**
 * 2D Coordinate Point.
 */
export interface CanvasPoint {
  x: number;
  y: number;
}

/**
 * Bounding Box dimensions for canvas queries.
 */
export interface CanvasBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

/**
 * Semantic summary of an individual shape on the canvas,
 * formatted cleanly for external AI agents without internal tldraw noise.
 */
export interface CanvasElementSummary {
  readonly id: string;
  readonly type: string;
  readonly x: number;
  readonly y: number;
  readonly rotation?: number;
  readonly isLocked?: boolean;
  readonly opacity?: number;
  readonly parentId?: string;
  readonly text?: string;
  readonly color?: string;
  readonly fill?: string;
  readonly geo?: string;
  readonly w?: number;
  readonly h?: number;
  readonly start?: CanvasPoint;
  readonly end?: CanvasPoint;
  readonly points?: CanvasPoint[];
  readonly name?: string;
  /**
   * For arrows or lines: ID of the source shape this element connects from.
   */
  readonly from?: string;
  /**
   * For arrows or lines: ID of the target shape this element connects to.
   */
  readonly to?: string;
  readonly meta?: Record<string, unknown>;
}

/**
 * Clean semantic representation of a canvas scene for AI agents.
 */
export interface CanvasState {
  readonly boardId: BoardId;
  readonly name: string;
  readonly shapesCount: number;
  readonly bounds: CanvasBounds;
  readonly shapes: CanvasElementSummary[];
}

/**
 * High-level shape input for agent shape creation.
 */
export interface CreateShapeInput {
  id?: string;
  type?: string; // 'geo' | 'text' | 'note' | 'arrow' | 'line' | 'frame'
  x: number;
  y: number;
  w?: number;
  h?: number;
  geo?: string; // 'rectangle' | 'ellipse' | 'triangle' | 'diamond' | etc.
  text?: string;
  color?: string; // 'black' | 'blue' | 'green' | 'red' | 'yellow' | 'violet' | 'orange' | 'grey'
  fill?: string; // 'none' | 'semi' | 'solid' | 'pattern'
  rotation?: number;
  parentId?: string;
  /**
   * For unbound arrows: start handle offset in pixels relative to shape (x, y). Defaults to { x: 0, y: 0 }.
   */
  start?: CanvasPoint;
  /**
   * For unbound arrows: end handle offset in pixels relative to shape (x, y). Defaults to { x: 120, y: 0 }.
   */
  end?: CanvasPoint;
  points?: CanvasPoint[];
  name?: string;
  /**
   * For arrows: target shape ID or name to bind start of arrow to.
   */
  from?: string;
  /**
   * For arrows: target shape ID or name to bind end of arrow to.
   */
  to?: string;
  meta?: Record<string, unknown>;
  props?: Record<string, unknown>;
}

/**
 * High-level shape update input for agent shape modifications.
 */
export interface UpdateShapeInput {
  id: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  text?: string;
  color?: string;
  fill?: string;
  geo?: string;
  rotation?: number;
  isLocked?: boolean;
  opacity?: number;
  /**
   * For unbound arrows: updated start handle offset in pixels relative to shape (x, y).
   */
  start?: CanvasPoint;
  /**
   * For unbound arrows: updated end handle offset in pixels relative to shape (x, y).
   */
  end?: CanvasPoint;
  /**
   * For arrows: update shape ID to bind start of arrow to.
   */
  from?: string;
  /**
   * For arrows: update shape ID to bind end of arrow to.
   */
  to?: string;
  meta?: Record<string, unknown>;
  props?: Record<string, unknown>;
}

/**
 * Result of creating shapes on a board.
 */
export interface CreateShapesResult {
  readonly boardId: BoardId;
  readonly createdCount: number;
  readonly shapes: CanvasElementSummary[];
}

/**
 * Result of updating shapes on a board.
 */
export interface UpdateShapesResult {
  readonly boardId: BoardId;
  readonly updatedCount: number;
  readonly shapes: CanvasElementSummary[];
}

/**
 * Result of deleting shapes from a board.
 */
export interface DeleteShapesResult {
  readonly boardId: BoardId;
  readonly deletedCount: number;
  readonly deletedShapeIds: string[];
}

/**
 * Options for generating a headless canvas screenshot.
 */
export interface CanvasScreenshotOptions {
  format?: 'svg' | 'png' | 'data-url';
  theme?: 'light' | 'dark';
  padding?: number;
  background?: boolean;
  scale?: number;
  viewport?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * Visual screenshot representation of a canvas board.
 */
export interface CanvasScreenshotResult {
  readonly boardId: BoardId;
  readonly format: string;
  readonly width: number;
  readonly height: number;
  readonly svg: string;
  readonly data: string; // Base64-encoded SVG or image data
  readonly mimeType: string; // 'image/svg+xml' or 'image/png'
  readonly shapesCount: number;
}
