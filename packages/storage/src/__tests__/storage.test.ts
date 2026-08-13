import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoryBoardRepository } from '../memory.js';
import type { Board } from '@openboard/shared';

test('MemoryBoardRepository CRUD operations and filtering', async () => {
  const repository = new MemoryBoardRepository();

  const board: Board = {
    metadata: {
      id: 'test-board-1',
      name: 'Initial Board',
      createdAt: '2026-08-14T00:00:00.000Z',
      updatedAt: '2026-08-14T00:00:00.000Z',
      favorite: false,
      thumbnail: null,
      description: 'A test description',
    },
    document: {
      schemaVersion: 1,
      records: {
        'page:1': { id: 'page:1', name: 'Page 1' },
      },
    },
  };

  // 1. Create
  await repository.createBoard(board);
  const fetched = await repository.getBoard('test-board-1');
  assert.ok(fetched);
  assert.equal(fetched.metadata.name, 'Initial Board');
  assert.equal(fetched.metadata.description, 'A test description');
  assert.deepEqual(fetched.document, board.document);

  // 2. List
  const list = await repository.listBoards();
  assert.equal(list.length, 1);
  assert.equal(list[0]?.id, 'test-board-1');

  // 3. Update
  await repository.updateBoard({
    ...board,
    metadata: {
      ...board.metadata,
      name: 'Updated Board Name',
      favorite: true,
      updatedAt: '2026-08-14T01:00:00.000Z',
    },
  });

  const updated = await repository.getBoard('test-board-1');
  assert.equal(updated?.metadata.name, 'Updated Board Name');
  assert.equal(updated?.metadata.favorite, true);

  // 4. Filtering & Search
  const favList = await repository.listBoards({ favoritesOnly: true });
  assert.equal(favList.length, 1);

  const searchFound = await repository.listBoards({ searchQuery: 'Updated' });
  assert.equal(searchFound.length, 1);

  const searchNotFound = await repository.listBoards({ searchQuery: 'nonexistent' });
  assert.equal(searchNotFound.length, 0);

  // 5. Delete (soft)
  const deleted = await repository.deleteBoard('test-board-1');
  assert.equal(deleted, true);
  const afterDelete = await repository.getBoard('test-board-1');
  assert.equal(afterDelete, null);
  const listAfterDelete = await repository.listBoards();
  assert.equal(listAfterDelete.length, 0);

  // 6. Restore
  const restored = await repository.restoreBoard('test-board-1');
  assert.equal(restored, true);
  const afterRestore = await repository.getBoard('test-board-1');
  assert.ok(afterRestore);
  assert.equal(afterRestore.metadata.id, 'test-board-1');

  repository.close();
});
