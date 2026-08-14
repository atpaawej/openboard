import type {
  BoardDocument,
  CanvasScreenshotOptions,
  CanvasScreenshotResult,
} from '@openboard/shared';
import { HeadlessCanvasEngine, extractTextFromRichText } from './canvas.js';
import type { TLStore } from 'tldraw';

/**
 * Color palette configurations matching tldraw aesthetics.
 */
interface ColorTheme {
  stroke: string;
  fillSemi: string;
  fillSolid: string;
  text: string;
  noteBg: string;
  noteBorder: string;
}

const LIGHT_PALETTE: Record<string, ColorTheme> = {
  black: {
    stroke: '#1e1e1e',
    fillSemi: 'rgba(30, 30, 30, 0.12)',
    fillSolid: '#1e1e1e',
    text: '#1e1e1e',
    noteBg: '#f4f4f5',
    noteBorder: '#d4d4d8',
  },
  blue: {
    stroke: '#2563eb',
    fillSemi: 'rgba(37, 99, 235, 0.14)',
    fillSolid: '#2563eb',
    text: '#1d4ed8',
    noteBg: '#dbeafe',
    noteBorder: '#93c5fd',
  },
  green: {
    stroke: '#16a34a',
    fillSemi: 'rgba(22, 163, 74, 0.14)',
    fillSolid: '#16a34a',
    text: '#15803d',
    noteBg: '#dcfce7',
    noteBorder: '#86efac',
  },
  red: {
    stroke: '#dc2626',
    fillSemi: 'rgba(220, 38, 38, 0.14)',
    fillSolid: '#dc2626',
    text: '#b91c1c',
    noteBg: '#fee2e2',
    noteBorder: '#fca5a5',
  },
  yellow: {
    stroke: '#ca8a04',
    fillSemi: 'rgba(202, 138, 4, 0.18)',
    fillSolid: '#ca8a04',
    text: '#854d0e',
    noteBg: '#fef9c3',
    noteBorder: '#fde047',
  },
  violet: {
    stroke: '#9333ea',
    fillSemi: 'rgba(147, 51, 234, 0.14)',
    fillSolid: '#9333ea',
    text: '#7e22ce',
    noteBg: '#f3e8ff',
    noteBorder: '#d8b4fe',
  },
  orange: {
    stroke: '#ea580c',
    fillSemi: 'rgba(234, 88, 12, 0.15)',
    fillSolid: '#ea580c',
    text: '#c2410c',
    noteBg: '#ffedd5',
    noteBorder: '#fdba74',
  },
  grey: {
    stroke: '#71717a',
    fillSemi: 'rgba(113, 113, 122, 0.14)',
    fillSolid: '#71717a',
    text: '#52525b',
    noteBg: '#f4f4f5',
    noteBorder: '#e4e4e7',
  },
};

