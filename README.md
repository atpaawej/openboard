# OpenBoard

Local-first personal whiteboard workspace for developers and external AI agents.

```bash
# Install globally from npm
npm install -g openboard-app

# Launch the workspace server & dashboard
openboard start

# Or run directly without installing
npx openboard-app start
```

OpenBoard runs entirely on your local machine. Whiteboards and canvas metadata are stored in your local SQLite database at:

```text
~/.openboard/openboard.db
```

---

## ✦ Connect Your AI Agent via MCP

OpenBoard includes a native Model Context Protocol (MCP) server over `stdio` for external AI coding agents.

### Generic MCP stdio Configuration

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

The configuration tells your MCP client to launch the local `openboard mcp` command. Stdio JSON-RPC frames are exchanged directly with the server runtime without requiring a running browser.

### Equivalent Shell Command

```bash
openboard mcp
```

---

## ✦ What is OpenBoard?

OpenBoard is a lightweight, local-first infinite whiteboard pairing an interactive **tldraw** canvas with an **MCP stdio server**. It allows developers and autonomous AI coding agents (Claude Code, Cursor, OpenCode, Codex, OpenClaw, Hermes) to create, inspect, and update software architecture diagrams, workflows, and visual notes collaboratively.

### Key Features

- **Local-First & 100% Private:** All data resides in a local SQLite file (`~/.openboard/openboard.db`). Zero telemetry, zero cloud lock-in, zero external API dependencies.
- **Twenty-Inspired Dark UI:** Deep neutral near-black surfaces (`#0e0e11`), vibrant electric blue accents (`#2563eb`), refined typography, and purposeful micro-animations.
- **AI Agent Native:** Autonomous coding agents can discover, create, update, and organize whiteboards using 13 high-level semantic tools.
- **Headless Canvas Inspection:** Agents can inspect semantic canvas structures and render vector SVG screenshots without a browser or GUI environment.
- **Live SSE Projection:** When a human has a board open in their browser, agent modifications stream seamlessly in real time via Server-Sent Events (SSE).
- **Keyboard-Driven Workflow:** Press `N` to create a whiteboard, `/` to focus search, `Esc` to clear/dismiss, and `Enter` to confirm.
- **Browser Optional for Agents:** AI agents can manipulate boards whether the web UI is open or closed.

---

## ✦ Architecture Flow

```text
External AI Agent
       │
       │ MCP client
       ▼
stdio
       │
       ▼
openboard mcp
       │
       ▼
OpenBoard MCP Server
       │
       ▼
BoardService / CanvasService
       │
       ├───────────────┐
       ▼               ▼
    SQLite          Canvas
                       │
                     tldraw
                       │
                 optional browser
```

### Architectural Guarantees:

1. **MCP does not connect directly to SQLite:** All operations pass through domain-validated `BoardService` and `CanvasService`.
2. **MCP does not connect directly to React:** Canvas operations execute against a headless tldraw store engine.
3. **MCP does not require a browser:** Boards can be created, updated, and queried while no browser window is running.
4. **Explicit `board_id` targeting:** Every canvas operation explicitly references the target board ID.
5. **Live Projection:** If a user opens the board in a browser, changes made by external agents project into the active view instantly.

---

## ✦ Supported MCP Clients & Quick Setup

| AI Client / Tool | Setup Command or Configuration Path                           | Format                         |
| :--------------- | :------------------------------------------------------------ | :----------------------------- |
| **Claude Code**  | `claude mcp add openboard --command="openboard" --args="mcp"` | CLI / `~/.claude.json`         |
| **Cursor**       | `~/.cursor/mcp.json`                                          | JSON (`mcpServers`)            |
| **OpenCode**     | `~/.config/opencode/opencode.jsonc`                           | JSONC (`mcp.openboard`)        |
| **OpenAI Codex** | `~/.codex/config.toml`                                        | TOML (`mcp_servers.openboard`) |
| **OpenClaw**     | `~/.openclaw/config.json`                                     | JSON (`mcpServers`)            |
| **Hermes Agent** | `~/.hermes/config.yaml`                                       | YAML (`mcp_servers`)           |
| **Generic MCP**  | Any client supporting stdio MCP JSON-RPC 2.0                  | `openboard mcp`                |

