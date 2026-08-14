/**
 * MCP Tool definitions and schemas for OpenBoard AI Agent interaction.
 */
export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export type McpContentBlock =
  | {
      type: 'text';
      text: string;
    }
  | {
      type: 'image';
      data: string; // Base64 encoded image or svg data
      mimeType: string; // e.g. 'image/svg+xml' | 'image/png'
      text?: string;
    };

export interface McpToolCallResult {
  content: McpContentBlock[];
  isError?: boolean;
}

/**
 * Standard JSON-RPC 2.0 message structures for stdio transport.
 */
export interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

export interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}