const DARK_PALETTE: Record<string, ColorTheme> = {
  black: {
    stroke: '#f4f4f5',
    fillSemi: 'rgba(244, 244, 245, 0.15)',
    fillSolid: '#f4f4f5',
    text: '#f4f4f5',
    noteBg: '#27272a',
    noteBorder: '#3f3f46',
  },
  blue: {
    stroke: '#60a5fa',
    fillSemi: 'rgba(96, 165, 250, 0.2)',
    fillSolid: '#3b82f6',
    text: '#93c5fd',
    noteBg: '#1e3a8a',
    noteBorder: '#2563eb',
  },
  green: {
    stroke: '#4ade80',
    fillSemi: 'rgba(74, 222, 128, 0.2)',
    fillSolid: '#22c55e',
    text: '#86efac',
    noteBg: '#14532d',
    noteBorder: '#16a34a',
  },
  red: {
    stroke: '#f87171',
    fillSemi: 'rgba(248, 113, 113, 0.2)',
    fillSolid: '#ef4444',
    text: '#fca5a5',
    noteBg: '#7f1d1d',
    noteBorder: '#dc2626',
  },
  yellow: {
    stroke: '#facc15',
    fillSemi: 'rgba(250, 204, 21, 0.22)',
    fillSolid: '#eab308',
    text: '#fef08a',
    noteBg: '#713f12',
    noteBorder: '#ca8a04',
  },
  violet: {
    stroke: '#c084fc',
    fillSemi: 'rgba(192, 132, 252, 0.2)',
    fillSolid: '#a855f7',
    text: '#d8b4fe',
    noteBg: '#581c87',
    noteBorder: '#9333ea',
  },
  orange: {
    stroke: '#fb923c',
    fillSemi: 'rgba(251, 146, 60, 0.2)',
    fillSolid: '#f97316',
    text: '#fed7aa',
    noteBg: '#7c2d12',
    noteBorder: '#ea580c',
  },
  grey: {
    stroke: '#a1a1aa',
    fillSemi: 'rgba(161, 161, 170, 0.2)',
    fillSolid: '#71717a',
    text: '#d4d4d8',
    noteBg: '#27272a',
    noteBorder: '#52525b',
  },
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Headless SVG renderer for OpenBoard canvas documents.
 * Produces clean, vector SVG representations completely outside the browser.
 */
export class HeadlessSvgRenderer {
  /**
   * Renders a BoardDocument or TLStore into a full SVG graphic.
   */
  static render(
    source: BoardDocument | TLStore,
    boardId: string,
    options: CanvasScreenshotOptions = {},
  ): CanvasScreenshotResult {
    const store =
      'getStoreSnapshot' in source
        ? (source as TLStore)
        : HeadlessCanvasEngine.createStore(source as BoardDocument);

    const theme = options.theme || 'light';
    const isDark = theme === 'dark';
    const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;
    const padding = typeof options.padding === 'number' ? Math.max(0, options.padding) : 40;
    const withBg = options.background !== false;

    const allRecords = store.allRecords();
    const shapes = allRecords.filter((r) => r.typeName === 'shape') as Array<Record<string, any>>;
    const bindings = allRecords.filter((r) => r.typeName === 'binding') as Array<
      Record<string, any>
    >;

    // Index shapes by ID for fast binding lookups
    const shapesById = new Map<string, Record<string, any>>();
    for (const shape of shapes) {
      shapesById.set(shape.id, shape);
    }

    // Determine bounding box
    let minX = 0;
    let minY = 0;
    let maxX = 800;
    let maxY = 500;
    let width = 800;
    let height = 500;

    if (options.viewport) {
      minX = options.viewport.x;
      minY = options.viewport.y;
      width = options.viewport.width;
      height = options.viewport.height;
      maxX = minX + width;
      maxY = minY + height;
    } else if (shapes.length > 0) {
      minX = Infinity;
      minY = Infinity;
      maxX = -Infinity;
      maxY = -Infinity;

      for (const shape of shapes) {
        const x = typeof shape.x === 'number' && !isNaN(shape.x) ? shape.x : Number(shape.x) || 0;
        const y = typeof shape.y === 'number' && !isNaN(shape.y) ? shape.y : Number(shape.y) || 0;
        const props = shape.props || {};

        if (shape.type === 'arrow') {
          const startBinding = bindings.find(
            (b) => b.fromId === shape.id && b.props?.terminal === 'start',
          );
          const endBinding = bindings.find(
            (b) => b.fromId === shape.id && b.props?.terminal === 'end',
          );

          const startOffsetX =
            typeof props.start?.x === 'number' && !isNaN(props.start.x)
              ? props.start.x
              : Number(props.start?.x) || 0;
          const startOffsetY =
            typeof props.start?.y === 'number' && !isNaN(props.start.y)
              ? props.start.y
              : Number(props.start?.y) || 0;
          const endOffsetX =
            typeof props.end?.x === 'number' && !isNaN(props.end.x)
              ? props.end.x
              : props.end?.x !== undefined
                ? Number(props.end.x) || 0
                : 120;
          const endOffsetY =
            typeof props.end?.y === 'number' && !isNaN(props.end.y)
              ? props.end.y
              : Number(props.end?.y) || 0;

          let startX = x + startOffsetX;
          let startY = y + startOffsetY;
          let endX = x + endOffsetX;
          let endY = y + endOffsetY;

          if (startBinding) {
            const targetShape = shapesById.get(startBinding.toId);
            if (targetShape) {
              const tw = Number(targetShape.props?.w) || 100;
              const th = Number(targetShape.props?.h) || 80;
              startX = Number(targetShape.x) + tw / 2;
              startY = Number(targetShape.y) + th / 2;
            }
          }

          if (endBinding) {
            const targetShape = shapesById.get(endBinding.toId);
            if (targetShape) {
              const tw = Number(targetShape.props?.w) || 100;
              const th = Number(targetShape.props?.h) || 80;
              endX = Number(targetShape.x) + tw / 2;
              endY = Number(targetShape.y) + th / 2;
            }
          }

          minX = Math.min(minX, startX, endX);
          minY = Math.min(minY, startY, endY);
          maxX = Math.max(maxX, startX, endX);
          maxY = Math.max(maxY, startY, endY);
        } else {
          const w = Number(props.w) || (shape.type === 'note' ? 200 : 120);
          const h = Number(props.h) || (shape.type === 'note' ? 200 : 80);

          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x + w);
          maxY = Math.max(maxY, y + h);
        }
      }

      width = Math.max(100, Math.round(maxX - minX));
      height = Math.max(100, Math.round(maxY - minY));
    }

    const viewBoxX = Math.round(minX - padding);
    const viewBoxY = Math.round(minY - padding);
    const viewBoxW = Math.round(width + padding * 2);
    const viewBoxH = Math.round(height + padding * 2);

    const scale = options.scale || 1;
    const outputWidth = Math.round(viewBoxW * scale);
    const outputHeight = Math.round(viewBoxH * scale);

    // Build SVG elements
    const elements: string[] = [];

    // Background
    const bgColor = isDark ? '#18181b' : '#fafafa';
    const dotColor = isDark ? '#27272a' : '#e4e4e7';
    if (withBg) {
      elements.push(
        `<rect x="${viewBoxX}" y="${viewBoxY}" width="${viewBoxW}" height="${viewBoxH}" fill="${bgColor}" />`,
      );
      elements.push(
        `<rect x="${viewBoxX}" y="${viewBoxY}" width="${viewBoxW}" height="${viewBoxH}" fill="url(#dot-grid)" />`,
      );
    }

    // Render empty state if no shapes
    if (shapes.length === 0) {
      const cx = viewBoxX + viewBoxW / 2;
      const cy = viewBoxY + viewBoxH / 2;
      const textMuted = isDark ? '#71717a' : '#a1a1aa';
      elements.push(`
        <g transform="translate(${cx}, ${cy})" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
          <circle cx="0" cy="-24" r="32" fill="${isDark ? '#27272a' : '#f4f4f5'}" stroke="${isDark ? '#3f3f46' : '#e4e4e7'}" stroke-width="1.5" />
          <path d="M-10 -24 L10 -24 M0 -34 L0 -14" stroke="${textMuted}" stroke-width="2" stroke-linecap="round" />
          <text y="30" font-size="16" font-weight="600" fill="${isDark ? '#e4e4e7' : '#3f3f46'}">Empty Whiteboard</text>
          <text y="52" font-size="13" fill="${textMuted}">Use create_shapes to add components to this board</text>
        </g>
      `);
    } else {
      // 1. First pass: Render frames (containers)
      for (const shape of shapes) {
        if (shape.type === 'frame') {
          elements.push(this.renderShape(shape, palette, isDark));
        }
      }

      // 2. Second pass: Render standard shapes, notes, texts, draws
      for (const shape of shapes) {
        if (shape.type !== 'frame' && shape.type !== 'arrow') {
          elements.push(this.renderShape(shape, palette, isDark));
        }
      }

      // 3. Third pass: Render arrows & connectors on top
      for (const shape of shapes) {
        if (shape.type === 'arrow') {
          elements.push(this.renderArrow(shape, shapesById, bindings, palette, isDark));
        }
      }
    }

    // Build SVG markers & defs
    const defs = this.buildDefs(palette, isDark, dotColor);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxX} ${viewBoxY} ${viewBoxW} ${viewBoxH}" width="${outputWidth}" height="${outputHeight}">
  ${defs}
  ${elements.join('\n  ')}
</svg>`;

    const base64Data = Buffer.from(svg, 'utf-8').toString('base64');

    return {
      boardId,
      format: options.format || 'svg',
      width: outputWidth,
      height: outputHeight,
      svg,
      data: base64Data,
      mimeType: 'image/svg+xml',
      shapesCount: shapes.length,
    };
  }

  /**
   * Constructs SVG definitions (patterns, markers, filters).
   */
  private static buildDefs(
    palette: Record<string, ColorTheme>,
    isDark: boolean,
    dotColor: string,
  ): string {
    const markers: string[] = [];

    for (const [colorName, theme] of Object.entries(palette)) {
      markers.push(`
    <marker id="arrowhead-${colorName}" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${theme.stroke}" />
    </marker>`);
    }

    return `<defs>
    <pattern id="dot-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="${dotColor}" />
    </pattern>
    <pattern id="hatch-pattern" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="8" stroke="${isDark ? '#71717a' : '#94a3b8'}" stroke-width="1.5" />
    </pattern>
    <filter id="note-shadow" x="-8%" y="-8%" width="120%" height="124%">
      <feDropShadow dx="1" dy="3" stdDeviation="2.5" flood-color="${isDark ? '#000000' : '#64748b'}" flood-opacity="${isDark ? '0.4' : '0.12'}" />
    </filter>
    <filter id="card-shadow" x="-6%" y="-6%" width="116%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="${isDark ? '#000000' : '#0f172a'}" flood-opacity="${isDark ? '0.35' : '0.08'}" />
    </filter>
    ${markers.join('')}
  </defs>`;
  }

  /**
   * Renders an individual non-arrow shape.
   */
  private static renderShape(
    shape: Record<string, any>,
    palette: Record<string, ColorTheme>,
    isDark: boolean,
  ): string {
    const type = shape.type || 'geo';
    const x = Number(shape.x) || 0;
    const y = Number(shape.y) || 0;
    const rotation = Number(shape.rotation) || 0;
    const opacity = shape.opacity !== undefined ? Number(shape.opacity) : 1;
    const props = shape.props || {};

    const colorKey = props.color || 'black';
    const theme = palette[colorKey] || palette.black || LIGHT_PALETTE.black!;
    const fillType = props.fill || 'none';

    let fillAttr = 'none';
    if (fillType === 'solid') {
      fillAttr = theme.fillSolid;
    } else if (fillType === 'semi') {
      fillAttr = theme.fillSemi;
    } else if (fillType === 'pattern') {
      fillAttr = 'url(#hatch-pattern)';
    }

    const strokeColor = theme.stroke;
    const strokeWidth = 2;

    let textContent = '';
    if (props.richText) {
      textContent = extractTextFromRichText(props.richText);
    } else if (typeof props.text === 'string') {
      textContent = props.text;
    } else if (typeof props.name === 'string') {
      textContent = props.name;
    }

    const transform =
      rotation !== 0
        ? `transform="rotate(${(rotation * 180) / Math.PI} ${x + (Number(props.w) || 100) / 2} ${y + (Number(props.h) || 100) / 2})"`
        : '';
    const opacityAttr = opacity < 1 ? `opacity="${opacity}"` : '';

    switch (type) {
      case 'note': {
        const w = Number(props.w) || 200;
        const h = Number(props.h) || 200;
        const noteBg = theme.noteBg;
        const noteBorder = theme.noteBorder;
        const noteText = isDark ? '#f4f4f5' : '#18181b';

        const lines = textContent.split('\n');
        const tspans = lines
          .map(
            (line, idx) =>
              `<tspan x="${x + 16}" dy="${idx === 0 ? 0 : 20}">${escapeXml(line)}</tspan>`,
          )
          .join('');

        return `
    <g ${transform} ${opacityAttr}>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${noteBg}" stroke="${noteBorder}" stroke-width="1.5" filter="url(#note-shadow)" />
      <text x="${x + 16}" y="${y + 32}" font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="500" fill="${noteText}">
        ${tspans}
      </text>
    </g>`;
      }

      case 'frame': {
        const w = Number(props.w) || 400;
        const h = Number(props.h) || 300;
        const frameName = props.name || textContent || 'Frame';
        return `
    <g ${transform} ${opacityAttr}>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="none" stroke="${isDark ? '#52525b' : '#94a3b8'}" stroke-width="1.5" stroke-dasharray="6,4" />
      <text x="${x + 10}" y="${y - 8}" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="${isDark ? '#a1a1aa' : '#64748b'}">
        ${escapeXml(frameName)}
      </text>
    </g>`;
      }

      case 'text': {
        const lines = textContent.split('\n');
        const textColor = theme.text;
        const tspans = lines
          .map(
            (line, idx) => `<tspan x="${x}" dy="${idx === 0 ? 0 : 24}">${escapeXml(line)}</tspan>`,
          )
          .join('');

        return `
    <g ${transform} ${opacityAttr}>
      <text x="${x}" y="${y + 20}" font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" font-size="16" font-weight="500" fill="${textColor}">
        ${tspans}
      </text>
    </g>`;
      }

      case 'geo':
      default: {
        const w = Number(props.w) || 160;
        const h = Number(props.h) || 100;
        const geo = props.geo || 'rectangle';

        let shapeSvg = '';
        if (geo === 'ellipse') {
          shapeSvg = `<ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w / 2}" ry="${h / 2}" fill="${fillAttr}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />`;
        } else if (geo === 'triangle') {
          shapeSvg = `<polygon points="${x + w / 2},${y} ${x + w},${y + h} ${x},${y + h}" fill="${fillAttr}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="round" />`;
        } else if (geo === 'diamond') {
          shapeSvg = `<polygon points="${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}" fill="${fillAttr}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="round" />`;
        } else if (geo === 'cloud') {
          shapeSvg = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="${fillAttr}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-dasharray="4,2" />`;
        } else if (geo === 'star') {
          const cx = x + w / 2;
          const cy = y + h / 2;
          const r = Math.min(w, h) / 2;
          const points: string[] = [];
          for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI) / 5 - Math.PI / 2;
            const currentR = i % 2 === 0 ? r : r * 0.45;
            points.push(`${cx + currentR * Math.cos(angle)},${cy + currentR * Math.sin(angle)}`);
          }
          shapeSvg = `<polygon points="${points.join(' ')}" fill="${fillAttr}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="round" />`;
        } else {
          // rectangle (default)
          shapeSvg = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fillAttr}" stroke="${strokeColor}" stroke-width="${strokeWidth}" filter="url(#card-shadow)" />`;
        }

        let textSvg = '';
        if (textContent.trim().length > 0) {
          const lines = textContent.split('\n');
          const textColor = fillType === 'solid' ? (isDark ? '#18181b' : '#ffffff') : theme.text;
          const textY = y + h / 2 - ((lines.length - 1) * 18) / 2 + 5;
          const tspans = lines
            .map(
              (line, idx) =>
                `<tspan x="${x + w / 2}" dy="${idx === 0 ? 0 : 18}">${escapeXml(line)}</tspan>`,
            )
            .join('');

          textSvg = `
      <text x="${x + w / 2}" y="${textY}" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="600" fill="${textColor}">
        ${tspans}
      </text>`;
        }

        return `
    <g ${transform} ${opacityAttr}>
      ${shapeSvg}
      ${textSvg}
    </g>`;
      }
    }
  }

  /**
   * Renders an arrow shape, resolving connected shapes and bindings.
   */
  private static renderArrow(
    arrowShape: Record<string, any>,
    shapesById: Map<string, Record<string, any>>,
    bindings: Array<Record<string, any>>,
    palette: Record<string, ColorTheme>,
    isDark: boolean,
  ): string {
    const props = arrowShape.props || {};
    const colorKey = props.color || 'black';
    const theme = palette[colorKey] || palette.black || LIGHT_PALETTE.black!;
    const strokeColor = theme.stroke;

    const arrowX =
      typeof arrowShape.x === 'number' && !isNaN(arrowShape.x)
        ? arrowShape.x
        : Number(arrowShape.x) || 0;
    const arrowY =
      typeof arrowShape.y === 'number' && !isNaN(arrowShape.y)
        ? arrowShape.y
        : Number(arrowShape.y) || 0;

    const startOffsetX =
      typeof props.start?.x === 'number' && !isNaN(props.start.x)
        ? props.start.x
        : Number(props.start?.x) || 0;
    const startOffsetY =
      typeof props.start?.y === 'number' && !isNaN(props.start.y)
        ? props.start.y
        : Number(props.start?.y) || 0;
    const endOffsetX =
      typeof props.end?.x === 'number' && !isNaN(props.end.x)
        ? props.end.x
        : props.end?.x !== undefined
          ? Number(props.end.x) || 0
          : 120;
    const endOffsetY =
      typeof props.end?.y === 'number' && !isNaN(props.end.y)
        ? props.end.y
        : Number(props.end?.y) || 0;

    let startX = arrowX + startOffsetX;
    let startY = arrowY + startOffsetY;
    let endX = arrowX + endOffsetX;
    let endY = arrowY + endOffsetY;

    // Look up bindings for this arrow
    const startBinding = bindings.find(
      (b) => b.fromId === arrowShape.id && b.props?.terminal === 'start',
    );
    const endBinding = bindings.find(
      (b) => b.fromId === arrowShape.id && b.props?.terminal === 'end',
    );

    if (startBinding) {
      const targetShape = shapesById.get(startBinding.toId);
      if (targetShape) {
        const tw = Number(targetShape.props?.w) || 100;
        const th = Number(targetShape.props?.h) || 80;
        startX = Number(targetShape.x) + tw / 2;
        startY = Number(targetShape.y) + th / 2;
      }
    }

    if (endBinding) {
      const targetShape = shapesById.get(endBinding.toId);
      if (targetShape) {
        const tw = Number(targetShape.props?.w) || 100;
        const th = Number(targetShape.props?.h) || 80;
        endX = Number(targetShape.x) + tw / 2;
        endY = Number(targetShape.y) + th / 2;
      }
    }

    // Text label on arrow
    let textContent = '';
    if (props.richText) {
      textContent = extractTextFromRichText(props.richText);
    } else if (typeof props.text === 'string') {
      textContent = props.text;
    }

    const dx = endX - startX;
    const dy = endY - startY;
    const dist = Math.hypot(dx, dy);

    let labelSvg = '';
    if (textContent.trim().length > 0 && dist > 30) {
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const badgeBg = isDark ? '#27272a' : '#ffffff';
      const badgeBorder = isDark ? '#3f3f46' : '#cbd5e1';
      const badgeText = theme.text;
      const textLen = textContent.length * 8 + 16;

      labelSvg = `
      <rect x="${midX - textLen / 2}" y="${midY - 11}" width="${textLen}" height="22" rx="11" fill="${badgeBg}" stroke="${badgeBorder}" stroke-width="1" />
      <text x="${midX}" y="${midY + 4}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="500" fill="${badgeText}">
        ${escapeXml(textContent)}
      </text>`;
    }

    return `
    <g>
      <line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" marker-end="url(#arrowhead-${colorKey})" />
      ${labelSvg}
    </g>`;
  }
}
