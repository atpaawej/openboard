import test from 'node:test';
import assert from 'node:assert/strict';

// Polyfill RAF in Node environment for tldraw store reactive listener testing
if (typeof globalThis.requestAnimationFrame === 'undefined') {
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 16) as any;
  globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id);
}

import { createTLStore } from 'tldraw';
import { BoardCanvasController } from '../controller.js';

test('BoardCanvasController - subscribes strictly to user-generated document changes', async () => {
  const store = createTLStore();
  store.loadStoreSnapshot({
    store: {
      'document:document': { typeName: 'document', id: 'document:document', name: '', meta: {}, gridSize: 10 },
      'page:page': { typeName: 'page', id: 'page:page', name: 'Page 1', index: 'a1', meta: {} },
    } as any,
    schema: store.schema.serialize(),
  });

  // Mock Editor holding this store
  const mockEditor: any = {
    store,
    getCurrentPageShapes: () => [],
    getSelectedShapes: () => [],
    getViewportPageBounds: () => ({ x: 0, y: 0, w: 1920, h: 1080 }),
  };

  const controller = new BoardCanvasController(mockEditor);
  assert.equal(controller.isDisposed(), false);

  let changeCount = 0;
  const unsubscribe = controller.subscribeToDocumentChanges(() => {
    changeCount++;
  });

  // 1. Session/Pointer change should NOT trigger document change listener
  store.update('pointer:pointer' as any, (p: any) => ({ ...p, x: 100, y: 100 }));

  // Wait for RAF tick
  await new Promise((r) => setTimeout(r, 40));
  assert.equal(changeCount, 0, 'Pointer/session mutations must not trigger document autosave listener');

  // 2. Document change (adding a page) SHOULD trigger listener
  store.put([
    {
      id: 'page:page_2' as any,
      typeName: 'page',
      name: 'Page 2',
      index: 'a2' as any,
      meta: {},
    },
  ]);

  await new Promise((r) => setTimeout(r, 40));
  assert.equal(changeCount, 1, 'Document-scoped additions must trigger listener');

  // 3. Extract serialized document
  const doc = controller.getDocument();
  assert.ok(doc.records['page:page_2']);

  // 4. Remote change should NOT trigger listener
  store.mergeRemoteChanges(() => {
    store.put([
      {
        id: 'page:page_3' as any,
        typeName: 'page',
        name: 'Page 3',
        index: 'a3' as any,
        meta: {},
      },
    ]);
  });

  await new Promise((r) => setTimeout(r, 40));
  assert.equal(changeCount, 1, 'Remote changes must not trigger user autosave listener');

  // 5. Unsubscribe and disposal
  unsubscribe();
  controller.dispose();
  assert.equal(controller.isDisposed(), true);
  assert.equal(controller.getEditor(), null);
});
