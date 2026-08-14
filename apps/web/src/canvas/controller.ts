import type { Editor, TLShape, Box } from 'tldraw';
import type { BoardDocument } from '@openboard/shared';
import { TldrawDocumentAdapter } from './adapter.js';

export type CanvasChangeCallback = () => void;

/**
 * BoardCanvasController encapsulates live operations on an active tldraw Editor instance.
 *
 * Responsibilities:
 * - Decouples canvas document extraction and query operations from React components.
 * - Subscribes strictly to user-generated document changes ({ scope: 'document', source: 'user' }),
 *   filtering out ephemeral session state (camera pans, zooms, selection, cursor tracking).
 * - Serves as the future bridge host for external AI agents (MCP live canvas control).
 */
export class BoardCanvasController {
  private editor: Editor | null = null;
  private disposed = false;
  private readonly listeners = new Set<CanvasChangeCallback>();
  private storeUnlisten: (() => void) | null = null;

  constructor(editor: Editor) {
    this.attachEditor(editor);
  }

  /**
   * Attaches an active tldraw Editor instance and sets up store listeners.
   */
  private attachEditor(editor: Editor): void {
    this.editor = editor;
    this.disposed = false;

    // Listen only to user-initiated document-scoped mutations
    this.storeUnlisten = editor.store.listen(
      () => {
        if (this.disposed) return;
        for (const listener of this.listeners) {
          try {
            listener();
          } catch (err) {
            console.error('[BoardCanvasController] Error in change listener:', err);
          }
        }
      },
      { scope: 'document', source: 'user' },
    );
  }

  /**
   * Gets the current live Editor instance, or null if disposed.
   */
  getEditor(): Editor | null {
    return this.disposed ? null : this.editor;
  }

  /**
   * Serializes the current active canvas state into an OpenBoard BoardDocument.
   */
  getDocument(): BoardDocument {
    if (!this.editor || this.disposed) {
      throw new Error(
        'Cannot get document: BoardCanvasController has no active editor or is disposed.',
      );
    }
    return TldrawDocumentAdapter.extractDocument(this.editor.store);
  }

  /**
   * Subscribes to user-generated document changes.
   * Returns an unsubscribe function.
   */
  subscribeToDocumentChanges(callback: CanvasChangeCallback): () => void {
    if (this.disposed) {
      return () => {};
    }
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Returns all shapes on the currently active page.
   */
  getPageShapes(): TLShape[] {
    if (!this.editor || this.disposed) return [];
    return this.editor.getCurrentPageShapes();
  }

  /**
   * Returns all currently selected shapes.
   */
  getSelectedShapes(): TLShape[] {
    if (!this.editor || this.disposed) return [];
    return this.editor.getSelectedShapes();
  }

  /**
   * Returns the viewport page bounds (visible coordinate area).
   */
  getViewportBounds(): Box | null {
    if (!this.editor || this.disposed) return null;
    return this.editor.getViewportPageBounds();
  }

  /**
   * Generates a lightweight SVG data URL thumbnail of the current board canvas.
   * Returns null if the board has no shapes or if rendering fails.
   */
  async generateThumbnailSvg(): Promise<string | null> {
    if (!this.editor || this.disposed) return null;
    try {
      const shapeIds = Array.from(this.editor.getCurrentPageShapeIds());
      if (shapeIds.length === 0) {
        return null;
      }
      const result = await this.editor.getSvgString(shapeIds, {
        scale: 0.5,
        background: true,
        padding: 16,
      });
      if (result && result.svg) {
        return `data:image/svg+xml;utf8,${encodeURIComponent(result.svg)}`;
      }
    } catch (err) {
      console.warn('[BoardCanvasController] Failed to generate SVG thumbnail:', err);
    }
    return null;
  }

  /**
   * Merges an updated remote BoardDocument into the active tldraw store.
   * Uses store.mergeRemoteChanges to preserve camera/session state and
   * avoid triggering local autosave cycles.
   */
  mergeRemoteDocument(doc: BoardDocument): void {
    if (!this.editor || this.disposed) return;

    const normalizedRecords = TldrawDocumentAdapter.normalizeRecords(doc.records);
    const store = this.editor.store;

    store.mergeRemoteChanges(() => {
      // Identify records present in store but absent in new document (e.g. deleted shapes/bindings)
      const currentDocSnapshot = store.getStoreSnapshot('document').store;
      const idsToRemove: any[] = [];
      for (const id of Object.keys(currentDocSnapshot)) {
        if (!normalizedRecords[id] && (id.startsWith('shape:') || id.startsWith('binding:'))) {
          idsToRemove.push(id);
        }
      }

      if (idsToRemove.length > 0) {
        store.remove(idsToRemove);
      }

      // Put updated or created records
      const recordsToPut = Object.values(normalizedRecords) as any[];
      if (recordsToPut.length > 0) {
        store.put(recordsToPut);
      }
    });
  }

  /**
   * Whether the controller is disposed.
   */
  isDisposed(): boolean {
    return this.disposed;
  }

  /**
   * Disposes the controller and cleans up store listeners.
   */
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    if (this.storeUnlisten) {
      this.storeUnlisten();
      this.storeUnlisten = null;
    }
    this.listeners.clear();
    this.editor = null;
  }
}
