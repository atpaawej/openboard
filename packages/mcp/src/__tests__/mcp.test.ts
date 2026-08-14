import test from 'node:test';
import assert from 'node:assert/strict';
import { OpenBoardMcpServer } from '../server.js';
import { BoardService, CanvasService } from '@openboard/core';
import { SQLiteBoardRepository } from '@openboard/storage';

test('OpenBoardMcpServer executes agent tool calls against SQLite repository backed service', async () => {
  const repository = new SQLiteBoardRepository({ dbPath: ':memory:' });
  const boardService = new BoardService(repository);
  const canvasService = new CanvasService(boardService);
  const mcpServer = new OpenBoardMcpServer(boardService, canvasService);

  // 1. Check tools definition (all 13 tools)
  const tools = mcpServer.getTools();
  assert.equal(tools.length, 13);
  assert.deepEqual(
    tools.map((t) => t.name),
    [
      'list_boards',
      'create_board',
      'get_board',
      'rename_board',
      'duplicate_board',
      'favorite_board',
      'restore_board',
      'delete_board',
      'get_canvas_state',
      'get_canvas_screenshot',
      'create_shapes',
      'update_shapes',
      'delete_shapes',
    ],
  );

  // 2. Create board via MCP tool
  const createResult = await mcpServer.handleToolCall('create_board', {
    name: 'MCP Architecture Board',
    description: 'Created by AI agent via MCP',
  });
  assert.equal(createResult.isError, undefined);
  const createdBoard = JSON.parse(createResult.content[0]?.text || '{}');
  assert.equal(createdBoard.name, 'MCP Architecture Board');
  const boardId = createdBoard.id;

  // 3. Duplicate board via MCP tool
  const dupResult = await mcpServer.handleToolCall('duplicate_board', {
    board_id: boardId,
    name: 'MCP Architecture Copy',
  });
  assert.equal(dupResult.isError, undefined);
  const dupBoard = JSON.parse(dupResult.content[0]?.text || '{}');
  assert.equal(dupBoard.name, 'MCP Architecture Copy');
  assert.notEqual(dupBoard.id, boardId);

  // 4. Favorite board via MCP tool
  const favResult = await mcpServer.handleToolCall('favorite_board', {
    board_id: dupBoard.id,
    favorite: true,
  });
  assert.equal(favResult.isError, undefined);
  const favBoard = JSON.parse(favResult.content[0]?.text || '{}');
  assert.equal(favBoard.favorite, true);

  // 5. List favorite boards via MCP tool
  const listFavResult = await mcpServer.handleToolCall('list_boards', { favoritesOnly: true });
  const favList = JSON.parse(listFavResult.content[0]?.text || '[]');
  assert.equal(favList.length, 1);
  assert.equal(favList[0].id, dupBoard.id);

  // 6. Delete board via MCP tool (soft delete)
  const deleteBoardResult = await mcpServer.handleToolCall('delete_board', {
    board_id: boardId,
  });
  assert.equal(deleteBoardResult.isError, undefined);

  // 7. List trash boards via MCP tool
  const listTrashResult = await mcpServer.handleToolCall('list_boards', { filter: 'trash' });
  const trashList = JSON.parse(listTrashResult.content[0]?.text || '[]');
  assert.equal(trashList.length, 1);
  assert.equal(trashList[0].id, boardId);

  // 8. Restore board via MCP tool
  const restoreResult = await mcpServer.handleToolCall('restore_board', {
    board_id: boardId,
  });
  assert.equal(restoreResult.isError, undefined);

  // 9. Rename board via MCP tool
  const renameResult = await mcpServer.handleToolCall('rename_board', {
    board_id: boardId,
    name: 'MCP Architecture Board v2',
  });
  assert.equal(renameResult.isError, undefined);
  const renamedBoard = JSON.parse(renameResult.content[0]?.text || '{}');
  assert.equal(renamedBoard.name, 'MCP Architecture Board v2');

  // 10. Get board via MCP tool
  const getResult = await mcpServer.handleToolCall('get_board', { board_id: boardId });
  assert.equal(getResult.isError, undefined);
  const fetchedBoard = JSON.parse(getResult.content[0]?.text || '{}');
  assert.equal(fetchedBoard.id, boardId);
  assert.equal(fetchedBoard.name, 'MCP Architecture Board v2');

  // 11. Create shapes on canvas with arrow relationship binding via MCP tool
  const createShapesResult = await mcpServer.handleToolCall('create_shapes', {
    board_id: boardId,
    shapes: [
      {
        id: 'box_gateway',
        type: 'geo',
        geo: 'rectangle',
        x: 100,
        y: 100,
        w: 200,
        h: 100,
        text: 'API Gateway',
        color: 'blue',
        fill: 'semi',
      },
      {
        id: 'box_db',
        type: 'geo',
        geo: 'rectangle',
        x: 450,
        y: 100,
        w: 200,
        h: 100,
        text: 'PostgreSQL',
        color: 'green',
        fill: 'semi',
      },
      {
        id: 'arrow_conn',
        type: 'arrow',
        from: 'box_gateway',
        to: 'box_db',
        text: 'queries',
        x: 300,
        y: 150,
        color: 'black',
      },
      {
        id: 'note_auth',
        type: 'note',
        x: 100,
        y: 250,
        text: 'JWT verification enabled',
        color: 'yellow',
      },
    ],
  });
  assert.equal(createShapesResult.isError, undefined);
  const createdShapes = JSON.parse(createShapesResult.content[0]?.text || '{}');
  assert.equal(createdShapes.createdCount, 4);

  // 12. Get canvas state via MCP tool & verify relationship bindings
  const canvasStateResult = await mcpServer.handleToolCall('get_canvas_state', {
    board_id: boardId,
  });
  assert.equal(canvasStateResult.isError, undefined);
  const canvasState = JSON.parse(canvasStateResult.content[0]?.text || '{}');
  assert.equal(canvasState.shapesCount, 4);
  assert.equal(canvasState.boardId, boardId);
  assert.ok(canvasState.bounds.width > 0);

  const gwShape = canvasState.shapes.find((s: any) => s.id === 'shape:box_gateway');
  assert.ok(gwShape);
  assert.equal(gwShape.text, 'API Gateway');
  assert.equal(gwShape.color, 'blue');

  const arrowShape = canvasState.shapes.find((s: any) => s.id === 'shape:arrow_conn');
  assert.ok(arrowShape);
  assert.equal(arrowShape.from, 'shape:box_gateway');
  assert.equal(arrowShape.to, 'shape:box_db');
  assert.equal(arrowShape.text, 'queries');

  // 13. Visual Inspection (Screenshot) via MCP tool
  const screenshotResult = await mcpServer.handleToolCall('get_canvas_screenshot', {
    board_id: boardId,
    theme: 'light',
    padding: 30,
  });
  assert.equal(screenshotResult.isError, undefined);
  assert.equal(screenshotResult.content.length, 2);
  assert.equal(screenshotResult.content[0]?.type, 'image');
  assert.equal((screenshotResult.content[0] as any)?.mimeType, 'image/svg+xml');
  assert.ok((screenshotResult.content[0] as any)?.data.length > 0);
  assert.ok(screenshotResult.content[1]?.text?.includes('Screenshot captured'));

  // 14. Update shape via MCP tool
  const updateShapesResult = await mcpServer.handleToolCall('update_shapes', {
    board_id: boardId,
    shapes: [
      {
        id: 'box_gateway',
        x: 150,
        y: 150,
        text: 'API Gateway (Cluster)',
        color: 'violet',
      },
    ],
  });
  assert.equal(updateShapesResult.isError, undefined);

  const updatedStateResult = await mcpServer.handleToolCall('get_canvas_state', {
    board_id: boardId,
  });
  const updatedState = JSON.parse(updatedStateResult.content[0]?.text || '{}');
  const updatedGw = updatedState.shapes.find((s: any) => s.id === 'shape:box_gateway');
  assert.equal(updatedGw.x, 150);
  assert.equal(updatedGw.text, 'API Gateway (Cluster)');
  assert.equal(updatedGw.color, 'violet');

  // 15. Delete shape via MCP tool
  const deleteShapesResult = await mcpServer.handleToolCall('delete_shapes', {
    board_id: boardId,
    shape_ids: ['box_gateway'],
  });
  assert.equal(deleteShapesResult.isError, undefined);

  const finalStateResult = await mcpServer.handleToolCall('get_canvas_state', {
    board_id: boardId,
  });
  const finalState = JSON.parse(finalStateResult.content[0]?.text || '{}');
  assert.equal(finalState.shapesCount, 3);

  // 16. Error handling with guided recovery for missing board
  const missingResult = await mcpServer.handleToolCall('get_board', {
    board_id: 'non_existent_board',
  });
  assert.equal(missingResult.isError, true);
  assert.ok(missingResult.content[0]?.text?.includes('Call "list_boards"'));

  repository.close();
});
