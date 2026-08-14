# OpenAI Codex / Agents SDK Integration Guide

OpenAI models and coding agents (via OpenAI Agents SDK, Codex CLI, or custom MCP wrappers) connect to OpenBoard through the standard stdio transport.

---

## 1. Installation

Install OpenBoard globally via npm:

```bash
npm install -g openboard
```

---

## 2. OpenBoard Startup

Start the local OpenBoard web dashboard and server:

```bash
openboard start
```

For AI agent operations via MCP, the agent runner executes `openboard mcp` directly over stdio.

---

## 3. MCP Configuration

### Configuration File (`~/.codex/config.toml`)

If using Codex CLI or configured OpenAI agents, define the server under `mcp_servers`:

```toml
[mcp_servers.openboard]
command = "openboard"
args = ["mcp"]
```

### Programmatic SDK Integration (TypeScript / Node.js)

When integrating OpenBoard programmatically into OpenAI Agent SDK workflows:

```typescript
import { StdioServerParameters } from '@modelcontextprotocol/sdk/client/stdio.js';

const openboardServer: StdioServerParameters = {
  command: 'openboard',
  args: ['mcp'],
};
```

---

## 4. Verification

Verify the MCP connection programmatically or via CLI:

```bash
openboard info
```

Confirm that the agent runner detects the 13 exposed tools (`list_boards`, `create_board`, `create_shapes`, etc.).

---

## 5. Example Workflows & Prompts

### Multi-Step Data Ingestion Pipeline Workflow

```text
User:
List my OpenBoard boards.

Agent:
[Calls list_boards]
Found 1 board: "Untitled Board".

User:
Create a board called "Data Ingestion Pipeline".

Agent:
[Calls create_board with { name: "Data Ingestion Pipeline" }]
Created board (ID: "board_pipe_01").

User:
Draw an ingestion pipeline with arrows pointing from Source -> Queue -> Worker -> Postgres.

Agent:
[Calls create_shapes on "board_pipe_01" with 4 components and 3 connecting arrows]
Successfully drawn: Source, Queue, Worker, and Postgres connected in order.

User:
Inspect the canvas and take a screenshot to verify arrow bindings.

Agent:
[Calls get_canvas_state and get_canvas_screenshot]
Verified 4 nodes and 3 arrow bindings. SVG screenshot captured.
```

---

## 6. Troubleshooting

- **Executable path:** If `openboard` is not in the system environment, provide the full binary path in `command`.
- **Headless execution:** The MCP server works 100% headless with SQLite persistence. Starting the web UI is optional.
- **Database path:** Defaults to `~/.openboard/openboard.db`. Pass `--db <path>` in args for custom paths.
