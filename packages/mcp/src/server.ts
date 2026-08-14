import type { BoardService, CanvasService } from '@openboard/core';
import type {
  CanvasScreenshotOptions,
  CreateShapeInput,
  UpdateShapeInput,
} from '@openboard/shared';
import { BoardNotFoundError, CanvasOperationError } from '@openboard/shared';
import type { McpToolDefinition, McpToolCallResult } from './types.js';

/**
 * OpenBoardMcpServer encapsulates AI agent interactions via Model Context Protocol (MCP).
 *
 * Deep module invariants:
 * - Semantic standard tool interface designed for token efficiency and high agent discoverability.
 * - Zero knowledge of SQLite or storage mechanisms (delegates entirely to BoardService/CanvasService).
 * - Zero dependency on React, DOM, or browser environments (pure headless execution).
 * - Explicitly requires board_id for canvas operations (no implicit "active board").
 * - Provides actionable recovery guidance on errors.
 */
export class OpenBoardMcpServer {
  private readonly boardService: BoardService;
  private readonly canvasService: CanvasService;

  constructor(boardService: BoardService, canvasService: CanvasService) {
    this.boardService = boardService;
    this.canvasService = canvasService;
  }

  /**
   * Returns list of tools exposed to AI agents.
   */
  getTools(): McpToolDefinition[] {
    return [
      // ─── BOARD MANAGEMENT TOOLS ──────────────────────────────────────────
      {
        name: 'list_boards',
        description:
          'Discover and list whiteboard boards available in OpenBoard. Filter by favorites, recent, or trash, or search by title/description. Returns concise board summaries with IDs for subsequent operations.',
        inputSchema: {
          type: 'object',
          properties: {
            filter: {
              type: 'string',
              description:
                'Optional filter preset: "all" (default), "recent", "favorites", "trash"',
            },
            searchQuery: {
              type: 'string',
              description: 'Optional search keyword to filter board names or descriptions',
            },
            favoritesOnly: {
              type: 'boolean',
              description: 'Legacy filter: return only favorite boards',
            },
            deletedOnly: {
              type: 'boolean',
              description: 'Legacy filter: return only deleted boards in Trash',
            },
          },
        },
      },
      {
        name: 'create_board',
        description:
          'Create a new whiteboard board in OpenBoard. Returns the newly created board metadata and unique board_id, ready for adding shapes.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description:
                'Title/name for the whiteboard (e.g. "Payment Architecture", defaults to "Untitled Board")',
            },
            description: {
              type: 'string',
              description: 'Optional description of the whiteboard purpose or contents',
            },
            favorite: {
              type: 'boolean',
              description: 'Mark the board as a favorite bookmark',
            },
          },
        },
      },
      {
        name: 'get_board',
        description:
          'Retrieve metadata and high-level summary of a specific whiteboard board by Board ID. Note: to inspect shapes, coordinates, and relationships on the canvas, use get_canvas_state instead.',
        inputSchema: {
          type: 'object',
          properties: {
            board_id: {
              type: 'string',
              description:
                'The unique ID of the board to retrieve (from list_boards or create_board)',
            },
            boardId: {
              type: 'string',
              description: 'Alias for board_id',
            },
          },
        },
      },
      {
        name: 'rename_board',
        description: 'Rename an existing whiteboard board.',
        inputSchema: {
          type: 'object',
          properties: {
            board_id: {
              type: 'string',
              description: 'The unique ID of the board to rename',
            },
            boardId: {
              type: 'string',
              description: 'Alias for board_id',
            },
            name: {
              type: 'string',
              description: 'The new name for the whiteboard',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'duplicate_board',
        description:
          'Duplicate an existing whiteboard board with a new unique ID and identical canvas contents.',
        inputSchema: {
          type: 'object',
          properties: {
            board_id: {
              type: 'string',
              description: 'The unique ID of the board to duplicate',
            },
            boardId: {
              type: 'string',
              description: 'Alias for board_id',
            },
            name: {
              type: 'string',
              description:
                'Optional custom name for the duplicated board (defaults to "<Name> (Copy)")',
            },
          },
        },
      },
      {
        name: 'favorite_board',
        description: 'Set or toggle the favorite bookmark status for a whiteboard board.',
        inputSchema: {
          type: 'object',
          properties: {
            board_id: {
              type: 'string',
              description: 'The unique ID of the board',
            },
            boardId: {
              type: 'string',
              description: 'Alias for board_id',
            },
            favorite: {
              type: 'boolean',
              description:
                'Explicit favorite state (true/false). If omitted, toggles current favorite state.',
            },
          },
        },
      },
      {
        name: 'restore_board',
        description: 'Restore a deleted whiteboard board from Trash back to active workspace.',
        inputSchema: {
          type: 'object',
          properties: {
            board_id: {
              type: 'string',
              description: 'The unique ID of the deleted board in Trash to restore',
            },
            boardId: {
              type: 'string',
              description: 'Alias for board_id',
            },
          },
        },
      },
      {
        name: 'delete_board',
        description:
          'Delete a whiteboard board by ID (moves to Trash). Can be restored with restore_board.',
        inputSchema: {
          type: 'object',
          properties: {
            board_id: {
              type: 'string',
              description: 'The unique ID of the board to delete',
            },
            boardId: {
              type: 'string',
              description: 'Alias for board_id',
            },
          },
        },
      },

      // ─── CANVAS OPERATION & INSPECTION TOOLS ─────────────────────────────
      {
        name: 'get_canvas_state',
        description:
          'Inspect the semantic canvas state of a whiteboard board, returning shapes, geometries, text labels, coordinates, dimensions, bounds, and arrow relationship bindings (from/to connected shapes).',
        inputSchema: {
          type: 'object',
          properties: {
            board_id: {
              type: 'string',
              description: 'The unique ID of the board to inspect',
            },
            boardId: {
              type: 'string',
              description: 'Alias for board_id',
            },
          },
        },
      },
      {
        name: 'get_canvas_screenshot',
        description:
          'Capture a headless visual inspection screenshot of a whiteboard board as an SVG vector image (and base64 image block). Frames content automatically with padding, handles empty boards cleanly, and works without a running browser.',
        inputSchema: {
          type: 'object',
          properties: {
            board_id: {
              type: 'string',
              description: 'The unique ID of the board to capture',
            },
            boardId: {
              type: 'string',
              description: 'Alias for board_id',
            },
            format: {
              type: 'string',
              description: 'Output format: "svg" (default) or "data-url"',
            },
            theme: {
              type: 'string',
              description: 'Canvas theme: "light" (default) or "dark"',
            },
            padding: {
              type: 'number',
              description: 'Padding in pixels around canvas elements (default: 40)',
            },
            background: {
              type: 'boolean',
              description: 'Include grid dot canvas background (default: true)',
            },
            viewport: {
              type: 'object',
              description: 'Optional custom viewport bounds { x, y, width, height }',
              properties: {
                x: { type: 'number' },
                y: { type: 'number' },
                width: { type: 'number' },
                height: { type: 'number' },
              },
            },
          },
        },
      },
      {
        name: 'create_shapes',
        description:
          'Create one or more shapes on a specified OpenBoard board. Supports geometric shapes (rectangle, ellipse, triangle, diamond, cloud, star), notes, text, frames, and arrows (with optional "from" and "to" shape ID connections). Works whether or not the board is open in a browser.',
        inputSchema: {
          type: 'object',
          properties: {
            board_id: {
              type: 'string',
              description: 'The unique ID of the target board',
            },
            boardId: {
              type: 'string',
              description: 'Alias for board_id',
            },
            shapes: {
              type: 'array',
              description: 'List of shape definitions to create',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'Optional custom shape ID (e.g. "api_gateway", "db_postgres")',
                  },
                  type: {
                    type: 'string',
                    description:
                      'Shape type: "geo" (default), "note", "text", "arrow", "line", "frame"',
                  },
                  x: { type: 'number', description: 'X position on canvas' },
                  y: { type: 'number', description: 'Y position on canvas' },
                  w: {
                    type: 'number',
                    description: 'Width of shape in pixels (for geo, frame, and text shapes)',
                  },
                  h: {
                    type: 'number',
                    description:
                      'Height of shape in pixels (for geo and frame shapes; text and note shapes auto-size height)',
                  },
                  geo: {
                    type: 'string',
                    description:
                      'Geometry type for geo shape: "rectangle", "ellipse", "triangle", "diamond", "cloud", "star"',
                  },
                  text: { type: 'string', description: 'Text label or note content' },
                  color: {
                    type: 'string',
                    description:
                      'Color theme: "black", "blue", "green", "red", "yellow", "violet", "orange", "grey"',
                  },
                  fill: {
                    type: 'string',
                    description: 'Fill style: "none", "semi", "solid", "pattern"',
                  },
                  rotation: { type: 'number', description: 'Rotation in radians' },
                  from: {
                    type: 'string',
                    description:
                      'For arrows: source shape ID to connect arrow start to (e.g. "api_gateway")',
                  },
                  to: {
                    type: 'string',
                    description:
                      'For arrows: target shape ID to connect arrow end to (e.g. "db_postgres")',
                  },
                  start: {
                    type: 'object',
                    properties: { x: { type: 'number' }, y: { type: 'number' } },
                    description:
                      'For unbound arrows: start handle offset in pixels relative to shape (x, y). Defaults to { "x": 0, "y": 0 }',
                  },
                  end: {
                    type: 'object',
                    properties: { x: { type: 'number' }, y: { type: 'number' } },
                    description:
                      'For unbound arrows: end handle offset in pixels relative to shape (x, y) (e.g. { "x": 0, "y": 160 } for a vertical line or { "x": 120, "y": 0 } for horizontal). Defaults to { "x": 120, "y": 0 }',
                  },
                },
                required: ['x', 'y'],
              },
            },
          },
          required: ['shapes'],
        },
      },
      {
        name: 'update_shapes',
        description:
          'Update properties, positions (x, y), dimensions (w, h), text content, colors, fill, or connections of existing shapes on a whiteboard.',
        inputSchema: {
          type: 'object',
          properties: {
            board_id: {
              type: 'string',
              description: 'The unique ID of the target board',
            },
            boardId: {
              type: 'string',
              description: 'Alias for board_id',
            },
            shapes: {
              type: 'array',
              description: 'List of shape update definitions with target shape IDs',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description:
                      'ID of the shape to update (e.g. "shape:api_gateway" or "api_gateway")',
                  },
                  x: { type: 'number', description: 'New X position' },
                  y: { type: 'number', description: 'New Y position' },
                  w: {
                    type: 'number',
                    description: 'New width (for geo, frame, and text shapes)',
                  },
                  h: {
                    type: 'number',
                    description:
                      'New height (for geo and frame shapes; text and note shapes auto-size height)',
                  },
                  text: { type: 'string', description: 'Updated text content' },
                  color: { type: 'string', description: 'Updated color theme' },
                  fill: {
                    type: 'string',
                    description: 'Updated fill style ("none", "semi", "solid", "pattern")',
                  },
                  geo: { type: 'string', description: 'Updated geometry' },
                  rotation: { type: 'number', description: 'Updated rotation in radians' },
                  from: {
                    type: 'string',
                    description: 'For arrows: update source shape ID connection',
                  },
                  to: {
                    type: 'string',
                    description: 'For arrows: update target shape ID connection',
                  },
                  start: {
                    type: 'object',
                    properties: { x: { type: 'number' }, y: { type: 'number' } },
                    description:
                      'For unbound arrows: update start handle offset in pixels relative to shape (x, y)',
                  },
                  end: {
                    type: 'object',
                    properties: { x: { type: 'number' }, y: { type: 'number' } },
                    description:
                      'For unbound arrows: update end handle offset in pixels relative to shape (x, y)',
                  },
                },
                required: ['id'],
              },
            },
          },
          required: ['shapes'],
        },
      },
      {
        name: 'delete_shapes',
        description:
          'Delete one or more shapes from a whiteboard by shape ID. Automatically cleans up attached arrow bindings to maintain canvas integrity.',
        inputSchema: {
          type: 'object',
          properties: {
            board_id: {
              type: 'string',
              description: 'The unique ID of the target board',
            },
            boardId: {
              type: 'string',
              description: 'Alias for board_id',
            },
            shape_ids: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of shape IDs to delete',
            },
            shapeIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Alias for shape_ids',
            },
          },
        },
      },
    ];
  }

  /**
   * Dispatches a tool invocation to BoardService or CanvasService with agent-guided error handling.
   */
  async handleToolCall(
    name: string,
    args: Record<string, unknown> = {},
  ): Promise<McpToolCallResult> {
    try {
      const resolveBoardId = (): string => {
        const id = (args['board_id'] ?? args['boardId']) as string | undefined;
        if (!id || typeof id !== 'string' || id.trim().length === 0) {
          throw new Error(
            'Missing required parameter: "board_id". Call "list_boards" to discover valid board IDs or "create_board" to create a new board.',
          );
        }
        return id.trim();
      };

      switch (name) {
        // ─── BOARD MANAGEMENT ──────────────────────────────────────────────
        case 'list_boards': {
          const filter = typeof args['filter'] === 'string' ? args['filter'] : undefined;
          const favoritesOnly =
            filter === 'favorites' ||
            (typeof args['favoritesOnly'] === 'boolean' ? args['favoritesOnly'] : undefined);
          const deletedOnly =
            filter === 'trash' ||
            (typeof args['deletedOnly'] === 'boolean' ? args['deletedOnly'] : undefined);
          const searchQuery =
            typeof args['searchQuery'] === 'string' ? args['searchQuery'] : undefined;

          let sortBy: 'updatedAt' | 'createdAt' | 'name' | undefined = undefined;
          let sortDirection: 'asc' | 'desc' | undefined = undefined;
          if (filter === 'recent') {
            sortBy = 'updatedAt';
            sortDirection = 'desc';
          }

          const boards = await this.boardService.listBoards({
            favoritesOnly,
            deletedOnly,
            searchQuery,
            sortBy,
            sortDirection,
          });

          // Token-efficient clean summary representation
          const summaryList = boards.map((b) => ({
            id: b.id,
            name: b.name,
            description: b.description || undefined,
            updatedAt: b.updatedAt,
            favorite: b.favorite,
          }));

          return {
            content: [{ type: 'text', text: JSON.stringify(summaryList, null, 2) }],
          };
        }

        case 'create_board': {
          const nameParam = typeof args['name'] === 'string' ? args['name'] : undefined;
          const description =
            typeof args['description'] === 'string' ? args['description'] : undefined;
          const favorite = typeof args['favorite'] === 'boolean' ? args['favorite'] : undefined;
          const board = await this.boardService.createBoard({
            name: nameParam,
            description,
            favorite,
          });

          const result = {
            id: board.metadata.id,
            name: board.metadata.name,
            description: board.metadata.description,
            createdAt: board.metadata.createdAt,
            updatedAt: board.metadata.updatedAt,
            favorite: board.metadata.favorite,
          };

          return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
          };
        }

        case 'get_board': {
          const boardId = resolveBoardId();
          const board = await this.boardService.getBoard(boardId);
          const canvasState = await this.canvasService.getCanvasState(boardId);

          const result = {
            id: board.metadata.id,
            name: board.metadata.name,
            description: board.metadata.description,
            createdAt: board.metadata.createdAt,
            updatedAt: board.metadata.updatedAt,
            favorite: board.metadata.favorite,
            shapesCount: canvasState.shapesCount,
            bounds: canvasState.bounds,
          };

          return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
          };
        }

        case 'rename_board': {
          const boardId = resolveBoardId();
          const newName = args['name'] as string;
          if (!newName || typeof newName !== 'string' || newName.trim().length === 0) {
            throw new Error(
              'Missing required parameter: "name". Provide a new string title for the board.',
            );
          }
          const board = await this.boardService.renameBoard(boardId, newName.trim());
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    board_id: board.metadata.id,
                    name: board.metadata.name,
                    updatedAt: board.metadata.updatedAt,
                  },
                  null,
                  2,
                ),
              },
            ],
          };
        }

        case 'duplicate_board': {
          const boardId = resolveBoardId();
          const newName = typeof args['name'] === 'string' ? args['name'] : undefined;
          const duplicated = await this.boardService.duplicateBoard(boardId, newName);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    id: duplicated.metadata.id,
                    name: duplicated.metadata.name,
                    sourceBoardId: boardId,
                    createdAt: duplicated.metadata.createdAt,
                  },
                  null,
                  2,
                ),
              },
            ],
          };
        }

        case 'favorite_board': {
          const boardId = resolveBoardId();
          let board;
          if (typeof args['favorite'] === 'boolean') {
            board = await this.boardService.updateBoard(boardId, {
              favorite: args['favorite'],
            });
          } else {
            board = await this.boardService.toggleFavorite(boardId);
          }
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    board_id: board.metadata.id,
                    name: board.metadata.name,
                    favorite: board.metadata.favorite,
                  },
                  null,
                  2,
                ),
              },
            ],
          };
        }

        case 'restore_board': {
          const boardId = resolveBoardId();
          const success = await this.boardService.restoreBoard(boardId);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ board_id: boardId, restored: success }, null, 2),
              },
            ],
          };
        }

        case 'delete_board': {
          const boardId = resolveBoardId();
          const success = await this.boardService.deleteBoard(boardId);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ board_id: boardId, deleted: success }, null, 2),
              },
            ],
          };
        }

        // ─── CANVAS OPERATIONS & VISUAL INSPECTION ─────────────────────────
        case 'get_canvas_state': {
          const boardId = resolveBoardId();
          const state = await this.canvasService.getCanvasState(boardId);
          return {
            content: [{ type: 'text', text: JSON.stringify(state, null, 2) }],
          };
        }

        case 'get_canvas_screenshot': {
          const boardId = resolveBoardId();
          const options: CanvasScreenshotOptions = {
            format: (args['format'] as 'svg' | 'data-url') || 'svg',
            theme: (args['theme'] as 'light' | 'dark') || 'light',
            padding: typeof args['padding'] === 'number' ? args['padding'] : undefined,
            background: typeof args['background'] === 'boolean' ? args['background'] : true,
            viewport: args['viewport'] as CanvasScreenshotOptions['viewport'],
          };

          const screenshot = await this.canvasService.getCanvasScreenshot(boardId, options);

          const summaryText = `Screenshot captured for board "${boardId}" (${screenshot.width}x${screenshot.height}px, ${screenshot.shapesCount} shapes).\n\nSVG Source:\n${screenshot.svg}`;

          return {
            content: [
              {
                type: 'image',
                data: screenshot.data,
                mimeType: screenshot.mimeType,
              },
              {
                type: 'text',
                text: summaryText,
              },
            ],
          };
        }

        case 'create_shapes': {
          const boardId = resolveBoardId();
          const shapes = (args['shapes'] ?? []) as CreateShapeInput[];
          if (!Array.isArray(shapes) || shapes.length === 0) {
            throw new Error('Parameter "shapes" must be a non-empty array of shape definitions.');
          }
          const result = await this.canvasService.createShapes(boardId, shapes);
          return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
          };
        }

        case 'update_shapes': {
          const boardId = resolveBoardId();
          const shapes = (args['shapes'] ?? []) as UpdateShapeInput[];
          if (!Array.isArray(shapes) || shapes.length === 0) {
            throw new Error('Parameter "shapes" must be a non-empty array of shape updates.');
          }
          const result = await this.canvasService.updateShapes(boardId, shapes);
          return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
          };
        }

        case 'delete_shapes': {
          const boardId = resolveBoardId();
          const shapeIds = ((args['shape_ids'] ?? args['shapeIds'] ?? []) as string[]).filter(
            Boolean,
          );
          if (!Array.isArray(shapeIds) || shapeIds.length === 0) {
            throw new Error('Parameter "shape_ids" must be a non-empty array of shape ID strings.');
          }
          const result = await this.canvasService.deleteShapes(boardId, shapeIds);
          return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
          };
        }

        default:
          return {
            content: [
              {
                type: 'text',
                text: `Unknown tool "${name}". Use tools/list to see available OpenBoard MCP tools.`,
              },
            ],
            isError: true,
          };
      }
    } catch (err) {
      if (err instanceof BoardNotFoundError) {
        return {
          content: [
            {
              type: 'text',
              text: `Board not found. ${err.message}. Call "list_boards" to discover valid board IDs.`,
            },
          ],
          isError: true,
        };
      }
      if (err instanceof CanvasOperationError) {
        return {
          content: [
            {
              type: 'text',
              text: `Canvas operation error: ${err.message}`,
            },
          ],
          isError: true,
        };
      }
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: 'text', text: `Error executing "${name}": ${message}` }],
        isError: true,
      };
    }
  }
}
