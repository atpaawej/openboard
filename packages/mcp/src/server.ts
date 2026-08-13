import type { BoardService } from '@openboard/core';
import type { McpToolDefinition, McpToolCallResult } from './types.js';

/**
 * OpenBoardMcpServer encapsulates AI agent interactions via Model Context Protocol.
 *
 * Deep module: agents communicate through standard tool interfaces,
 * while the server translates those requests directly into domain actions
 * on the shared BoardService.
 */
export class OpenBoardMcpServer {
  private readonly boardService: BoardService;

  constructor(boardService: BoardService) {
    this.boardService = boardService;
  }

  /**
   * Returns list of tools exposed to AI agents.
   */
  getTools(): McpToolDefinition[] {
    return [
      {
        name: 'list_boards',
        description: 'List all whiteboard boards available in OpenBoard.',
        inputSchema: {
          type: 'object',
          properties: {
            favoritesOnly: {
              type: 'boolean',
              description: 'Filter only favorite boards',
            },
            searchQuery: {
              type: 'string',
              description: 'Optional search text to filter board names',
            },
          },
        },
      },
      {
        name: 'get_board',
        description: 'Get full board details and canvas document by Board ID.',
        inputSchema: {
          type: 'object',
          properties: {
            boardId: {
              type: 'string',
              description: 'The unique ID of the board to retrieve',
            },
          },
          required: ['boardId'],
        },
      },
      {
        name: 'create_board',
        description: 'Create a new whiteboard board.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the new board',
            },
            description: {
              type: 'string',
              description: 'Optional description of the board',
            },
          },
        },
      },
    ];
  }

  /**
   * Dispatches a tool invocation to the BoardService.
   */
  async handleToolCall(name: string, args: Record<string, unknown>): Promise<McpToolCallResult> {
    try {
      switch (name) {
        case 'list_boards': {
          const boards = await this.boardService.listBoards({
            favoritesOnly: typeof args['favoritesOnly'] === 'boolean' ? args['favoritesOnly'] : undefined,
            searchQuery: typeof args['searchQuery'] === 'string' ? args['searchQuery'] : undefined,
          });
          return {
            content: [{ type: 'text', text: JSON.stringify(boards, null, 2) }],
          };
        }
        case 'get_board': {
          const boardId = args['boardId'] as string;
          const board = await this.boardService.getBoard(boardId);
          return {
            content: [{ type: 'text', text: JSON.stringify(board, null, 2) }],
          };
        }
        case 'create_board': {
          const name = typeof args['name'] === 'string' ? args['name'] : undefined;
          const description = typeof args['description'] === 'string' ? args['description'] : undefined;
          const board = await this.boardService.createBoard({ name, description });
          return {
            content: [{ type: 'text', text: JSON.stringify(board, null, 2) }],
          };
        }
        default:
          return {
            content: [{ type: 'text', text: `Unknown tool: ${name}` }],
            isError: true,
          };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: 'text', text: `Error executing ${name}: ${message}` }],
        isError: true,
      };
    }
  }
}
