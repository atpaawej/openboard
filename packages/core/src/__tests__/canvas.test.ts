import test from 'node:test';
import assert from 'node:assert/strict';
import { SQLiteBoardRepository } from '@openboard/storage';
import { BoardService } from '../service.js';
import { CanvasService } from '../canvas.js';
import { BoardEventBus } from '../events.js';

test('CanvasService & HeadlessCanvasEngine - full headless CRUD and state queries', async () => {
  const repository = new SQLiteBoardRepository({ dbPath: ':memory:' });
  const eventBus = new BoardEventBus();
  const boardService = new BoardService(repository, eventBus);
  const canvasService = new CanvasService(boardService, eventBus);

  // Track emitted events
  const canvasEvents: Array<{ boardId: string; reason?: string }> = [];
  eventBus.on('canvas:updated', (payload) => {
    canvasEvents.push({ boardId: payload.boardId, reason: payload.reason });
  });

  // 1. Create a board
  const board = await boardService.createBoard({ name: 'Architecture Diagram' });
  const boardId = board.metadata.id;

  // 2. Initial state should be empty
  const initialState = await canvasService.getCanvasState(boardId);
  assert.equal(initialState.boardId, boardId);
  assert.equal(initialState.shapesCount, 0);
  assert.equal(initialState.bounds.width, 0);
  assert.equal(initialState.bounds.height, 0);

  // 3. Create shapes on canvas (rectangle, ellipse, note, text, arrow, frame)
  const createResult = await canvasService.createShapes(boardId, [
    {
      id: 'box_api',
      type: 'geo',
      geo: 'rectangle',
      x: 100,
      y: 100,
      w: 200,
      h: 100,
      color: 'blue',
      fill: 'semi',
      text: 'API Gateway',
    },
    {
      id: 'box_db',
      type: 'geo',
      geo: 'ellipse',
      x: 400,
      y: 100,
      w: 120,
      h: 120,
      color: 'green',
      fill: 'solid',
      text: 'Database',
    },
    {
      id: 'note_memo',
      type: 'note',
      x: 600,
      y: 100,
      color: 'yellow',
      text: 'Important schema notes',
    },
    {
      id: 'arrow_conn',
      type: 'arrow',
      x: 300,
      y: 150,
      text: 'gRPC Query',
      start: { x: 0, y: 0 },
      end: { x: 100, y: 0 },
      color: 'black',
    },
  ]);

  assert.equal(createResult.createdCount, 4);
  assert.equal(createResult.shapes.length, 4);
  assert.equal(canvasEvents.length, 1);
  assert.equal(canvasEvents[0]?.boardId, boardId);

  // 4. Query canvas state after creation
  const populatedState = await canvasService.getCanvasState(boardId);
  assert.equal(populatedState.shapesCount, 4);
  assert.ok(populatedState.bounds.width > 0, 'Bounding box width must be greater than zero');
  assert.ok(populatedState.bounds.height > 0, 'Bounding box height must be greater than zero');

  const apiShape = populatedState.shapes.find((s) => s.id === 'shape:box_api');
  assert.ok(apiShape, 'API Gateway shape must exist');
  assert.equal(apiShape.text, 'API Gateway');
  assert.equal(apiShape.color, 'blue');
  assert.equal(apiShape.fill, 'semi');
  assert.equal(apiShape.geo, 'rectangle');

  const dbShape = populatedState.shapes.find((s) => s.id === 'shape:box_db');
  assert.ok(dbShape, 'DB shape must exist');
  assert.equal(dbShape.text, 'Database');
  assert.equal(dbShape.geo, 'ellipse');

  const noteShape = populatedState.shapes.find((s) => s.id === 'shape:note_memo');
  assert.ok(noteShape, 'Note shape must exist');
  assert.equal(noteShape.text, 'Important schema notes');

  // 5. Update shapes
  const updateResult = await canvasService.updateShapes(boardId, [
    {
      id: 'box_api',
      x: 120,
      y: 130,
      text: 'API Gateway v2',
      color: 'violet',
    },
  ]);

  assert.equal(updateResult.updatedCount, 1);
  assert.equal(canvasEvents.length, 2);

  const updatedState = await canvasService.getCanvasState(boardId);
  const updatedApiShape = updatedState.shapes.find((s) => s.id === 'shape:box_api');
  assert.equal(updatedApiShape?.x, 120);
  assert.equal(updatedApiShape?.y, 130);
  assert.equal(updatedApiShape?.text, 'API Gateway v2');
  assert.equal(updatedApiShape?.color, 'violet');

  // 6. Delete shapes
  const deleteResult = await canvasService.deleteShapes(boardId, ['box_db']);
  assert.equal(deleteResult.deletedCount, 1);
  assert.equal(deleteResult.deletedShapeIds[0], 'shape:box_db');
  assert.equal(canvasEvents.length, 3);

  const afterDeleteState = await canvasService.getCanvasState(boardId);
  assert.equal(afterDeleteState.shapesCount, 3);
  assert.equal(
    afterDeleteState.shapes.some((s) => s.id === 'shape:box_db'),
    false,
  );

  // 7. Verify persistence in SQLite across service recreation
  const reloadedService = new BoardService(repository);
  const reloadedCanvas = new CanvasService(reloadedService);
  const persistedState = await reloadedCanvas.getCanvasState(boardId);
  assert.equal(persistedState.shapesCount, 3);
  const persistedApi = persistedState.shapes.find((s) => s.id === 'shape:box_api');
  assert.equal(persistedApi?.text, 'API Gateway v2');

  repository.close();
});

