# Generic MCP Client Integration Guide

OpenBoard connects to any client or agent framework supporting the Model Context Protocol (MCP) over `stdio`.

---

## 1. Installation

Install OpenBoard globally via npm:

```bash
npm install -g openboard
```

---

## 2. OpenBoard Startup

Start the local OpenBoard web dashboard and server at any time:

```bash
openboard start
```

For AI agent operations via MCP, your MCP client launches `openboard mcp` directly over stdio.

---

## 3. Universal Stdio Server Parameters & Configuration

For any generic MCP client, configure the following parameters:

- **Command / Executable:** `openboard` (or absolute path to `openboard` binary)
- **Arguments:** `["mcp"]`
- **Transport:** `stdio`
- **Protocol Version:** `2024-11-05` (JSON-RPC 2.0)

### Generic JSON Configuration Format

```json
{
  "mcpServers": {
    "openboard": {
      "command": "openboard",
      "args": ["mcp"]
    }
  }
}
```

### Equivalent Shell Invocation

```bash
openboard mcp
```

---

## 4. Verification

Verify that your generic MCP client can initialize the connection and query available tools:

1. Send an `initialize` JSON-RPC request.
2. Send a `tools/list` request.
3. Confirm that all 13 tools are returned (`list_boards`, `create_board`, `get_board`, `rename_board`, `duplicate_board`, `favorite_board`, `delete_board`, `restore_board`, `get_canvas_state`, `get_canvas_screenshot`, `create_shapes`, `update_shapes`, `delete_shapes`).

---

## 5. Example Workflows & Prompts

### Standard Multi-Step Interaction Workflow

```text
User:
List my OpenBoard boards.

Agent:
[Calls list_boards tool]
Found boards: "System Design", "Roadmap".

User:
Create a board called "Auth Pipeline" and draw OAuth2 authorization code flow.

Agent:
[Calls create_board with { name: "Auth Pipeline" }]
[Calls create_shapes with Client, Auth Server, Resource Server shapes and sequential arrows]
Created components and connected OAuth flow.

User:
Inspect the canvas and return a visual screenshot.

Agent:
[Calls get_canvas_state and get_canvas_screenshot]
Returned semantic layout and SVG vector screenshot.
```

---

## 6. Troubleshooting & Environment Guarantees

- **Working Directory:** OpenBoard does not require a specific working directory.
- **Database File:** By default uses `~/.openboard/openboard.db`. To specify a custom database, pass `--db /path/to/openboard.db` in `args`.
- **Streams:** Standard output (`stdout`) emits JSON-RPC protocol frames only. Diagnostics and logs are strictly sent to `stderr`.
- **Browser Optional:** A running browser window is **not** required for MCP agent operations.
