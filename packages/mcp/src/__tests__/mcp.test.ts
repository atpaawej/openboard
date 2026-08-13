import test from 'node:test';
import assert from 'node:assert/strict';
import { OpenBoardMcpServer } from '../server.js';
import { BoardService } from '@openboard/core';
import { SQLiteBoardRepository } from '@openboard/storage';

test('OpenBoardMcpServer executes agent tool calls against SQLite repository backed service', async () => {
  const repository = new SQLiteBoardRepository({ dbPath: ':memory:' });
  const service = new BoardService(repository);
  const mcpServer = new OpenBoardMcpServer(service);

  // 1. Check tools definition
  const tools = mcpServer.getTools();
  assert.equal(tools.length, 3);
  assert.deepEqual(
    tools.map((t) => t.name),
    ['list_boards', 'get_board', 'create_board'],
  );

  // 2. Create board via MCP tool
  const createResult = await mcpServer.handleToolCall('create_board', {
    name: 'MCP Architecture Board',
    description: 'Created by AI agent via MCP',
  });
  assert.equal(createResult.isError, undefined);
  const createdBoard = JSON.parse(createResult.content[0]?.text || '{}');
  assert.equal(createdBoard.metadata.name, 'MCP Architecture Board');
  const boardId = createdBoard.metadata.id;

  // 3. List boards via MCP tool
  const listResult = await mcpServer.handleToolCall('list_boards', {});
  assert.equal(listResult.isError, undefined);
  const boardsList = JSON.parse(listResult.content[0]?.text || '[]');
  assert.equal(boardsList.length, 1);
  assert.equal(boardsList[0].id, boardId);

  // 4. Get board via MCP tool
  const getResult = await mcpServer.handleToolCall('get_board', { boardId });
  assert.equal(getResult.isError, undefined);
  const fetchedBoard = JSON.parse(getResult.content[0]?.text || '{}');
  assert.equal(fetchedBoard.metadata.id, boardId);
  assert.equal(fetchedBoard.metadata.name, 'MCP Architecture Board');

  repository.close();
});
