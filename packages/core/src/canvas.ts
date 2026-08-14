import {
  createTLStore,
  defaultShapeUtils,
  createShapeId,
  toRichText,
  type TLStore,
  type TLRecord,
  type TLShapeId,
} from 'tldraw';
import type {
  BoardDocument,
  BoardId,
  CanvasBounds,
  CanvasElementSummary,
  CanvasState,
  CreateShapeInput,
  CreateShapesResult,
  DeleteShapesResult,
  UpdateShapeInput,
  UpdateShapesResult,
} from '@openboard/shared';
import { CanvasOperationError, BoardValidationError } from '@openboard/shared';
import type { BoardService } from './service.js';
import type { BoardEventBus } from './events.js';

// Cache shape utilities by type for fast instantiation
const shapeUtilsByType = new Map<string, any>();
for (const util of defaultShapeUtils) {
  try {
    shapeUtilsByType.set(util.type, new (util as any)({}));
  } catch {
    // fallback if no-args constructor
    shapeUtilsByType.set(util.type, new (util as any)());
  }
}

/**
 * Extracts plain text string from tldraw's richText ProseMirror document structure.
 */
export function extractTextFromRichText(richText: unknown): string {
  if (!richText || typeof richText !== 'object') return '';
  const candidate = richText as { content?: unknown[] };
  if (!Array.isArray(candidate.content)) return '';

  const paragraphs: string[] = [];
  for (const block of candidate.content) {
    if (block && typeof block === 'object') {
      const b = block as { content?: unknown[] };
      if (Array.isArray(b.content)) {
        const textParts: string[] = [];
        for (const inline of b.content) {
          if (
            inline &&
            typeof inline === 'object' &&
            typeof (inline as { text?: unknown }).text === 'string'
          ) {
            textParts.push((inline as { text: string }).text);
          }
        }
        paragraphs.push(textParts.join(''));
      } else {
        paragraphs.push('');
      }
    }
  }
  return paragraphs.join('\n');
}

/**
 * Normalizes an arbitrary ID into a valid tldraw Shape ID (`shape:xxx`).
 */
export function normalizeShapeId(id?: string): TLShapeId {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return createShapeId();
  }
  const clean = id.trim();
  return (clean.startsWith('shape:') ? clean : `shape:${clean}`) as TLShapeId;
}

/**
 * Headless document adapter for manipulating whiteboard documents outside the browser.
 */
export class HeadlessCanvasEngine {
  /**
   * Initializes a headless TLStore populated with the given document records.
   */
  static createStore(document: BoardDocument): TLStore {
    const store = createTLStore();
    const records: Record<string, unknown> = { ...(document.records || {}) };

    // Ensure baseline document and page exist
    if (!records['document:document']) {
      records['document:document'] = {
        typeName: 'document',
        id: 'document:document',
        gridSize: 10,
        name: '',
        meta: {},
      };
    }

    if (!records['page:page']) {
      records['page:page'] = {
        typeName: 'page',
        id: 'page:page',
        name: 'Page 1',
        index: 'a1',
        meta: {},
      };
    }

    // Ensure all records have valid types, meta, and required tldraw fields
    for (const [key, rawRec] of Object.entries(records)) {
      if (rawRec && typeof rawRec === 'object') {
        const rec: Record<string, any> = { ...(rawRec as Record<string, any>) };
        if (!rec['meta'] || typeof rec['meta'] !== 'object') {
          rec['meta'] = {};
        }

        if (rec['typeName'] === 'shape') {
          if (typeof rec['rotation'] !== 'number') rec['rotation'] = 0;
          if (typeof rec['isLocked'] !== 'boolean') rec['isLocked'] = false;
          if (typeof rec['opacity'] !== 'number') rec['opacity'] = 1;
          if (!rec['parentId']) rec['parentId'] = 'page:page';
          if (!rec['index']) rec['index'] = 'a1';
          const type = rec['type'] || 'geo';
          const util = shapeUtilsByType.get(type);
          const defaultProps = util ? util.getDefaultProps() : {};
          const props = { ...defaultProps, ...(rec['props'] || {}) };
          if (props.text !== undefined && (type === 'geo' || type === 'text' || type === 'note')) {
            props.richText = toRichText(props.text);
            delete props.text;
          }
          if (type === 'note') {
            delete props.w;
            delete props.h;
          }
          rec['props'] = props;
        }

        if (rec['typeName'] === 'binding' && rec['type'] === 'arrow') {
          const props = { ...(rec['props'] || {}) };
          if (!props.snap) props.snap = 'center';
          if (props.isExact === undefined) props.isExact = false;
          if (props.isPrecise === undefined) props.isPrecise = false;
          if (!props.normalizedAnchor) props.normalizedAnchor = { x: 0.5, y: 0.5 };
          rec['props'] = props;
        }
        records[key] = rec;
      }
    }

    store.loadStoreSnapshot({
      store: records as Record<string, any>,
      schema: store.schema.serialize(),
    });

    return store;
  }

