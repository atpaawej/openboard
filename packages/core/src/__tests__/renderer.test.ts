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

test('HeadlessSvgRenderer - renders unbound arrows with exact start and end pixel coordinates (Issue #1)', () => {
  // Repro from Issue #1: Vertical arrow at x=400, y=210 with start={0,0}, end={0,160}
  const doc: BoardDocument = {
    schemaVersion: 1,
    records: {
      'shape:unbound_vertical_arrow': {
        id: 'shape:unbound_vertical_arrow',
        typeName: 'shape',
        type: 'arrow',
        x: 400,
        y: 210,
        props: {
          color: 'blue',
          text: 'Step 1',
          start: { x: 0, y: 0 },
          end: { x: 0, y: 160 },
        },
      },
    },
  };

  const result = HeadlessSvgRenderer.render(doc, 'board_arrow_test', {
    theme: 'light',
    padding: 20,
  });

  // Expected line from (400, 210) to (400, 370) - strictly vertical with no +120px x-offset
  assert.ok(
    result.svg.includes('<line x1="400" y1="210" x2="400" y2="370"'),
    `SVG should contain vertical line with x1=400 and x2=400. Rendered SVG:\n${result.svg}`,
  );

  // Expected label midpoint: midX = (400 + 400)/2 = 400, midY = (210 + 370)/2 = 290
  assert.ok(
    result.svg.includes('x="400" y="294"'),
    `Label text should be centered at midX=400 and midY+4=294. Rendered SVG:\n${result.svg}`,
  );
});

test('HeadlessSvgRenderer - renders unbound arrows with explicit start offsets and small/negative coordinates', () => {
  const doc: BoardDocument = {
    schemaVersion: 1,
    records: {
      'shape:arrow_custom': {
        id: 'shape:arrow_custom',
        typeName: 'shape',
        type: 'arrow',
        x: 100,
        y: 200,
        props: {
          color: 'black',
          start: { x: 15, y: 25 },
          end: { x: 55, y: 85 },
        },
      },
      'shape:arrow_control_1': {
        id: 'shape:arrow_control_1',
        typeName: 'shape',
        type: 'arrow',
        x: 400,
        y: 210,
        props: {
          color: 'green',
          start: { x: 0, y: 0 },
          end: { x: 2, y: 0 },
        },
      },
      'shape:arrow_control_2': {
        id: 'shape:arrow_control_2',
        typeName: 'shape',
        type: 'arrow',
        x: 400,
        y: 210,
        props: {
          color: 'red',
          start: { x: 0, y: 0 },
          end: { x: 1, y: 2 },
        },
      },
    },
  };

  const result = HeadlessSvgRenderer.render(doc, 'board_arrow_offsets', {
    theme: 'light',
    padding: 10,
  });

  // arrow_custom: (100 + 15, 200 + 25) -> (100 + 55, 200 + 85) = (115, 225) -> (155, 285)
  assert.ok(result.svg.includes('<line x1="115" y1="225" x2="155" y2="285"'));
  // arrow_control_1: (400, 210) -> (402, 210)
  assert.ok(result.svg.includes('<line x1="400" y1="210" x2="402" y2="210"'));
  // arrow_control_2: (400, 210) -> (401, 212)
  assert.ok(result.svg.includes('<line x1="400" y1="210" x2="401" y2="212"'));
});
