import test from 'node:test';
import assert from 'node:assert/strict';
import { BoardService } from '../service.js';
import { MemoryBoardRepository, SQLiteBoardRepository } from '@openboard/storage';
import { BoardNotFoundError } from '@openboard/shared';

test('BoardService with MemoryBoardRepository handles board domain operations and deep lifecycle', async () => {
  const repository = new MemoryBoardRepository();
  const service = new BoardService(repository);

  // 1. Create board with default values
  const board = await service.createBoard({ name: 'Architecture Design' });
  assert.ok(board.metadata.id);
  assert.equal(board.metadata.name, 'Architecture Design');
  assert.equal(board.metadata.favorite, false);
  assert.ok(board.document.records['document:document']);

  // 2. Retrieve board
  const fetched = await service.getBoard(board.metadata.id);
  assert.equal(fetched.metadata.name, 'Architecture Design');

  // 3. Toggle favorite
  const favorited = await service.toggleFavorite(board.metadata.id);
  assert.equal(favorited.metadata.favorite, true);

  // 4. Duplicate board
  const duplicate = await service.duplicateBoard(board.metadata.id, 'Architecture Design (Clone)');
  assert.notEqual(duplicate.metadata.id, board.metadata.id);
  assert.equal(duplicate.metadata.name, 'Architecture Design (Clone)');
  assert.equal(duplicate.metadata.favorite, false);

  // 5. List summaries
  const summaries = await service.listBoards();
  assert.equal(summaries.length, 2);

  // 6. Delete
  const deleted = await service.deleteBoard(board.metadata.id);
  assert.equal(deleted, true);

  // 7. Get non-existent throws BoardNotFoundError
  await assert.rejects(
    async () => {
      await service.getBoard(board.metadata.id);
    },
    (err: unknown) => err instanceof BoardNotFoundError,
  );

  // 8. Restore board
  const restored = await service.restoreBoard(board.metadata.id);
  assert.equal(restored, true);
  const afterRestore = await service.getBoard(board.metadata.id);
  assert.equal(afterRestore.metadata.id, board.metadata.id);

  // 9. Permanent delete
  const permDeleted = await service.permanentDeleteBoard(board.metadata.id);
  assert.equal(permDeleted, true);
  const trashAfterPerm = await service.listBoards({ deletedOnly: true });
  assert.equal(trashAfterPerm.length, 0);
});

test('BoardService with SQLiteBoardRepository (:memory:) behaves identically', async () => {
  const repository = new SQLiteBoardRepository({ dbPath: ':memory:' });
  const service = new BoardService(repository);

  // 1. Create board
  const board = await service.createBoard({
    name: 'SQLite Backed Board',
    description: 'Testing service with SQLite',
  });
  assert.ok(board.metadata.id);
  assert.equal(board.metadata.name, 'SQLite Backed Board');
  assert.equal(board.metadata.description, 'Testing service with SQLite');

  // 2. Retrieve board
  const fetched = await service.getBoard(board.metadata.id);
  assert.equal(fetched.metadata.name, 'SQLite Backed Board');
  assert.equal(fetched.metadata.description, 'Testing service with SQLite');

  // 3. Toggle favorite
  const favorited = await service.toggleFavorite(board.metadata.id);
  assert.equal(favorited.metadata.favorite, true);

  // 4. Duplicate board
  const duplicate = await service.duplicateBoard(board.metadata.id);
  assert.equal(duplicate.metadata.name, 'SQLite Backed Board (Copy)');

  // 5. List summaries
  const summaries = await service.listBoards();
  assert.equal(summaries.length, 2);

  // 6. Delete
  const deleted = await service.deleteBoard(board.metadata.id);
  assert.equal(deleted, true);

  // 7. Get non-existent throws BoardNotFoundError
  await assert.rejects(
    async () => {
      await service.getBoard(board.metadata.id);
    },
    (err: unknown) => err instanceof BoardNotFoundError,
  );

  // 8. Restore board
  const restored = await service.restoreBoard(board.metadata.id);
  assert.equal(restored, true);
  const afterRestore = await service.getBoard(board.metadata.id);
  assert.equal(afterRestore.metadata.id, board.metadata.id);

  // 9. Permanent delete
  const permDeleted = await service.permanentDeleteBoard(board.metadata.id);
  assert.equal(permDeleted, true);
  const trashAfterPerm = await service.listBoards({ deletedOnly: true });
  assert.equal(trashAfterPerm.length, 0);

  repository.close();
});
