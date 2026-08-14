import { SQLiteBoardRepository } from '@openboard/storage';
import { BoardService, CanvasService } from '@openboard/core';
import { OpenBoardMcpServer, StdioMcpServerTransport } from '@openboard/mcp';

export interface McpOptions {
  db?: string;
}

/**
 * Starts the OpenBoard MCP server over stdio for external AI agent integration.
 *
 * Invariants:
 * - Emits strictly JSON-RPC protocol frames to stdout.
 * - Routes all diagnostic logs strictly to stderr.
 * - Connects directly to local SQLite storage for full persistence without requiring a browser.
 */
export async function mcpCommand(options: McpOptions = {}): Promise<void> {
  try {
    const repository = new SQLiteBoardRepository({ dbPath: options.db });
    const boardService = new BoardService(repository);
    const canvasService = new CanvasService(boardService);
    const mcpServer = new OpenBoardMcpServer(boardService, canvasService);

    const transport = new StdioMcpServerTransport(mcpServer, {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
    });

    transport.start();

    // Log startup to stderr only
    process.stderr.write('[OpenBoard MCP] Server started on stdio transport.\n');

    const cleanup = () => {
      transport.stop();
      repository.close();
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.stdin.on('close', cleanup);
  } catch (err) {
    process.stderr.write(
      `[OpenBoard MCP] Failed to start: ${err instanceof Error ? err.message : String(err)}\n`,
    );
    process.exit(1);
  }
}