  /**
   * Serializes a headless TLStore back into an OpenBoard BoardDocument.
   */
  static extractDocument(store: TLStore): BoardDocument {
    const snapshot = store.getStoreSnapshot('document');
    return {
      schemaVersion: snapshot.schema.schemaVersion ?? 1,
      records: snapshot.store,
    };
  }

  /**
   * Extracts clean, semantic summaries of all shapes in the store.
   */
  static extractShapeSummaries(store: TLStore): CanvasElementSummary[] {
    const records = store.allRecords();
    const shapeRecords = records.filter((r) => r.typeName === 'shape') as Array<
      Record<string, any>
    >;
    const bindingRecords = records.filter((r) => r.typeName === 'binding') as Array<
      Record<string, any>
    >;

    const summaries: CanvasElementSummary[] = [];

    for (const shape of shapeRecords) {
      const type = shape.type || 'geo';
      const props = shape.props || {};

      let text: string | undefined;
      if (props.richText) {
        text = extractTextFromRichText(props.richText);
      } else if (typeof props.text === 'string') {
        text = props.text;
      } else if (typeof props.name === 'string') {
        text = props.name;
      }

      // Check for arrow / connector bindings
      let fromShapeId: string | undefined;
      let toShapeId: string | undefined;
      if (type === 'arrow') {
        const startBinding = bindingRecords.find(
          (b) => b.fromId === shape.id && b.props?.terminal === 'start',
        );
        const endBinding = bindingRecords.find(
          (b) => b.fromId === shape.id && b.props?.terminal === 'end',
        );
        if (startBinding?.toId) fromShapeId = String(startBinding.toId);
        if (endBinding?.toId) toShapeId = String(endBinding.toId);
      }

      const summary: CanvasElementSummary = {
        id: shape.id,
        type,
        x: shape.x,
        y: shape.y,
        rotation: shape.rotation,
        isLocked: shape.isLocked,
        opacity: shape.opacity,
        parentId: shape.parentId,
        text: text !== undefined && text.length > 0 ? text : undefined,
        color: props.color,
        fill: props.fill,
        geo: props.geo,
        w: props.w,
        h: props.h,
        start: props.start ? { x: props.start.x, y: props.start.y } : undefined,
        end: props.end ? { x: props.end.x, y: props.end.y } : undefined,
        name: type === 'frame' ? props.name : undefined,
        from: fromShapeId,
        to: toShapeId,
        meta: shape.meta && Object.keys(shape.meta).length > 0 ? shape.meta : undefined,
      };

      summaries.push(summary);
    }

    return summaries;
  }

  /**
   * Computes the bounding box covering all shapes on the canvas.
   */
  static computeBounds(shapes: CanvasElementSummary[]): CanvasBounds {
    if (shapes.length === 0) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const shape of shapes) {
      const x1 = shape.x;
      const y1 = shape.y;
      let x2 = x1 + (shape.w ?? 100);
      let y2 = y1 + (shape.h ?? 100);

      if (shape.end) {
        x2 = Math.max(x2, x1 + shape.end.x);
        y2 = Math.max(y2, y1 + shape.end.y);
      }

      if (x1 < minX) minX = x1;
      if (y1 < minY) minY = y1;
      if (x2 > maxX) maxX = x2;
      if (y2 > maxY) maxY = y2;
    }

