import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createOpenBoardServer } from '../server.js';
import { SQLiteBoardRepository } from '@openboard/storage';
import type { Board, BoardDocument } from '@openboard/shared';

test('Canvas Integration - full lifecycle, persistence, multiple board isolation, and restart', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'openboard-canvas-test-'));
  const dbPath = path.join(tempDir, 'test.db');

  let repository = new SQLiteBoardRepository({ dbPath });
  let server = createOpenBoardServer({ port: 0, repository });
  let info = await server.start(0);

  try {
    // =========================================================================
    // 1. Empty board creation & verification
    // =========================================================================
    const createRes = await fetch(`${info.url}/api/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Architecture Whiteboard' }),
    });
    assert.equal(createRes.status, 201);
    const createJson = (await createRes.json()) as { success: boolean; data: Board };
    assert.equal(createJson.success, true);
    const boardAId = createJson.data.metadata.id;
    assert.equal(createJson.data.metadata.name, 'Architecture Whiteboard');

    // Verify initial empty document has baseline document:document and page:page
    const initDoc = createJson.data.document;
    assert.ok(initDoc.records['document:document']);
    assert.ok(initDoc.records['page:page']);

    // =========================================================================
    // 2. Open Board (GET /api/boards/:id)
    // =========================================================================
    const getRes = await fetch(`${info.url}/api/boards/${boardAId}`);
    assert.equal(getRes.status, 200);
    const getJson = (await getRes.json()) as { success: boolean; data: Board };
    assert.equal(getJson.data.metadata.id, boardAId);
    assert.deepEqual(getJson.data.document, initDoc);

    // =========================================================================
    // 3. User draws/edits shapes -> Debounced Autosave (PATCH /api/boards/:id)
    // =========================================================================
    const shape1Id = 'shape:rect_1';
    const shape2Id = 'shape:arrow_1';

    const updatedDocA: BoardDocument = {
      schemaVersion: 1,
      records: {
        ...initDoc.records,
        [shape1Id]: {
          id: shape1Id,
          typeName: 'shape',
          type: 'geo',
          parentId: 'page:page',
          index: 'a1',
          x: 100,
          y: 100,
          rotation: 0,
          props: {
            w: 200,
            h: 100,
            geo: 'rectangle',
            color: 'blue',
            fill: 'semi',
            dash: 'draw',
            size: 'm',
            richText: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Database Service' }] }] },
          },
          meta: {},
        },
        [shape2Id]: {
          id: shape2Id,
          typeName: 'shape',
          type: 'arrow',
          parentId: 'page:page',
          index: 'a2',
          x: 300,
          y: 150,
          rotation: 0,
          props: {
            start: { x: 0, y: 0 },
            end: { x: 150, y: 0 },
            color: 'black',
            dash: 'draw',
            size: 'm',
          },
          meta: {},
        },
      },
    };

    const saveRes = await fetch(`${info.url}/api/boards/${boardAId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document: updatedDocA }),
    });
    assert.equal(saveRes.status, 200);
    const saveJson = (await saveRes.json()) as { success: boolean; data: Board };
    assert.equal(saveJson.success, true);
    assert.ok(saveJson.data.document.records[shape1Id]);
    assert.ok(saveJson.data.document.records[shape2Id]);

    // =========================================================================
    // 4. Browser Refresh / Reload Simulation
    // =========================================================================
    const reloadRes = await fetch(`${info.url}/api/boards/${boardAId}`);
    assert.equal(reloadRes.status, 200);
    const reloadJson = (await reloadRes.json()) as { success: boolean; data: Board };
    assert.equal(reloadJson.data.metadata.id, boardAId);
    assert.ok(reloadJson.data.document.records[shape1Id]);
    assert.equal(
      (reloadJson.data.document.records[shape1Id] as any).props.richText.content[0].content[0].text,
      'Database Service'
    );
    assert.ok(reloadJson.data.document.records[shape2Id]);

    // =========================================================================
    // 5. Board Title Rename
    // =========================================================================
    const renameRes = await fetch(`${info.url}/api/boards/${boardAId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Production Topology v2' }),
    });
    assert.equal(renameRes.status, 200);
    const renameJson = (await renameRes.json()) as { success: boolean; data: Board };
    assert.equal(renameJson.data.metadata.name, 'Production Topology v2');

    // =========================================================================
    // 6. Multiple Boards Isolation
    // =========================================================================
    const createBRes = await fetch(`${info.url}/api/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Isolated Board B' }),
    });
    assert.equal(createBRes.status, 201);
    const createBJson = (await createBRes.json()) as { success: boolean; data: Board };
    const boardBId = createBJson.data.metadata.id;

    // Verify Board B does NOT have Board A's shapes
    assert.equal(createBJson.data.document.records[shape1Id], undefined);
    assert.equal(createBJson.data.document.records[shape2Id], undefined);

    // Edit Board B with a unique shape
    const shapeBId = 'shape:note_b';
    const docB: BoardDocument = {
      schemaVersion: 1,
      records: {
        ...createBJson.data.document.records,
        [shapeBId]: {
          id: shapeBId,
          typeName: 'shape',
          type: 'note',
          parentId: 'page:page',
          index: 'a1',
          x: 50,
          y: 50,
          rotation: 0,
          props: {
            color: 'yellow',
            size: 'm',
            richText: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Board B Secret Note' }] }] },
          },
          meta: {},
        },
      },
    };

    await fetch(`${info.url}/api/boards/${boardBId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document: docB }),
    });

    // Verify Board A still has its original shapes and NOT Board B's shape
    const checkARes = await fetch(`${info.url}/api/boards/${boardAId}`);
    const checkAJson = (await checkARes.json()) as { data: Board };
    assert.ok(checkAJson.data.document.records[shape1Id]);
    assert.equal(checkAJson.data.document.records[shapeBId], undefined);

    // =========================================================================
    // 7. Non-existent Board (404) & Save Failure Handling
    // =========================================================================
    const nonExistentRes = await fetch(`${info.url}/api/boards/non-existent-id-12345`);
    assert.equal(nonExistentRes.status, 404);

    const failPatchRes = await fetch(`${info.url}/api/boards/non-existent-id-12345`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Will Fail' }),
    });
    assert.equal(failPatchRes.status, 404);

    // =========================================================================
    // 8. Application Restart Simulation (Durable SQLite persistence)
    // =========================================================================
    // Stop server and close repository
    await server.stop();
    repository.close();

    // Reopen repository on same database path and start fresh server instance
    repository = new SQLiteBoardRepository({ dbPath });
    server = createOpenBoardServer({ port: 0, repository });
    info = await server.start(0);

    // Verify Board A content and name survived the restart
    const postRestartARes = await fetch(`${info.url}/api/boards/${boardAId}`);
    assert.equal(postRestartARes.status, 200);
    const postRestartAJson = (await postRestartARes.json()) as { data: Board };
    assert.equal(postRestartAJson.data.metadata.name, 'Production Topology v2');
    assert.ok(postRestartAJson.data.document.records[shape1Id]);
    assert.ok(postRestartAJson.data.document.records[shape2Id]);
    assert.equal(
      (postRestartAJson.data.document.records[shape1Id] as any).props.richText.content[0].content[0].text,
      'Database Service'
    );

    // Verify Board B content survived the restart independently
    const postRestartBRes = await fetch(`${info.url}/api/boards/${boardBId}`);
    assert.equal(postRestartBRes.status, 200);
    const postRestartBJson = (await postRestartBRes.json()) as { data: Board };
    assert.equal(postRestartBJson.data.metadata.name, 'Isolated Board B');
    assert.ok(postRestartBJson.data.document.records[shapeBId]);
    assert.equal(
      (postRestartBJson.data.document.records[shapeBId] as any).props.richText.content[0].content[0].text,
      'Board B Secret Note'
    );
  } finally {
    await server.stop();
    repository.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
