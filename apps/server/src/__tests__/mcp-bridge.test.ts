import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { OpenBoardServer } from '../server.js';
import { OpenBoardMcpServer } from '@openboard/mcp';
import { SQLiteBoardRepository } from '@openboard/storage';

test('MCP Bridge & Canvas Architecture - Browser Closed Persistence & Browser Open SSE Live Sync', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'openboard-mcp-bridge-test-'));
  const dbPath = path.join(tmpDir, 'test.db');

  const repository = new SQLiteBoardRepository({ dbPath });
  const server = new OpenBoardServer({
    port: 0,
    repository,
  });

  await server.start();
  const boardService = server.getBoardService();
  const canvasService = server.getCanvasService();
  const mcpServer = new OpenBoardMcpServer(boardService, canvasService);

  // ══════════════════════════════════════════════════════════════════════════
  // 1. CASE A — BROWSER CLOSED (PERSISTENCE & RESTART)
  // ══════════════════════════════════════════════════════════════════════════

  // Agent creates board via MCP
  const createBoardRes = await mcpServer.handleToolCall('create_board', {
    name: 'Payment Architecture',
    description: 'Autonomous payment service design',
  });
  assert.equal(createBoardRes.isError, undefined);
  const boardA = JSON.parse(createBoardRes.content[0]?.text || '{}');
  const boardAId = boardA.id;

  // Agent creates Board B for isolation testing
  const createBoardBRes = await mcpServer.handleToolCall('create_board', {
    name: 'Analytics Dashboard Board',
  });
  const boardB = JSON.parse(createBoardBRes.content[0]?.text || '{}');
  const boardBId = boardB.id;

  // Agent adds shapes to Board A via MCP (without any browser connected)
  const addShapesRes = await mcpServer.handleToolCall('create_shapes', {
    board_id: boardAId,
    shapes: [
      {
        id: 'api_gw',
        type: 'geo',
        geo: 'rectangle',
        x: 100,
        y: 100,
        w: 180,
        h: 90,
        text: 'API Gateway',
        color: 'blue',
      },
      {
        id: 'auth_srv',
        type: 'geo',
        geo: 'rectangle',
        x: 350,
        y: 100,
        w: 180,
        h: 90,
        text: 'Auth Service',
        color: 'violet',
      },
      {
        id: 'conn_arrow',
        type: 'arrow',
        x: 280,
        y: 145,
        text: 'Verify Token',
        start: { x: 0, y: 0 },
        end: { x: 70, y: 0 },
        color: 'black',
      },
    ],
  });
  assert.equal(addShapesRes.isError, undefined);

  // Agent inspects Board A canvas state
  const stateRes = await mcpServer.handleToolCall('get_canvas_state', { board_id: boardAId });
  assert.equal(stateRes.isError, undefined);
  const stateA = JSON.parse(stateRes.content[0]?.text || '{}');
  assert.equal(stateA.shapesCount, 3);
  assert.equal(stateA.shapes.find((s: any) => s.id === 'shape:api_gw')?.text, 'API Gateway');

  // Verify Board B canvas remains empty (Isolation)
  const stateBRes = await mcpServer.handleToolCall('get_canvas_state', { board_id: boardBId });
  const stateB = JSON.parse(stateBRes.content[0]?.text || '{}');
  assert.equal(stateB.shapesCount, 0);

  // Stop server and simulate cold restart
  await server.stop();
  repository.close();

  // Restart server pointing to same SQLite database
  const restartedRepo = new SQLiteBoardRepository({ dbPath });
  const restartedServer = new OpenBoardServer({
    port: 0,
    repository: restartedRepo,
  });
  const restartedInfo = await restartedServer.start();

  // Verify REST endpoint retrieves exact persisted agent state
  const fetchRes = await fetch(`${restartedInfo.url}/api/boards/${boardAId}`);
  assert.equal(fetchRes.status, 200);
  const fetchJson = await fetchRes.json();
  assert.equal(fetchJson.data.metadata.name, 'Payment Architecture');
  assert.ok(fetchJson.data.document.records['shape:api_gw']);
  assert.ok(fetchJson.data.document.records['shape:auth_srv']);
  assert.ok(fetchJson.data.document.records['shape:conn_arrow']);

  // ══════════════════════════════════════════════════════════════════════════
  // 2. CASE B — BROWSER OPEN (LIVE SSE SYNCHRONIZATION)
  // ══════════════════════════════════════════════════════════════════════════

  const liveMcp = new OpenBoardMcpServer(
    restartedServer.getBoardService(),
    restartedServer.getCanvasService(),
  );

  // Connect mock browser client to SSE endpoint for Board A
  const sseEvents: any[] = [];
  const sseReq = http.request(
    `${restartedInfo.url}/api/boards/${boardAId}/live`,
    {
      headers: {
        Accept: 'text/event-stream',
      },
    },
    (res) => {
      res.on('data', (chunk) => {
        const text = chunk.toString();
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              sseEvents.push(JSON.parse(line.slice(6)));
            } catch {
              // ignore
            }
          }
        }
      });
    },
  );
  sseReq.end();

  // Wait for initial connection frame
  await new Promise((r) => setTimeout(r, 60));
  assert.ok(sseEvents.some((e) => e.type === 'connected' && e.boardId === boardAId));

  // Agent updates shape on Board A while browser is connected
  await liveMcp.handleToolCall('update_shapes', {
    board_id: boardAId,
    shapes: [
      {
        id: 'api_gw',
        text: 'API Gateway (High Availability)',
        color: 'green',
      },
    ],
  });

  // Wait for SSE broadcast
  await new Promise((r) => setTimeout(r, 60));
  const canvasUpdatedEvent = sseEvents.find((e) => e.type === 'canvas_updated');
  assert.ok(canvasUpdatedEvent, 'Live SSE subscriber must receive canvas_updated event');
  assert.equal(canvasUpdatedEvent.boardId, boardAId);
  assert.ok(canvasUpdatedEvent.document.records['shape:api_gw']);

  // Agent modifies Board B; Board A subscriber should NOT receive Board B events (Isolation)
  const initialEventsCount = sseEvents.length;
  await liveMcp.handleToolCall('create_shapes', {
    board_id: boardBId,
    shapes: [
      {
        id: 'chart_1',
        type: 'geo',
        x: 50,
        y: 50,
        text: 'Analytics Bar Chart',
      },
    ],
  });

  await new Promise((r) => setTimeout(r, 60));
  const newEventsForBoardA = sseEvents.slice(initialEventsCount);
  assert.equal(
    newEventsForBoardA.length,
    0,
    'Board A subscriber must not receive updates for mutations on Board B',
  );

  // Clean up
  sseReq.destroy();
  await restartedServer.stop();
  restartedRepo.close();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});