    return {
      minX: Math.round(minX),
      minY: Math.round(minY),
      maxX: Math.round(maxX),
      maxY: Math.round(maxY),
      width: Math.round(maxX - minX),
      height: Math.round(maxY - minY),
    };
  }
}

/**
 * CanvasService is the deep domain module for all whiteboard canvas operations.
 *
 * Responsibilities:
 * - Operates headlessly on BoardDocuments using tldraw schemas and headless TLStore.
 * - Programmatic creation, update, and deletion of shapes with validation.
 * - Translating raw tldraw records into semantic CanvasState representations.
 * - Automatically formatting plain text into tldraw richText structures.
 * - Cascade cleanup of bindings when shapes are deleted.
 * - Dispatching real-time update notifications via BoardEventBus.
 * - Zero knowledge of SQLite or HTTP transport.
 */
export class CanvasService {
  private readonly boardService: BoardService;
  private readonly eventBus?: BoardEventBus;

  constructor(boardService: BoardService, eventBus?: BoardEventBus) {
    this.boardService = boardService;
    this.eventBus = eventBus;
  }

  /**
   * Reads and summarizes the canvas state for an AI agent.
   */
  async getCanvasState(boardId: BoardId): Promise<CanvasState> {
    const board = await this.boardService.getBoard(boardId);
    const store = HeadlessCanvasEngine.createStore(board.document);
    const shapes = HeadlessCanvasEngine.extractShapeSummaries(store);
    const bounds = HeadlessCanvasEngine.computeBounds(shapes);

    return {
      boardId: board.metadata.id,
      name: board.metadata.name,
      shapesCount: shapes.length,
      bounds,
      shapes,
    };
  }

  /**
   * Generates a visual screenshot representation of the whiteboard canvas.
   */
  async getCanvasScreenshot(
    boardId: BoardId,
    options?: import('@openboard/shared').CanvasScreenshotOptions,
  ): Promise<import('@openboard/shared').CanvasScreenshotResult> {
    const { HeadlessSvgRenderer } = await import('./renderer.js');
    const board = await this.boardService.getBoard(boardId);
    return HeadlessSvgRenderer.render(board.document, boardId, options);
  }

  /**
   * Creates one or more shapes on a board's canvas.
   */
  async createShapes(boardId: BoardId, inputs: CreateShapeInput[]): Promise<CreateShapesResult> {
    if (!Array.isArray(inputs) || inputs.length === 0) {
      throw new BoardValidationError('At least one shape must be provided for creation.');
    }

    const board = await this.boardService.getBoard(boardId);
    const store = HeadlessCanvasEngine.createStore(board.document);

    const createdRecords: Record<string, any>[] = [];
    const bindingRecords: Record<string, any>[] = [];

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i]!;
      if (
        typeof input.x !== 'number' ||
        isNaN(input.x) ||
        typeof input.y !== 'number' ||
        isNaN(input.y)
      ) {
        throw new CanvasOperationError(
          `Shape at index ${i} requires valid numeric "x" and "y" coordinates.`,
        );
      }

      const type = input.type || 'geo';
      const util = shapeUtilsByType.get(type);
      if (!util) {
        throw new CanvasOperationError(
          `Unsupported shape type "${type}". Supported types: geo, text, note, arrow, line, frame, draw, highlight.`,
        );
      }

      const defaultProps = util.getDefaultProps();
      const shapeId = normalizeShapeId(input.id);

      const props: Record<string, any> = {
        ...defaultProps,
        ...(input.props || {}),
      };

      if (input.w !== undefined) props.w = Number(input.w);
      if (input.h !== undefined) props.h = Number(input.h);
      if (input.geo !== undefined) props.geo = String(input.geo);
      if (input.color !== undefined) props.color = String(input.color);
      if (input.fill !== undefined) props.fill = String(input.fill);

      if (input.text !== undefined) {
        if (type === 'geo' || type === 'text' || type === 'note') {
          props.richText = toRichText(input.text);
        } else if (type === 'arrow') {
          props.text = input.text;
        } else if (type === 'frame') {
          props.name = input.text;
        }
      }

      if (input.name !== undefined && type === 'frame') {
        props.name = input.name;
      }

      if (input.start && type === 'arrow') {
        props.start = { x: input.start.x, y: input.start.y };
      }
      if (input.end && type === 'arrow') {
        props.end = { x: input.end.x, y: input.end.y };
      }

