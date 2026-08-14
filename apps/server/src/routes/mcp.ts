import { Router, type Request, type Response } from 'express';
import { randomUUID } from 'node:crypto';
import type { OpenBoardMcpServer } from '@openboard/mcp';
import type { JsonRpcRequest } from '@openboard/mcp';

interface SseSession {
  id: string;
  res: Response;
  createdAt: number;
}

/**
 * Creates the HTTP & Server-Sent Events (SSE) router for Model Context Protocol (MCP).
 *
 * Allows external AI agents to communicate with OpenBoard's MCP server over HTTP/SSE
 * when `openboard start` is running, complementing the stdio transport (`openboard mcp`).
 */
export function createMcpRouter(mcpServer: OpenBoardMcpServer): Router {
  const router = Router();
  const sseSessions = new Map<string, SseSession>();

  // 1. Discovery / Tools Query
  router.get('/tools', (_req: Request, res: Response) => {
    res.json({
      success: true,
      tools: mcpServer.getTools(),
    });
  });

  // 2. Standard JSON-RPC 2.0 HTTP POST Endpoint
  router.post('/', async (req: Request, res: Response) => {
    const rpcReq = req.body as JsonRpcRequest;

    if (!rpcReq || typeof rpcReq !== 'object' || rpcReq.jsonrpc !== '2.0') {
      res.status(400).json({
        jsonrpc: '2.0',
        id: rpcReq?.id ?? null,
        error: {
          code: -32600,
          message: 'Invalid Request: payload must be standard JSON-RPC 2.0 object with "jsonrpc": "2.0"',
        },
      });
      return;
    }

    const id = rpcReq.id ?? null;

    try {
      switch (rpcReq.method) {
        case 'initialize': {
          res.json({
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
          res.status(204).end();
          break;
        }

        case 'ping': {
          res.json({
            jsonrpc: '2.0',
            id,
            result: {},
          });
          break;
        }

        case 'tools/list': {
          const tools = mcpServer.getTools();
          res.json({
            jsonrpc: '2.0',
            id,
            result: {
              tools,
            },
          });
          break;
        }

        case 'tools/call': {
          const params = (rpcReq.params as Record<string, unknown>) || {};
          const toolName = params['name'] as string;
          const args = (params['arguments'] as Record<string, unknown>) || {};

          if (!toolName || typeof toolName !== 'string') {
            res.status(400).json({
              jsonrpc: '2.0',
              id,
              error: {
                code: -32602,
                message: 'Invalid params: "name" must be a string',
              },
            });
            return;
          }

          const callResult = await mcpServer.handleToolCall(toolName, args);
          res.json({
            jsonrpc: '2.0',
            id,
            result: callResult,
          });
          break;
        }

        default: {
          res.status(404).json({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32601,
              message: `Method not found: "${rpcReq.method}"`,
            },
          });
        }
      }
    } catch (err) {
      res.status(500).json({
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: err instanceof Error ? err.message : String(err),
        },
      });
    }
  });

  // 3. MCP Server-Sent Events (SSE) Transport Endpoint
  router.get('/sse', (req: Request, res: Response) => {
    const sessionId = randomUUID();

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    res.write(`event: endpoint\ndata: /api/mcp?sessionId=${sessionId}\n\n`);

    const session: SseSession = {
      id: sessionId,
      res,
      createdAt: Date.now(),
    };

    sseSessions.set(sessionId, session);

    const keepAliveInterval = setInterval(() => {
      res.write(': keepalive\n\n');
    }, 15000);

    req.on('close', () => {
      clearInterval(keepAliveInterval);
      sseSessions.delete(sessionId);
    });
  });

  return router;
}