test('CanvasService - unbound arrow creation, updating and accurate bounds computation', async () => {
  const repository = new SQLiteBoardRepository({ dbPath: ':memory:' });
  const boardService = new BoardService(repository);
  const canvasService = new CanvasService(boardService);

  const board = await boardService.createBoard({ name: 'Arrow Test Board' });
  const boardId = board.metadata.id;

  // 1. Create unbound vertical arrow (Issue #1 repro values)
  await canvasService.createShapes(boardId, [
    {
      id: 'vertical_arrow',
      type: 'arrow',
      x: 400,
      y: 210,
      start: { x: 0, y: 0 },
      end: { x: 0, y: 160 },
      text: 'Vertical Flow',
    },
  ]);

  const state1 = await canvasService.getCanvasState(boardId);
  assert.equal(state1.shapesCount, 1);
  const arrow1 = state1.shapes[0]!;
  assert.deepEqual(arrow1.start, { x: 0, y: 0 });
  assert.deepEqual(arrow1.end, { x: 0, y: 160 });
  // Bounds should be: minX=400, minY=210, maxX=400, maxY=370, width=0, height=160
  assert.equal(state1.bounds.minX, 400);
  assert.equal(state1.bounds.minY, 210);
  assert.equal(state1.bounds.maxX, 400);
  assert.equal(state1.bounds.maxY, 370);
  assert.equal(state1.bounds.width, 0);
  assert.equal(state1.bounds.height, 160);

  // 2. Update unbound arrow start/end
  await canvasService.updateShapes(boardId, [
    {
      id: 'vertical_arrow',
      start: { x: 10, y: 20 },
      end: { x: 50, y: 180 },
    },
  ]);

  const state2 = await canvasService.getCanvasState(boardId);
  const updatedArrow = state2.shapes[0]!;
  assert.deepEqual(updatedArrow.start, { x: 10, y: 20 });
  assert.deepEqual(updatedArrow.end, { x: 50, y: 180 });
  // Bounds: minX=410, minY=230, maxX=450, maxY=390, width=40, height=160
  assert.equal(state2.bounds.minX, 410);
  assert.equal(state2.bounds.minY, 230);
  assert.equal(state2.bounds.maxX, 450);
  assert.equal(state2.bounds.maxY, 390);
  assert.equal(state2.bounds.width, 40);
  assert.equal(state2.bounds.height, 160);

  repository.close();
});