      // Handle arrow bindings if "from" or "to" are specified
      if (type === 'arrow') {
        if (input.from) {
          const fromShapeId = normalizeShapeId(input.from);
          bindingRecords.push({
            id: `binding:${shapeId}_start`,
            typeName: 'binding',
            type: 'arrow',
            fromId: shapeId,
            toId: fromShapeId,
            props: {
              terminal: 'start',
              isExact: false,
              normalizedAnchor: { x: 0.5, y: 0.5 },
              isPrecise: false,
              snap: 'center',
            },
            meta: {},
          });
        }
        if (input.to) {
          const toShapeId = normalizeShapeId(input.to);
          bindingRecords.push({
            id: `binding:${shapeId}_end`,
            typeName: 'binding',
            type: 'arrow',
            fromId: shapeId,
            toId: toShapeId,
            props: {
              terminal: 'end',
              isExact: false,
              normalizedAnchor: { x: 0.5, y: 0.5 },
              isPrecise: false,
              snap: 'center',
            },
            meta: {},
          });
        }
      }

      const shapeRecord = {
        id: shapeId,
        typeName: 'shape',
        type,
        x: input.x,
        y: input.y,
        rotation: input.rotation ?? 0,
        isLocked: false,
        opacity: 1,
        parentId: input.parentId || 'page:page',
        index: `a${i + 1}`,
        props,
        meta: input.meta || {},
      };

