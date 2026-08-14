import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createOpenBoardServer } from '../server.js';
import { SQLiteBoardRepository } from '@openboard/storage';
import { CanvasService } from '@openboard/core';
import { OpenBoardMcpServer } from '@openboard/mcp';

test('Phase 4 Complete Acceptance Workflow - 24-Step Lifecycle & Persistence Across Restarts', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'openboard-acceptance-'));
  const dbPath = path.join(tmpDir, 'acceptance.db');

  try {
    // 1. Start OpenBoard Server (Instance 1)
    let repository = new SQLiteBoardRepository({ dbPath });
    let server = createOpenBoardServer({ port: 0, repository });
    let info = await server.start(0);

    const api = info.url;

    // 2. Dashboard opens (Health check & initial empty boards list)
    const healthRes = await fetch(`${api}/api/health`);
    assert.equal(healthRes.status, 200);
    const initialBoardsRes = await fetch(`${api}/api/boards`);
    const initialBoardsJson = await initialBoardsRes.json();
    assert.equal(initialBoardsJson.data.length, 0);

    // 3. Create: "SaaS Architecture"
    const create1 = await fetch(`${api}/api/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'SaaS Architecture', description: 'System overview' }),
    });
    assert.equal(create1.status, 201);
    const board1 = (await create1.json()).data;
    assert.equal(board1.metadata.name, 'SaaS Architecture');
    const board1Id = board1.metadata.id;

    // 4. Create: "Payments"
    const create2 = await fetch(`${api}/api/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Payments', description: 'Stripe & crypto integration' }),
    });
    assert.equal(create2.status, 201);
    const board2 = (await create2.json()).data;
    assert.equal(board2.metadata.name, 'Payments');
    const board2Id = board2.metadata.id;

    // 5. Create: "AgentOnboard"
    const create3 = await fetch(`${api}/api/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'AgentOnboard', description: 'MCP agent protocol specs' }),
    });
    assert.equal(create3.status, 201);
    const board3 = (await create3.json()).data;
    assert.equal(board3.metadata.name, 'AgentOnboard');
    const board3Id = board3.metadata.id;

    // 6. Open SaaS Architecture
    const get1 = await fetch(`${api}/api/boards/${board1Id}`);
    assert.equal(get1.status, 200);
    const fetched1 = (await get1.json()).data;
    assert.equal(fetched1.metadata.name, 'SaaS Architecture');

    // 7. Draw content (Add shapes & SVG thumbnail)
    const mockSvgThumbnail =
      'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22blue%22%2F%3E%3C%2Fsvg%3E';

    const patchCanvas = await fetch(`${api}/api/boards/${board1Id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        thumbnail: mockSvgThumbnail,
        document: {
          schemaVersion: 1,
          records: {
            'shape:box1': {
              id: 'shape:box1',
              typeName: 'shape',
              type: 'geo',
              x: 100,
              y: 100,
              props: { geo: 'rectangle', text: 'Auth Service' },
            },
          },
        },
      }),
    });
    assert.equal(patchCanvas.status, 200);

    // 8. Return to dashboard (Fetch all boards)
    const listAfterDraw = await fetch(`${api}/api/boards`);
    const listAfterDrawJson = await listAfterDraw.json();
    assert.equal(listAfterDrawJson.data.length, 3);

    // 9. Verify thumbnail and updated time
    const updatedBoard1 = listAfterDrawJson.data.find((b: any) => b.id === board1Id);
    assert.ok(updatedBoard1);
    assert.equal(updatedBoard1.thumbnail, mockSvgThumbnail);
    assert.ok(new Date(updatedBoard1.updatedAt).getTime() > 0);

    // 10. Favorite SaaS Architecture
    const favRes = await fetch(`${api}/api/boards/${board1Id}/favorite`, { method: 'POST' });
    assert.equal(favRes.status, 200);
    const favJson = await favRes.json();
    assert.equal(favJson.data.metadata.favorite, true);

    // 11. Open Favorites
    const favListRes = await fetch(`${api}/api/boards?filter=favorites`);
    assert.equal(favListRes.status, 200);
    const favListJson = await favListRes.json();

    // 12. Verify it appears
    assert.equal(favListJson.data.length, 1);
    assert.equal(favListJson.data[0].id, board1Id);
    assert.equal(favListJson.data[0].name, 'SaaS Architecture');

    // 13. Search "Payments"
    const searchRes = await fetch(`${api}/api/boards?q=Payments`);
    assert.equal(searchRes.status, 200);
    const searchJson = await searchRes.json();

    // 14. Verify search works
    assert.equal(searchJson.data.length, 1);
    assert.equal(searchJson.data[0].id, board2Id);
    assert.equal(searchJson.data[0].name, 'Payments');

    // 15. Duplicate Payments
    const dupRes = await fetch(`${api}/api/boards/${board2Id}/duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Payments Copy' }),
    });
    assert.equal(dupRes.status, 201);
    const dupBoard = (await dupRes.json()).data;
    assert.notEqual(dupBoard.metadata.id, board2Id);
    assert.equal(dupBoard.metadata.name, 'Payments Copy');
    const dupBoardId = dupBoard.metadata.id;

    // 16. Rename duplicate: "Payments V2"
    const renameRes = await fetch(`${api}/api/boards/${dupBoardId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Payments V2' }),
    });
    assert.equal(renameRes.status, 200);
    assert.equal((await renameRes.json()).data.metadata.name, 'Payments V2');

    // 17. Delete Payments (Move to trash)
    const delRes = await fetch(`${api}/api/boards/${board2Id}`, { method: 'DELETE' });
    assert.equal(delRes.status, 200);

    // 18. Open Trash
    const trashRes = await fetch(`${api}/api/boards?filter=trash`);
    assert.equal(trashRes.status, 200);
    const trashJson = await trashRes.json();
    assert.equal(trashJson.data.length, 1);
    assert.equal(trashJson.data[0].id, board2Id);

    // 19. Restore Payments
    const restoreRes = await fetch(`${api}/api/boards/${board2Id}/restore`, { method: 'POST' });
    assert.equal(restoreRes.status, 200);

    // 20. Verify Payments returns to normal listing
    const allAfterRestore = await fetch(`${api}/api/boards`);
    const allAfterRestoreJson = await allAfterRestore.json();
    assert.equal(allAfterRestoreJson.data.length, 4); // SaaS Architecture, Payments, AgentOnboard, Payments V2
    assert.ok(
      allAfterRestoreJson.data.some((b: any) => b.id === board2Id && b.name === 'Payments'),
    );

    // 21. Delete Payments again
    const del2 = await fetch(`${api}/api/boards/${board2Id}`, { method: 'DELETE' });
    assert.equal(del2.status, 200);

    // 22. Permanently delete it
    const permDel = await fetch(`${api}/api/boards/${board2Id}/permanent`, { method: 'DELETE' });
    assert.equal(permDel.status, 200);

    const trashAfterPerm = await fetch(`${api}/api/boards?filter=trash`);
    assert.equal((await trashAfterPerm.json()).data.length, 0);

    // 23. Restart OpenBoard
    await server.stop();
    repository.close();

    // Re-instantiate from persistent database file
    repository = new SQLiteBoardRepository({ dbPath });
    server = createOpenBoardServer({ port: 0, repository });
    info = await server.start(0);

    // 24. Verify all persisted boards remain correct after restart
    const postRestartList = await fetch(`${info.url}/api/boards`);
    const postRestartJson = await postRestartList.json();

    // Should contain: SaaS Architecture, AgentOnboard, Payments V2
    assert.equal(postRestartJson.data.length, 3);

    const saas = postRestartJson.data.find((b: any) => b.id === board1Id);
    assert.ok(saas);
    assert.equal(saas.name, 'SaaS Architecture');
    assert.equal(saas.favorite, true);
    assert.equal(saas.thumbnail, mockSvgThumbnail);

    const agent = postRestartJson.data.find((b: any) => b.id === board3Id);
    assert.ok(agent);
    assert.equal(agent.name, 'AgentOnboard');

    const paymentsV2 = postRestartJson.data.find((b: any) => b.id === dupBoardId);
    assert.ok(paymentsV2);
    assert.equal(paymentsV2.name, 'Payments V2');

    // Verify MCP tool calls against this restarted database
    const boardService = server.getBoardService();
    const canvasService = new CanvasService(boardService);
    const mcpServer = new OpenBoardMcpServer(boardService, canvasService);

    const mcpList = await mcpServer.handleToolCall('list_boards', { favoritesOnly: true });
    const mcpFavs = JSON.parse(mcpList.content[0]?.text || '[]');
    assert.equal(mcpFavs.length, 1);
    assert.equal(mcpFavs[0].name, 'SaaS Architecture');

    await server.stop();
    repository.close();
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
