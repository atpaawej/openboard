import test from 'node:test';
import assert from 'node:assert/strict';
import { TldrawDocumentAdapter } from '../adapter.js';
import type { BoardDocument } from '@openboard/shared';

test('TldrawDocumentAdapter - validates document structure correctly', () => {
  // Valid document
  const validDoc: BoardDocument = {
    schemaVersion: 1,
    records: {
      'document:document': { typeName: 'document', id: 'document:document', name: '', meta: {} },
      'page:page': { typeName: 'page', id: 'page:page', name: 'Page 1', index: 'a1', meta: {} },
    },
  };
  const validResult = TldrawDocumentAdapter.validateDocument(validDoc);
  assert.equal(validResult.isValid, true);

  // Null or non-object
  assert.equal(TldrawDocumentAdapter.validateDocument(null).isValid, false);
  assert.equal(TldrawDocumentAdapter.validateDocument('string').isValid, false);

  // Missing schemaVersion
  assert.equal(TldrawDocumentAdapter.validateDocument({ records: {} }).isValid, false);

  // Missing records or invalid records
  assert.equal(TldrawDocumentAdapter.validateDocument({ schemaVersion: 1 }).isValid, false);
  assert.equal(TldrawDocumentAdapter.validateDocument({ schemaVersion: 1, records: [] }).isValid, false);
});

test('TldrawDocumentAdapter - normalizes records with missing meta or baseline records', () => {
  const rawRecords = {
    'document:document': {
      typeName: 'document',
      id: 'document:document',
      gridSize: 10,
      name: '',
      // meta missing
    },
    'page:page': {
      typeName: 'page',
      id: 'page:page',
      name: 'Page 1',
      index: 'a1',
      // meta missing
    },
  };

  const normalized = TldrawDocumentAdapter.normalizeRecords(rawRecords);
  assert.ok(normalized['document:document']);
  assert.deepEqual((normalized['document:document'] as any).meta, {});
  assert.ok(normalized['page:page']);
  assert.deepEqual((normalized['page:page'] as any).meta, {});
});

test('TldrawDocumentAdapter - creates store and roundtrips document serialization', () => {
  const initialDoc: BoardDocument = {
    schemaVersion: 1,
    records: {
      'document:document': {
        typeName: 'document',
        id: 'document:document',
        gridSize: 10,
        name: 'Architecture Board',
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

  const store = TldrawDocumentAdapter.createStoreFromDocument(initialDoc);
  assert.ok(store);
  assert.equal(store.has('document:document' as any), true);
  assert.equal(store.has('page:page' as any), true);

  // Add a shape record directly into the store
  const shapeId = 'shape:box_1' as any;
  store.put([
    {
      id: shapeId,
      typeName: 'shape',
      type: 'geo',
      parentId: 'page:page' as any,
      index: 'a1' as any,
      x: 150,
      y: 200,
      rotation: 0,
      props: {
        w: 240,
        h: 120,
        geo: 'rectangle',
        color: 'black',
        labelColor: 'black',
        fill: 'none',
        dash: 'draw',
        size: 'm',
        font: 'draw',
        align: 'middle',
        verticalAlign: 'middle',
        growY: 0,
        url: '',
        scale: 1,
        richText: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Architecture Core' }] }] },
      },
      meta: {},
      isLocked: false,
      opacity: 1,
    },
  ]);

  assert.equal(store.has(shapeId), true);

  // Extract serialized document
  const extracted = TldrawDocumentAdapter.extractDocument(store);
  assert.equal(extracted.schemaVersion >= 1, true);
  assert.ok(extracted.records[shapeId]);
  assert.equal((extracted.records[shapeId] as any).props.richText.content[0].content[0].text, 'Architecture Core');

  // Re-hydrate into a second fresh store
  const store2 = TldrawDocumentAdapter.createStoreFromDocument(extracted);
  assert.equal(store2.has(shapeId), true);
  const reloadedShape = store2.get(shapeId) as any;
  assert.equal(reloadedShape.props.richText.content[0].content[0].text, 'Architecture Core');
  assert.equal(reloadedShape.x, 150);
  assert.equal(reloadedShape.y, 200);
});

test('TldrawDocumentAdapter - rejects corrupted document without crashing', () => {
  assert.throws(
    () => {
      TldrawDocumentAdapter.createStoreFromDocument({
        schemaVersion: 'invalid' as any,
        records: null as any,
      });
    },
    {
      message: /Cannot create tldraw store/,
    }
  );
});
