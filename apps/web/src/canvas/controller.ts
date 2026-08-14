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
      { scope: 'document', source: 'user' }
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
      throw new Error('Cannot get document: BoardCanvasController has no active editor or is disposed.');
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