      createdRecords.push(shapeRecord);
    }

    // Apply creations to headless store
    store.put([...createdRecords, ...bindingRecords] as TLRecord[]);

    // Extract serialized document and persist to SQLite
    const updatedDocument = HeadlessCanvasEngine.extractDocument(store);
    await this.boardService.updateBoard(boardId, { document: updatedDocument });

    // Emit live update event
    this.eventBus?.emit('canvas:updated', {
      boardId,
      document: updatedDocument,
      reason: `Created ${inputs.length} shapes`,
    });

    const createdSummaries = HeadlessCanvasEngine.extractShapeSummaries(store).filter((s) =>
      createdRecords.some((r) => r.id === s.id),
    );

    return {
      boardId,
      createdCount: createdRecords.length,
      shapes: createdSummaries,
    };
  }

  /**
   * Updates properties of existing shapes on a board.
   */
  async updateShapes(boardId: BoardId, updates: UpdateShapeInput[]): Promise<UpdateShapesResult> {
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new BoardValidationError('At least one shape update must be provided.');
    }

    const board = await this.boardService.getBoard(boardId);
    const store = HeadlessCanvasEngine.createStore(board.document);

    const updatedRecords: Record<string, any>[] = [];
    const bindingUpdates: Record<string, any>[] = [];

    for (const update of updates) {
      const shapeId = normalizeShapeId(update.id);
      const existing = store.get(shapeId) as Record<string, any> | undefined;

      if (!existing || existing.typeName !== 'shape') {
        throw new CanvasOperationError(
          `Shape with ID "${update.id}" was not found on board "${boardId}". Call get_canvas_state to inspect available shape IDs.`,
        );
      }

      const type = existing.type || 'geo';
      const updatedProps = { ...existing.props, ...(update.props || {}) };

      if (update.w !== undefined) updatedProps.w = Number(update.w);
      if (update.h !== undefined) updatedProps.h = Number(update.h);
      if (update.geo !== undefined) updatedProps.geo = String(update.geo);
      if (update.color !== undefined) updatedProps.color = String(update.color);
      if (update.fill !== undefined) updatedProps.fill = String(update.fill);

      if (update.text !== undefined) {
        if (type === 'geo' || type === 'text' || type === 'note') {
          updatedProps.richText = toRichText(update.text);
        } else if (type === 'arrow') {
          updatedProps.text = update.text;
        } else if (type === 'frame') {
          updatedProps.name = update.text;
        }
      }

      if (update.start && type === 'arrow') {
        updatedProps.start = { x: update.start.x, y: update.start.y };
      }
      if (update.end && type === 'arrow') {
        updatedProps.end = { x: update.end.x, y: inputEndClamp(update.end) };
      }

      // Handle arrow bindings update
      if (type === 'arrow') {
        if (update.from !== undefined) {
          const fromShapeId = normalizeShapeId(update.from);
          bindingUpdates.push({
            id: `binding:${shapeId}_start`,
            typeName: 'binding',
            type: 'arrow',
            fromId: shapeId,
            toId: fromShapeId,
            props: {
              terminal: 'start',
              isExact: false,
              normalizedAnchor: { x: 0.5, y: 0.5 },
              isPrecise: false,
              snap: 'center',
            },
            meta: {},
          });
        }
        if (update.to !== undefined) {
          const toShapeId = normalizeShapeId(update.to);
          bindingUpdates.push({
            id: `binding:${shapeId}_end`,
            typeName: 'binding',
            type: 'arrow',
            fromId: shapeId,
            toId: toShapeId,
            props: {
              terminal: 'end',
              isExact: false,
              normalizedAnchor: { x: 0.5, y: 0.5 },
              isPrecise: false,
              snap: 'center',
            },
            meta: {},
          });
        }
      }

      const updatedShape = {
        ...existing,
        x: update.x !== undefined ? Number(update.x) : existing.x,
        y: update.y !== undefined ? Number(update.y) : existing.y,
        rotation: update.rotation !== undefined ? Number(update.rotation) : existing.rotation,
        isLocked: update.isLocked !== undefined ? Boolean(update.isLocked) : existing.isLocked,
        opacity: update.opacity !== undefined ? Number(update.opacity) : existing.opacity,
        props: updatedProps,
        meta: update.meta ? { ...existing.meta, ...update.meta } : existing.meta,
      };

      updatedRecords.push(updatedShape);
    }

    store.put([...updatedRecords, ...bindingUpdates] as TLRecord[]);

    const updatedDocument = HeadlessCanvasEngine.extractDocument(store);
    await this.boardService.updateBoard(boardId, { document: updatedDocument });

    this.eventBus?.emit('canvas:updated', {
      boardId,
      document: updatedDocument,
      reason: `Updated ${updates.length} shapes`,
    });

    const updatedSummaries = HeadlessCanvasEngine.extractShapeSummaries(store).filter((s) =>
      updatedRecords.some((r) => r.id === s.id),
    );

    return {
      boardId,
      updatedCount: updatedRecords.length,
      shapes: updatedSummaries,
    };
  }

  /**
   * Deletes shapes from a board and cascades to clean up orphan arrow/line bindings.
   */
  async deleteShapes(boardId: BoardId, shapeIds: string[]): Promise<DeleteShapesResult> {
    if (!Array.isArray(shapeIds) || shapeIds.length === 0) {
      throw new BoardValidationError('At least one shape ID must be provided for deletion.');
    }

    const board = await this.boardService.getBoard(boardId);
    const store = HeadlessCanvasEngine.createStore(board.document);

    const targetIds = shapeIds.map((id) => normalizeShapeId(id));
    const toDelete: TLShapeId[] = [];

    for (const id of targetIds) {
      if (store.get(id)) {
        toDelete.push(id);
      }
    }

    if (toDelete.length === 0) {
      return {
        boardId,
        deletedCount: 0,
        deletedShapeIds: [],
      };
    }

    // Also remove any binding records referencing these shapes to preserve consistency
    const allRecords = store.allRecords();
    const bindingRecordsToDelete = allRecords
      .filter((r) => r.typeName === 'binding')
      .filter((b: any) => toDelete.includes(b.fromId) || toDelete.includes(b.toId))
      .map((b) => b.id);

    store.remove([...toDelete, ...bindingRecordsToDelete]);

    const updatedDocument = HeadlessCanvasEngine.extractDocument(store);
    await this.boardService.updateBoard(boardId, { document: updatedDocument });

    this.eventBus?.emit('canvas:updated', {
      boardId,
      document: updatedDocument,
      reason: `Deleted ${toDelete.length} shapes`,
    });

    return {
      boardId,
      deletedCount: toDelete.length,
      deletedShapeIds: toDelete.map(String),
    };
  }
}

function inputEndClamp(end: { x: number; y: number }): { x: number; y: number } {
  return { x: Number(end.x) || 0, y: Number(end.y) || 0 };
}