---

## ✦ MCP Tools Reference (13 Semantic Tools)

OpenBoard exposes 13 semantic tools to connected agents:

### Board Lifecycle & Organization

1. `list_boards`: List whiteboards with filtering (all, recent, favorites, trash) and keyword search.
2. `create_board`: Create a new whiteboard with title and optional description.
3. `get_board`: Retrieve board metadata, document summary, and timestamps.
4. `rename_board`: Rename an existing whiteboard.
5. `duplicate_board`: Clone a board and its complete canvas document.
6. `favorite_board`: Bookmark or toggle favorite status.
7. `delete_board`: Move a whiteboard to Trash (soft delete).
8. `restore_board`: Recover a deleted whiteboard from Trash.

### Canvas Inspection & Manipulation

9. `get_canvas_state`: Retrieve semantic shapes, positions, dimensions, text, and arrow bindings.
10. `get_canvas_screenshot`: Capture a headless vector SVG visual screenshot of the canvas.
11. `create_shapes`: Create shapes (geo rectangles, ellipses, notes, text, frames, arrows).
12. `update_shapes`: Modify shape positions, dimensions, text, colors, or arrow connections.
13. `delete_shapes`: Remove shapes and automatically clean attached bindings.

---

## ✦ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>N</kbd> | Open New Whiteboard modal |
| <kbd>/</kbd> | Focus dashboard search bar |
| <kbd>Esc</kbd> | Clear search input / Dismiss modal or context menu |
| <kbd>Enter</kbd> | Submit modal form / Open selected board |

---

## ✦ CLI Reference

```bash
openboard start      # Start local workspace server & open web dashboard (default port: 3000)
openboard mcp        # Start Model Context Protocol server on stdio for AI agents
openboard info       # Display local configuration, database path, and agent MCP details
openboard -v         # Display installed version
openboard --help     # Display CLI help
```

### Options for `openboard start`

- `-p, --port <number>`: Port to listen on (default: `3000`)
- `-h, --host <host>`: Host address to bind to (default: `localhost`)
- `--db <path>`: Custom SQLite database path (default: `~/.openboard/openboard.db`)
- `--no-open`: Do not automatically open browser on startup

---

## ✦ Complete Documentation

Detailed technical guides are available in the repository and in the interactive web UI at `http://localhost:3000/docs`:

- [Getting Started](docs/getting-started.md)
- [System Architecture](docs/architecture.md)
- [MCP Architecture](docs/mcp-architecture.md)
- [MCP Overview](docs/mcp/overview.md)
- [MCP Tools Reference](docs/mcp/tools.md)
- [MCP Stdio Connection](docs/mcp/connection.md)
- [Troubleshooting Guide](docs/mcp/troubleshooting.md)
- **Agent Integration Guides:**
  - [Claude Code](docs/agents/claude-code.md)
  - [Cursor](docs/agents/cursor.md)
  - [OpenCode](docs/agents/opencode.md)
  - [OpenAI Codex / Agents](docs/agents/codex.md)
  - [OpenClaw](docs/agents/openclaw.md)
  - [Hermes Agent](docs/agents/hermes.md)
  - [Generic MCP Client](docs/agents/generic-mcp.md)

---

## ✦ Development & Monorepo

```bash
# Clone the repository
git clone https://github.com/atpaawej/openboard.git
cd openboard

# Install dependencies
npm install

# Run test suite across all workspaces
npm run test

# Typecheck and build
npm run typecheck
npm run build
```

---

## ✦ License

MIT License — Copyright (c) 2026 OpenBoard Contributors. See [LICENSE](LICENSE) for details.
