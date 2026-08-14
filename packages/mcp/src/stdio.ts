import readline from 'node:readline';
import type { Readable, Writable } from 'node:stream';
import type { OpenBoardMcpServer } from './server.js';
import type { JsonRpcRequest, JsonRpcResponse } from './types.js';

export interface StdioServerTransportOptions {
  stdin?: Readable;
  stdout?: Writable;
  stderr?: Writable;
}

/**
 * StdioMcpServerTransport provides standard JSON-RPC 2.0 stdio transport
 * for Model Context Protocol (MCP) communication with external AI agents.
 *
 * Invariants:
 * - Exclusively emits valid newline-delimited JSON-RPC to stdout.
 * - Routes all debug and error logging strictly to stderr to prevent frame corruption.
 * - Handles `initialize`, `tools/list`, `tools/call`, and `ping` methods seamlessly.
 */
export class StdioMcpServerTransport {
  private readonly mcpServer: OpenBoardMcpServer;
  private readonly stdin: Readable;
  private readonly stdout: Writable;
  private readonly stderr: Writable;
  private rl: readline.Interface | null = null;
  private running = false;

  constructor(mcpServer: OpenBoardMcpServer, options: StdioServerTransportOptions = {}) {
    this.mcpServer = mcpServer;
    this.stdin = options.stdin ?? process.stdin;
    this.stdout = options.stdout ?? process.stdout;
    this.stderr = options.stderr ?? process.stderr;
  }

  /**
   * Starts listening for JSON-RPC messages on stdin.
   */
  start(): void {
    if (this.running) return;
    this.running = true;

    this.rl = readline.createInterface({
      input: this.stdin,
      terminal: false,
    });

    this.rl.on('line', (line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      this.handleMessage(trimmed);
    });

    this.rl.on('close', () => {
      this.running = false;
    });
  }

  /**
   * Stops the transport.
   */
  stop(): void {
    if (!this.running) return;
    this.running = false;
    if (this.rl) {
      this.rl.close();
      this.rl = null;
    }
  }

  /**
   * Dispatches and processes an incoming raw JSON-RPC frame.
   */
  async handleMessage(raw: string): Promise<void> {
    let req: JsonRpcRequest;
    try {
      req = JSON.parse(raw);
    } catch (err) {
      this.sendResponse({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: 'Parse error: invalid JSON',
        },
      });
      return;
    }

    if (!req || typeof req !== 'object' || req.jsonrpc !== '2.0') {
      this.sendResponse({
        jsonrpc: '2.0',
        id: req?.id ?? null,
        error: {
          code: -32600,
          message: 'Invalid Request: missing jsonrpc "2.0"',
        },
      });
      return;
    }

    const id = req.id ?? null;

    try {
      switch (req.method) {
        case 'initialize': {
          this.sendResponse({
            jsonrpc: '2.0',
            id,
            result: {
              protocolVersion: '2024-11-05',
              capabilities: {
                tools: {},
              },
              serverInfo: {
                name: 'openboard',
                version: '0.1.0',
              },
            },
          });
          break;
        }

        case 'notifications/initialized': {
          // Notification from client that initialization is complete
          break;
        }

        case 'ping': {
          this.sendResponse({
            jsonrpc: '2.0',
            id,
            result: {},
          });
          break;
        }

        case 'tools/list': {
          const tools = this.mcpServer.getTools();
          this.sendResponse({
            jsonrpc: '2.0',
            id,
            result: {
              tools,
            },
          });
          break;
        }

        case 'tools/call': {
          const params = req.params || {};
          const toolName = params['name'] as string;
          const args = (params['arguments'] as Record<string, unknown>) || {};

          if (!toolName || typeof toolName !== 'string') {
            this.sendResponse({
              jsonrpc: '2.0',
              id,
              error: {
                code: -32602,
                message: 'Invalid params: "name" must be a string',
              },
            });
            return;
          }

          const callResult = await this.mcpServer.handleToolCall(toolName, args);
          this.sendResponse({
            jsonrpc: '2.0',
            id,
            result: callResult,
          });
          break;
        }

        default: {
          // If it's a notification without id, don't return error
          if (id === null || id === undefined) {
            return;
          }
          this.sendResponse({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32601,
              message: `Method not found: ${req.method}`,
            },
          });
          break;
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.sendResponse({
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: `Internal error: ${message}`,
        },
      });
    }
  }

  private sendResponse(response: JsonRpcResponse): void {
    try {
      this.stdout.write(JSON.stringify(response) + '\n');
    } catch (err) {
      this.stderr.write(
        `[OpenBoard MCP Transport Error]: Failed to write response: ${String(err)}\n`,
      );
    }
  }
}
