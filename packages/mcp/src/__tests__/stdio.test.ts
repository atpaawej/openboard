import test from 'node:test';
import assert from 'node:assert/strict';
import { PassThrough } from 'node:stream';
import { OpenBoardMcpServer } from '../server.js';
import { StdioMcpServerTransport } from '../stdio.js';
import { BoardService, CanvasService } from '@openboard/core';
import { SQLiteBoardRepository } from '@openboard/storage';

test('StdioMcpServerTransport processes standard JSON-RPC 2.0 requests over streams', async () => {
  const repository = new SQLiteBoardRepository({ dbPath: ':memory:' });
  const boardService = new BoardService(repository);
  const canvasService = new CanvasService(boardService);
  const mcpServer = new OpenBoardMcpServer(boardService, canvasService);

  const mockStdin = new PassThrough();
  const mockStdout = new PassThrough();
  const mockStderr = new PassThrough();

  const responses: any[] = [];
  mockStdout.on('data', (chunk) => {
    const lines = chunk
      .toString()
      .split('\n')
      .filter((l: string) => l.trim().length > 0);
    for (const line of lines) {
      responses.push(JSON.parse(line));
    }
  });

  const transport = new StdioMcpServerTransport(mcpServer, {
    stdin: mockStdin,
    stdout: mockStdout,
    stderr: mockStderr,
  });

  transport.start();

  // Helper to send frame and wait for response
  const sendRequest = async (req: any): Promise<any> => {
    const initialCount = responses.length;
    mockStdin.write(JSON.stringify(req) + '\n');
    const start = Date.now();
    while (responses.length === initialCount && Date.now() - start < 1000) {
      await new Promise((r) => setTimeout(r, 10));
    }
    return responses[responses.length - 1];
  };

  // 1. Initialize
  const initRes = await sendRequest({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      clientInfo: { name: 'codex-agent', version: '1.0.0' },
    },
  });
  assert.equal(initRes.id, 1);
  assert.equal(initRes.result.serverInfo.name, 'openboard');
  assert.equal(initRes.result.serverInfo.version, '0.1.0');
  assert.ok(initRes.result.capabilities.tools);

  // 2. Ping
  const pingRes = await sendRequest({
    jsonrpc: '2.0',
    id: 2,
    method: 'ping',
  });
  assert.equal(pingRes.id, 2);
  assert.deepEqual(pingRes.result, {});

  // 3. Tools List
  const toolsRes = await sendRequest({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/list',
  });
  assert.equal(toolsRes.id, 3);
  assert.equal(toolsRes.result.tools.length, 13);

  // 4. Create Board via tools/call
  const createRes = await sendRequest({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'create_board',
      arguments: {
        name: 'Stdio Flowchart',
      },
    },
  });
  assert.equal(createRes.id, 4);
  const createdBoard = JSON.parse(createRes.result.content[0].text);
  assert.equal(createdBoard.name, 'Stdio Flowchart');
  const boardId = createdBoard.id;

  // 5. Create Shapes on Canvas via tools/call
  const shapeRes = await sendRequest({
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'create_shapes',
      arguments: {
        board_id: boardId,
        shapes: [
          {
            id: 'rect_1',
            type: 'geo',
            geo: 'rectangle',
            x: 50,
            y: 50,
            w: 150,
            h: 80,
            text: 'Step 1',
            color: 'blue',
          },
        ],
      },
    },
  });
  assert.equal(shapeRes.id, 5);
  const createdShapes = JSON.parse(shapeRes.result.content[0].text);
  assert.equal(createdShapes.createdCount, 1);

  // 6. Get Canvas State via tools/call
  const stateRes = await sendRequest({
    jsonrpc: '2.0',
    id: 6,
    method: 'tools/call',
    params: {
      name: 'get_canvas_state',
      arguments: {
        board_id: boardId,
      },
    },
  });
  assert.equal(stateRes.id, 6);
  const canvasState = JSON.parse(stateRes.result.content[0].text);
  assert.equal(canvasState.shapesCount, 1);
  assert.equal(canvasState.shapes[0].text, 'Step 1');

  // 7. Get Screenshot via tools/call
  const screenshotRes = await sendRequest({
    jsonrpc: '2.0',
    id: 7,
    method: 'tools/call',
    params: {
      name: 'get_canvas_screenshot',
      arguments: {
        board_id: boardId,
      },
    },
  });
  assert.equal(screenshotRes.id, 7);
  assert.equal(screenshotRes.result.content.length, 2);
  assert.equal(screenshotRes.result.content[0].type, 'image');
  assert.equal(screenshotRes.result.content[0].mimeType, 'image/svg+xml');

  // 8. Error Handling - Unknown Method
  const unknownMethodRes = await sendRequest({
    jsonrpc: '2.0',
    id: 8,
    method: 'unknown/method',
  });
  assert.equal(unknownMethodRes.id, 8);
  assert.equal(unknownMethodRes.error.code, -32601);

  // 9. Error Handling - Parse Error
  const initialCount = responses.length;
  mockStdin.write('invalid json { format\n');
  const start = Date.now();
  while (responses.length === initialCount && Date.now() - start < 1000) {
    await new Promise((r) => setTimeout(r, 10));
  }
  const parseErrRes = responses[responses.length - 1];
  assert.equal(parseErrRes.error.code, -32700);

  transport.stop();
  repository.close();
});
