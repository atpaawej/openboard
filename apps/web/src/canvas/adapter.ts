import type { BoardDocument } from '@openboard/shared';
import { createTLStore, type TLStore, type TLStoreSnapshot } from 'tldraw';

export interface DocumentValidationResult {
  readonly isValid: boolean;
  readonly error?: string;
}

/**
 * TldrawDocumentAdapter is a deep module that encapsulates all conversions
 * between OpenBoard domain BoardDocument models and tldraw store records / snapshots.
 *
 * Responsibilities:
 * - Sanitizing and normalizing incoming document records (handling meta, types)
 * - Creating initialized TLStore instances with migrated snapshots
 * - Serializing store document records cleanly into BoardDocument
 * - Validating document structure to prevent database corruption
 */
export class TldrawDocumentAdapter {
  /**
   * Validates whether an arbitrary input is a structurally valid BoardDocument.
   */
  static validateDocument(doc: unknown): DocumentValidationResult {
    if (!doc || typeof doc !== 'object') {
      return { isValid: false, error: 'Document must be a non-null object' };
    }

    const candidate = doc as Record<string, unknown>;
    if (typeof candidate['schemaVersion'] !== 'number') {
      return { isValid: false, error: 'Document missing or invalid "schemaVersion"' };
    }

    if (
      !candidate['records'] ||
      typeof candidate['records'] !== 'object' ||
      Array.isArray(candidate['records'])
    ) {
      return { isValid: false, error: 'Document "records" must be a key-value object' };
    }

    return { isValid: true };
  }

  /**
   * Normalizes document records, ensuring all required schema fields (like meta)
   * exist before passing to tldraw's strict schema validator.
   */
  static normalizeRecords(records: Record<string, unknown>): Record<string, unknown> {
    const normalized: Record<string, unknown> = {};

    for (const [key, rawRecord] of Object.entries(records)) {
      if (rawRecord && typeof rawRecord === 'object') {
        const rec = { ...(rawRecord as Record<string, unknown>) };
        // Ensure meta object is present
        if (!rec['meta'] || typeof rec['meta'] !== 'object') {
          rec['meta'] = {};
        }
        if (rec['typeName'] === 'shape') {
          const type = rec['type'] || 'geo';
          const props = rec['props'];
          if (props && typeof props === 'object') {
            const cleanProps = { ...(props as Record<string, unknown>) };
            if (type === 'text') {
              delete cleanProps['h'];
              if (cleanProps['w'] !== undefined && cleanProps['w'] !== 8) {
                cleanProps['autoSize'] = false;
              }
            } else if (type === 'note' || type === 'arrow' || type === 'line' || type === 'draw') {
              delete cleanProps['w'];
              delete cleanProps['h'];
            }
            rec['props'] = cleanProps;
          }
        }
        normalized[key] = rec;
      }
    }

    // Ensure baseline document and page exist if empty
    if (!normalized['document:document']) {
      normalized['document:document'] = {
        typeName: 'document',
        id: 'document:document',
        gridSize: 10,
        name: '',
        meta: {},
      };
    }

    if (!normalized['page:page']) {
      normalized['page:page'] = {
        typeName: 'page',
        id: 'page:page',
        name: 'Page 1',
        index: 'a1',
        meta: {},
      };
    }

    return normalized;
  }

  /**
   * Creates an active, ready-to-use TLStore instance initialized with the given BoardDocument.
   */
  static createStoreFromDocument(doc: BoardDocument): TLStore {
    const validation = this.validateDocument(doc);
    if (!validation.isValid) {
      throw new Error(`Cannot create tldraw store: ${validation.error}`);
    }

    const store = createTLStore();
    const normalizedRecords = this.normalizeRecords(doc.records);

    store.loadStoreSnapshot({
      store: normalizedRecords as Record<string, any>,
      schema: store.schema.serialize(),
    });

    return store;
  }

  /**
   * Extracts a serialized BoardDocument from an active TLStore.
   * Only document-scoped records (shapes, pages, bindings, document settings) are captured.
   */
  static extractDocument(store: TLStore): BoardDocument {
    const snapshot: TLStoreSnapshot = store.getStoreSnapshot('document');

    return {
      schemaVersion: snapshot.schema.schemaVersion ?? 1,
      records: snapshot.store,
    };
  }

  /**
   * Converts a BoardDocument into a tldraw TLStoreSnapshot object.
   */
  static toStoreSnapshot(doc: BoardDocument): TLStoreSnapshot {
    const tempStore = this.createStoreFromDocument(doc);
    return tempStore.getStoreSnapshot('document');
  }
}
