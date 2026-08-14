import type { BoardDocument } from '@openboard/shared';

/**
 * Generates an empty, valid board document schema.
 * Compatible with tldraw store records.
 */
export function createDefaultBoardDocument(): BoardDocument {
  return {
    schemaVersion: 1,
    records: {
      'document:document': {
        typeName: 'document',
        id: 'document:document',
        gridSize: 10,
        name: '',
        meta: {},
      },
      'page:page': {
        typeName: 'page',
        id: 'page:page',
        name: 'Page 1',
        index: 'a1',
        meta: {},
      },
    },
  };
}
