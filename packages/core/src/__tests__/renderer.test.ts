import test from 'node:test';
import assert from 'node:assert/strict';
import { HeadlessSvgRenderer } from '../renderer.js';
import type { BoardDocument } from '@openboard/shared';

test('HeadlessSvgRenderer - renders empty whiteboard with clean placeholder', () => {
  const emptyDoc: BoardDocument = {
    schemaVersion: 1,
    records: {},
  };

  const result = HeadlessSvgRenderer.render(emptyDoc, 'board_empty', {
    theme: 'light',
  });

  assert.equal(result.boardId, 'board_empty');
  assert.equal(result.format, 'svg');
  assert.equal(result.mimeType, 'image/svg+xml');
  assert.equal(result.shapesCount, 0);
  assert.ok(result.width > 0);
  assert.ok(result.height > 0);
  assert.ok(result.svg.includes('<svg'));
  assert.ok(result.svg.includes('Empty Whiteboard'));
  assert.ok(result.data.length > 0);
});

test('HeadlessSvgRenderer - renders geometric shapes, notes, texts, frames, and arrows with bindings', () => {
  const doc: BoardDocument = {
    schemaVersion: 1,
    records: {
      'shape:api_server': {
        id: 'shape:api_server',
        typeName: 'shape',
        type: 'geo',
        x: 100,
        y: 100,
        props: {
          geo: 'rectangle',
          w: 180,
          h: 90,
          color: 'blue',
          fill: 'semi',
          text: 'API Server',
        },
      },
      'shape:postgres_db': {
        id: 'shape:postgres_db',
        typeName: 'shape',
        type: 'geo',
        x: 400,
        y: 100,
        props: {
          geo: 'rectangle',
          w: 180,
          h: 90,
          color: 'green',
          fill: 'semi',
          text: 'PostgreSQL Database',
        },
      },
      'shape:sticky_note': {
        id: 'shape:sticky_note',
        typeName: 'shape',
        type: 'note',
        x: 100,
        y: 250,
        props: {
          w: 180,
          h: 180,
          color: 'yellow',
          text: 'Remember to enable connection pooling',
        },
      },
      'shape:app_frame': {
        id: 'shape:app_frame',
        typeName: 'shape',
        type: 'frame',
        x: 50,
        y: 50,
        props: {
          w: 600,
          h: 420,
          name: 'Backend Infrastructure',
        },
      },
      'shape:conn_arrow': {
        id: 'shape:conn_arrow',
        typeName: 'shape',
        type: 'arrow',
        x: 280,
        y: 145,
        props: {
          color: 'black',
          text: 'queries',
          end: { x: 120, y: 0 },
        },
      },
      'binding:arrow_start': {
        id: 'binding:arrow_start',
        typeName: 'binding',
        type: 'arrow',
        fromId: 'shape:conn_arrow',
        toId: 'shape:api_server',
        props: { terminal: 'start' },
      },
      'binding:arrow_end': {
        id: 'binding:arrow_end',
        typeName: 'binding',
        type: 'arrow',
        fromId: 'shape:conn_arrow',
        toId: 'shape:postgres_db',
        props: { terminal: 'end' },
      },
    },
  };

  const lightResult = HeadlessSvgRenderer.render(doc, 'board_arch', {
    theme: 'light',
    padding: 30,
  });

  assert.equal(lightResult.shapesCount, 5);
  assert.ok(lightResult.svg.includes('API Server'));
  assert.ok(lightResult.svg.includes('PostgreSQL Database'));
  assert.ok(lightResult.svg.includes('Remember to enable connection pooling'));
  assert.ok(lightResult.svg.includes('Backend Infrastructure'));
  assert.ok(lightResult.svg.includes('queries'));
  assert.ok(lightResult.svg.includes('marker-end="url(#arrowhead-black)"'));

  // Test Dark Theme
  const darkResult = HeadlessSvgRenderer.render(doc, 'board_arch', {
    theme: 'dark',
    padding: 20,
  });

  assert.equal(darkResult.shapesCount, 5);
  assert.ok(darkResult.svg.includes('#18181b')); // Dark theme background
  assert.ok(darkResult.svg.includes('API Server'));
});

test('HeadlessSvgRenderer - supports custom viewport bounds', () => {
  const doc: BoardDocument = {
    schemaVersion: 1,
    records: {
      'shape:box': {
        id: 'shape:box',
        typeName: 'shape',
        type: 'geo',
        x: 0,
        y: 0,
        props: { w: 100, h: 100, text: 'Box' },
      },
    },
  };

  const result = HeadlessSvgRenderer.render(doc, 'board_vp', {
    viewport: { x: 50, y: 50, width: 400, height: 300 },
    padding: 0,
  });

  assert.equal(result.width, 400);
  assert.equal(result.height, 300);
  assert.ok(result.svg.includes('viewBox="50 50 400 300"'));
});
