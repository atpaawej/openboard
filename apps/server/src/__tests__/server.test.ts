import test from 'node:test';
import assert from 'node:assert/strict';
import { createOpenBoardServer } from '../server.js';
import { SQLiteBoardRepository } from '@openboard/storage';

test('OpenBoardServer starts with SQLite repository and handles board API lifecycle', async () => {
  const repository = new SQLiteBoardRepository({ dbPath: ':memory:' });
  const server = createOpenBoardServer({
    port: 0, // dynamic port
    repository,
  });

  const info = await server.start(0);
  assert.ok(info.port > 0);
  assert.ok(info.url.startsWith('http://localhost:'));

  // 1. Health check
  const healthRes = await fetch(`${info.url}/api/health`);
  assert.equal(healthRes.status, 200);
  const healthJson = (await healthRes.json()) as { status: string; name: string };
  assert.equal(healthJson.status, 'ok');
  assert.equal(healthJson.name, 'openboard');

  // 2. Create board via API
  const createRes = await fetch(`${info.url}/api/boards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Server Integration Board',
      description: 'Created via REST API',
      favorite: true,
    }),
  });

  assert.equal(createRes.status, 201);
  const createJson = (await createRes.json()) as {
    success: boolean;
    data: { metadata: { id: string; name: string; favorite: boolean } };
  };
  assert.equal(createJson.success, true);
  assert.equal(createJson.data.metadata.name, 'Server Integration Board');
  assert.equal(createJson.data.metadata.favorite, true);
  const boardId = createJson.data.metadata.id;

  // 3. List boards via API
  const listRes = await fetch(`${info.url}/api/boards`);
  assert.equal(listRes.status, 200);
  const listJson = (await listRes.json()) as { success: boolean; data: Array<{ id: string }> };
  assert.equal(listJson.success, true);
  assert.equal(listJson.data.length, 1);
  assert.equal(listJson.data[0]?.id, boardId);

  // 4. Get specific board
  const getRes = await fetch(`${info.url}/api/boards/${boardId}`);
  assert.equal(getRes.status, 200);
  const getJson = (await getRes.json()) as {
    success: boolean;
    data: { metadata: { name: string } };
  };
  assert.equal(getJson.data.metadata.name, 'Server Integration Board');

  // 5. Update board via PATCH
  const patchRes = await fetch(`${info.url}/api/boards/${boardId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Updated Server Board',
      favorite: false,
    }),
  });
  assert.equal(patchRes.status, 200);
  const patchJson = (await patchRes.json()) as {
    success: boolean;
    data: { metadata: { name: string; favorite: boolean } };
  };
  assert.equal(patchJson.data.metadata.name, 'Updated Server Board');
  assert.equal(patchJson.data.metadata.favorite, false);

  // 6. Delete board
  const deleteRes = await fetch(`${info.url}/api/boards/${boardId}`, {
    method: 'DELETE',
  });
  assert.equal(deleteRes.status, 200);

  // 7. Get deleted board returns 404
  const getAfterDeleteRes = await fetch(`${info.url}/api/boards/${boardId}`);
  assert.equal(getAfterDeleteRes.status, 404);

  await server.stop();
  repository.close();
});
