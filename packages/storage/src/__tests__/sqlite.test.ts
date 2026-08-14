import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import { SQLiteBoardRepository } from '../sqlite/sqlite.js';
import { runMigrations, MIGRATIONS } from '../sqlite/migrations.js';
import { StorageOperationError } from '@openboard/shared';
import type { Board } from '@openboard/shared';

function createTempDbPath(): string {
  const tmpDir = path.join(
    os.tmpdir(),
    `openboard-test-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
  );
  return path.join(tmpDir, 'sub', 'openboard.db');
}

function cleanupDir(filePath: string): void {
  try {
    const dir = path.dirname(path.dirname(filePath));
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  } catch {
    // Ignore cleanup errors in tests
  }
}

test('SQLiteBoardRepository - Database initialization & automatic directory creation', async () => {
  const dbPath = createTempDbPath();
  assert.equal(fs.existsSync(dbPath), false);

  const repository = new SQLiteBoardRepository({ dbPath });
  assert.equal(fs.existsSync(dbPath), true);

  // Check that schema_migrations table was created
  const dbRaw = new Database(dbPath);
  const tables = dbRaw.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as {
    name: string;
  }[];
  const tableNames = tables.map((t) => t.name);

  assert.ok(tableNames.includes('boards'), 'boards table must exist');
  assert.ok(tableNames.includes('schema_migrations'), 'schema_migrations table must exist');

  dbRaw.close();
  repository.close();
  cleanupDir(dbPath);
});

test('SQLiteBoardRepository - Deterministic & idempotent migrations', async () => {
  const db = new Database(':memory:');

  // Run migrations first time
  runMigrations(db);
  const initialMigrations = db.prepare('SELECT * FROM schema_migrations').all();
  assert.equal(initialMigrations.length, MIGRATIONS.length);

  // Run migrations second time (idempotent)
  runMigrations(db);
  const secondMigrations = db.prepare('SELECT * FROM schema_migrations').all();
  assert.equal(secondMigrations.length, MIGRATIONS.length);

  db.close();
});

test('SQLiteBoardRepository - Create and Read board', async () => {
  const repository = new SQLiteBoardRepository({ dbPath: ':memory:' });

  const board: Board = {
    metadata: {
      id: 'b-001',
      name: 'System Architecture Canvas',
      createdAt: '2026-08-14T01:00:00.000Z',
      updatedAt: '2026-08-14T01:00:00.000Z',
      favorite: false,
      thumbnail: 'data:image/png;base64,mock',
      description: 'Core design blueprint',
    },
    document: {
      schemaVersion: 1,
      records: {
        'shape:box1': {
          id: 'shape:box1',
          typeName: 'shape',
          type: 'geo',
          x: 100,
          y: 200,
          props: { w: 300, h: 200, text: 'SQLite Database' },
        },
      },
    },
  };

  await repository.createBoard(board);

  const fetched = await repository.getBoard('b-001');
  assert.ok(fetched);
  assert.equal(fetched.metadata.id, 'b-001');
  assert.equal(fetched.metadata.name, 'System Architecture Canvas');
  assert.equal(fetched.metadata.description, 'Core design blueprint');
  assert.equal(fetched.metadata.thumbnail, 'data:image/png;base64,mock');
  assert.equal(fetched.metadata.favorite, false);
  assert.deepEqual(fetched.document, board.document);

  repository.close();
});

test('SQLiteBoardRepository - Persistence across repository destruction and re-instantiation', async () => {
  const dbPath = createTempDbPath();
  const repo1 = new SQLiteBoardRepository({ dbPath });

  const board: Board = {
    metadata: {
      id: 'persist-1',
      name: 'Persistent Board',
      createdAt: '2026-08-14T00:00:00.000Z',
      updatedAt: '2026-08-14T00:00:00.000Z',
      favorite: true,
      thumbnail: null,
      description: 'Should persist across process restarts',
    },
    document: {
      schemaVersion: 1,
      records: {
        'page:main': { id: 'page:main', name: 'Main Canvas' },
      },
    },
  };

  await repo1.createBoard(board);
  repo1.close();

  // Create brand new repository instance pointing to the same file
  const repo2 = new SQLiteBoardRepository({ dbPath });
  const fetched = await repo2.getBoard('persist-1');

  assert.ok(fetched);
  assert.equal(fetched.metadata.id, 'persist-1');
  assert.equal(fetched.metadata.name, 'Persistent Board');
  assert.equal(fetched.metadata.favorite, true);
  assert.deepEqual(fetched.document, board.document);

  repo2.close();
  cleanupDir(dbPath);
});

test('SQLiteBoardRepository - Update metadata and document', async () => {
  const repository = new SQLiteBoardRepository({ dbPath: ':memory:' });

  const board: Board = {
    metadata: {
      id: 'update-1',
      name: 'Original Name',
      createdAt: '2026-08-14T00:00:00.000Z',
      updatedAt: '2026-08-14T00:00:00.000Z',
      favorite: false,
      thumbnail: null,
    },
    document: {
      schemaVersion: 1,
      records: {},
    },
  };

  await repository.createBoard(board);

  const updatedBoard: Board = {
    metadata: {
      ...board.metadata,
      name: 'Renamed Canvas',
      favorite: true,
      description: 'Newly added description',
      thumbnail: 'data:image/svg+xml;utf8,<svg></svg>',
      updatedAt: '2026-08-14T02:30:00.000Z',
    },
    document: {
      schemaVersion: 1,
      records: {
        'shape:rect': { id: 'shape:rect', type: 'geo' },
      },
    },
  };

  await repository.updateBoard(updatedBoard);

  const fetched = await repository.getBoard('update-1');
  assert.ok(fetched);
  assert.equal(fetched.metadata.name, 'Renamed Canvas');
  assert.equal(fetched.metadata.favorite, true);
  assert.equal(fetched.metadata.description, 'Newly added description');
  assert.equal(fetched.metadata.thumbnail, 'data:image/svg+xml;utf8,<svg></svg>');
  assert.equal(fetched.metadata.updatedAt, '2026-08-14T02:30:00.000Z');
  assert.deepEqual(fetched.document.records, { 'shape:rect': { id: 'shape:rect', type: 'geo' } });

  repository.close();
});

test('SQLiteBoardRepository - Soft Delete and Restore lifecycle', async () => {
  const repository = new SQLiteBoardRepository({ dbPath: ':memory:' });

  const board: Board = {
    metadata: {
      id: 'trash-1',
      name: 'Board To Delete',
      createdAt: '2026-08-14T00:00:00.000Z',
      updatedAt: '2026-08-14T00:00:00.000Z',
      favorite: false,
    },
    document: { schemaVersion: 1, records: {} },
  };

  await repository.createBoard(board);

  // Soft delete
  const deleted = await repository.deleteBoard('trash-1');
  assert.equal(deleted, true);

  // Normal get returns null
  const afterDeleteGet = await repository.getBoard('trash-1');
  assert.equal(afterDeleteGet, null);

  // Normal listing excludes it
  const listActive = await repository.listBoards();
  assert.equal(listActive.length, 0);

  // Listing with includeDeleted includes it
  const listAll = await repository.listBoards({ includeDeleted: true });
  assert.equal(listAll.length, 1);
  assert.equal(listAll[0]?.id, 'trash-1');

  // Deleting again returns false (already deleted)
  const deletedAgain = await repository.deleteBoard('trash-1');
  assert.equal(deletedAgain, false);

  // Restore
  const restored = await repository.restoreBoard('trash-1');
  assert.equal(restored, true);

  // Restored board is accessible again
  const afterRestore = await repository.getBoard('trash-1');
  assert.ok(afterRestore);
  assert.equal(afterRestore.metadata.name, 'Board To Delete');

  const listAfterRestore = await repository.listBoards();
  assert.equal(listAfterRestore.length, 1);

  repository.close();
});

test('SQLiteBoardRepository - Multiple boards: listing, sorting and filtering', async () => {
  const repository = new SQLiteBoardRepository({ dbPath: ':memory:' });

  const b1: Board = {
    metadata: {
      id: 'b-alpha',
      name: 'Alpha Project',
      description: 'First system',
      createdAt: '2026-08-14T01:00:00.000Z',
      updatedAt: '2026-08-14T01:00:00.000Z',
      favorite: false,
    },
    document: { schemaVersion: 1, records: {} },
  };

  const b2: Board = {
    metadata: {
      id: 'b-beta',
      name: 'Beta Architecture',
      description: 'Second system',
      createdAt: '2026-08-14T02:00:00.000Z',
      updatedAt: '2026-08-14T04:00:00.000Z',
      favorite: true,
    },
    document: { schemaVersion: 1, records: {} },
  };

  const b3: Board = {
    metadata: {
      id: 'b-gamma',
      name: 'Gamma Roadmap',
      description: 'Planning work',
      createdAt: '2026-08-14T03:00:00.000Z',
      updatedAt: '2026-08-14T03:00:00.000Z',
      favorite: true,
    },
    document: { schemaVersion: 1, records: {} },
  };

  await repository.createBoard(b1);
  await repository.createBoard(b2);
  await repository.createBoard(b3);

  // 1. Default sort (updatedAt DESC)
  const defaultList = await repository.listBoards();
  assert.deepEqual(
    defaultList.map((b) => b.id),
    ['b-beta', 'b-gamma', 'b-alpha'],
  );

  // 2. Sort by name ASC
  const nameAsc = await repository.listBoards({ sortBy: 'name', sortDirection: 'asc' });
  assert.deepEqual(
    nameAsc.map((b) => b.id),
    ['b-alpha', 'b-beta', 'b-gamma'],
  );

  // 3. Sort by createdAt ASC
  const createdAsc = await repository.listBoards({ sortBy: 'createdAt', sortDirection: 'asc' });
  assert.deepEqual(
    createdAsc.map((b) => b.id),
    ['b-alpha', 'b-beta', 'b-gamma'],
  );

  // 4. Favorites filter
  const favs = await repository.listBoards({ favoritesOnly: true });
  assert.equal(favs.length, 2);
  assert.deepEqual(
    favs.map((b) => b.id),
    ['b-beta', 'b-gamma'],
  );

  // 5. Search query matching name
  const searchBeta = await repository.listBoards({ searchQuery: 'beta' });
  assert.equal(searchBeta.length, 1);
  assert.equal(searchBeta[0]?.id, 'b-beta');

  // 6. Search query matching description
  const searchPlanning = await repository.listBoards({ searchQuery: 'planning' });
  assert.equal(searchPlanning.length, 1);
  assert.equal(searchPlanning[0]?.id, 'b-gamma');

  repository.close();
});

test('SQLiteBoardRepository - Complex tldraw document serialization integrity', async () => {
  const repository = new SQLiteBoardRepository({ dbPath: ':memory:' });

  const complexRecords: Record<string, unknown> = {
    'document:document': {
      typeName: 'document',
      id: 'document:document',
      gridSize: 10,
      name: '',
    },
    'page:page1': {
      typeName: 'page',
      id: 'page:page1',
      name: 'Page 1',
      index: 'a1',
    },
    'shape:arrow1': {
      id: 'shape:arrow1',
      typeName: 'shape',
      type: 'arrow',
      x: 150.5,
      y: 300.25,
      rotation: 1.5707963,
      index: 'a2',
      parentId: 'page:page1',
      props: {
        start: { x: 0, y: 0 },
        end: { x: 200, y: 150 },
        bend: 25.4,
        color: 'light-violet',
        labelColor: 'black',
        fill: 'semi',
        dash: 'draw',
        size: 'm',
        arrowheadStart: 'none',
        arrowheadEnd: 'arrow',
        text: 'Data flow pipeline',
        font: 'sans',
      },
    },
    'instance_page_state:page:page1': {
      id: 'instance_page_state:page:page1',
      typeName: 'instance_page_state',
      pageId: 'page:page1',
      selectedShapeIds: ['shape:arrow1'],
      hintingShapeIds: [],
      erasingShapeIds: [],
      hoveredShapeId: null,
      editingShapeId: null,
      croppingShapeId: null,
      camera: { x: -50, y: -100, z: 1.25 },
    },
  };

  const board: Board = {
    metadata: {
      id: 'complex-tldraw-1',
      name: 'Complex tldraw Scene',
      createdAt: '2026-08-14T01:00:00.000Z',
      updatedAt: '2026-08-14T01:00:00.000Z',
      favorite: false,
    },
    document: {
      schemaVersion: 1,
      records: complexRecords,
    },
  };

  await repository.createBoard(board);
  const fetched = await repository.getBoard('complex-tldraw-1');

  assert.ok(fetched);
  assert.deepEqual(fetched.document.records, complexRecords);

  repository.close();
});

test('SQLiteBoardRepository - Memory Isolation (mutations do not leak to DB without update)', async () => {
  const repository = new SQLiteBoardRepository({ dbPath: ':memory:' });

  const board: Board = {
    metadata: {
      id: 'iso-1',
      name: 'Initial Unmodified',
      createdAt: '2026-08-14T00:00:00.000Z',
      updatedAt: '2026-08-14T00:00:00.000Z',
      favorite: false,
    },
    document: {
      schemaVersion: 1,
      records: { key1: 'value1' },
    },
  };

  await repository.createBoard(board);

  const fetched = await repository.getBoard('iso-1');
  assert.ok(fetched);

  // Mutate in-memory object
  fetched.metadata.name = 'Mutated In Memory';
  (fetched.document.records as Record<string, string>)['key1'] = 'mutated';

  // Read fresh copy from database
  const secondFetch = await repository.getBoard('iso-1');
  assert.ok(secondFetch);
  assert.equal(secondFetch.metadata.name, 'Initial Unmodified');
  assert.equal((secondFetch.document.records as Record<string, string>)['key1'], 'value1');

  repository.close();
});

test('SQLiteBoardRepository - Error handling & duplicate constraints', async () => {
  const repository = new SQLiteBoardRepository({ dbPath: ':memory:' });

  const board: Board = {
    metadata: {
      id: 'dup-1',
      name: 'Original',
      createdAt: '2026-08-14T00:00:00.000Z',
      updatedAt: '2026-08-14T00:00:00.000Z',
      favorite: false,
    },
    document: { schemaVersion: 1, records: {} },
  };

  await repository.createBoard(board);

  // Attempting to create duplicate ID must throw StorageOperationError
  await assert.rejects(
    async () => {
      await repository.createBoard(board);
    },
    (err: unknown) =>
      err instanceof StorageOperationError && err.message.includes('already exists'),
  );

  // Updating non-existent board must throw StorageOperationError
  await assert.rejects(
    async () => {
      await repository.updateBoard({
        ...board,
        metadata: { ...board.metadata, id: 'non-existent-id' },
      });
    },
    (err: unknown) =>
      err instanceof StorageOperationError && err.message.includes('does not exist'),
  );

  repository.close();
});

test('SQLiteBoardRepository - Soft delete, Trash query (deletedOnly), and Permanent deletion', async () => {
  const repository = new SQLiteBoardRepository({ dbPath: ':memory:' });

  const board: Board = {
    metadata: {
      id: 'trash-test-1',
      name: 'Trash Board',
      createdAt: '2026-08-14T00:00:00.000Z',
      updatedAt: '2026-08-14T00:00:00.000Z',
      favorite: false,
    },
    document: { schemaVersion: 1, records: {} },
  };

  await repository.createBoard(board);

  // Normal listing shows it
  let activeList = await repository.listBoards();
  assert.equal(activeList.length, 1);

  // Trash listing does not show it
  let trashList = await repository.listBoards({ deletedOnly: true });
  assert.equal(trashList.length, 0);

  // Soft delete it
  const softDeleted = await repository.deleteBoard('trash-test-1');
  assert.equal(softDeleted, true);

  // Normal listing no longer shows it
  activeList = await repository.listBoards();
  assert.equal(activeList.length, 0);

  // Trash listing shows it
  trashList = await repository.listBoards({ deletedOnly: true });
  assert.equal(trashList.length, 1);
  assert.equal(trashList[0]?.id, 'trash-test-1');

  // Permanently delete it
  const permDeleted = await repository.permanentDeleteBoard('trash-test-1');
  assert.equal(permDeleted, true);

  // Trash listing is now empty
  trashList = await repository.listBoards({ deletedOnly: true });
  assert.equal(trashList.length, 0);

  // Restoring non-existent board returns false
  const restoreFailed = await repository.restoreBoard('trash-test-1');
  assert.equal(restoreFailed, false);

  repository.close();
});