test('CanvasService - Issue #2: update_shapes modifies arrow start/end handles and unbinds cleanly', async () => {
  const repository = new SQLiteBoardRepository({ dbPath: ':memory:' });
  const boardService = new BoardService(repository);
  const canvasService = new CanvasService(boardService);

  const board = await boardService.createBoard({ name: 'Arrow Binding Board' });
  const boardId = board.metadata.id;

  // 1. Create two boxes and a connected arrow
  await canvasService.createShapes(boardId, [
    { id: 'box_a', type: 'geo', x: 100, y: 100, w: 100, h: 80, text: 'A' },
    { id: 'box_b', type: 'geo', x: 300, y: 100, w: 100, h: 80, text: 'B' },
    {
      id: 'conn_1',
      type: 'arrow',
      x: 100,
      y: 100,
      from: 'box_a',
      to: 'box_b',
      text: 'Original Link',
    },
  ]);

  const state1 = await canvasService.getCanvasState(boardId);
  const arrow1 = state1.shapes.find((s) => s.id === 'shape:conn_1')!;
  assert.equal(arrow1.from, 'shape:box_a');
  assert.equal(arrow1.to, 'shape:box_b');

  // 2. Call update_shapes with new start/end handle points and unbind
  await canvasService.updateShapes(boardId, [
    {
      id: 'conn_1',
      start: { x: 50, y: 40 },
      end: { x: 250, y: 40 },
      from: '',
      to: '',
      text: 'Detached Offset Link',
    },
  ]);

  const state2 = await canvasService.getCanvasState(boardId);
  const updatedArrow = state2.shapes.find((s) => s.id === 'shape:conn_1')!;
  assert.equal(updatedArrow.from, undefined, 'Arrow should no longer have start binding');
  assert.equal(updatedArrow.to, undefined, 'Arrow should no longer have end binding');
  assert.deepEqual(updatedArrow.start, { x: 50, y: 40 });
  assert.deepEqual(updatedArrow.end, { x: 250, y: 40 });
  assert.equal(updatedArrow.text, 'Detached Offset Link');

  repository.close();
});

test('CanvasService - Issue #3: text shape accepts w and h props gracefully without throwing unexpected property errors', async () => {
  const repository = new SQLiteBoardRepository({ dbPath: ':memory:' });
  const boardService = new BoardService(repository);
  const canvasService = new CanvasService(boardService);

  const board = await boardService.createBoard({ name: 'Text Shape Board' });
  const boardId = board.metadata.id;

  // 1. Create text shape with explicit w and h (Repro from Issue #3)
  const createResult = await canvasService.createShapes(boardId, [
    {
      id: 'title_text',
      type: 'text',
      x: 50,
      y: 50,
      w: 300,
      h: 60,
      text: 'Title of Architecture',
      color: 'blue',
    },
    {
      id: 'auto_text',
      type: 'text',
      x: 50,
      y: 150,
      text: 'Short Label',
    },
  ]);

  assert.equal(createResult.createdCount, 2);

  const state = await canvasService.getCanvasState(boardId);
  const titleShape = state.shapes.find((s) => s.id === 'shape:title_text')!;
  assert.equal(titleShape.text, 'Title of Architecture');
  assert.equal(titleShape.w, 300);
  assert.ok(titleShape.h !== undefined && titleShape.h >= 24, 'Height should be reported reasonably');

  const autoShape = state.shapes.find((s) => s.id === 'shape:auto_text')!;
  assert.equal(autoShape.text, 'Short Label');
  assert.ok(autoShape.w !== undefined && autoShape.w >= 32, 'Width should not report tiny auto 8 value');

  // 2. Update text shape with new w and h
  const updateResult = await canvasService.updateShapes(boardId, [
    {
      id: 'title_text',
      w: 400,
      h: 80,
      text: 'Updated Title of Architecture',
    },
  ]);

  assert.equal(updateResult.updatedCount, 1);
  const stateAfterUpdate = await canvasService.getCanvasState(boardId);
  const updatedTitle = stateAfterUpdate.shapes.find((s) => s.id === 'shape:title_text')!;
  assert.equal(updatedTitle.w, 400);
  assert.equal(updatedTitle.text, 'Updated Title of Architecture');

  repository.close();
});
