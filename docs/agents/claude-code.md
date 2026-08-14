# Claude Code Integration Guide

Anthropic's **Claude Code** CLI tool natively supports Model Context Protocol (MCP) servers via `stdio`.

---

## 1. Installation

Install OpenBoard globally via npm:

```bash
npm install -g openboard
```

---

## 2. OpenBoard Startup

You can start the local OpenBoard web dashboard and server at any time:

```bash
openboard start
```

For AI agent operations via MCP, Claude Code will launch `openboard mcp` directly over stdio.

---

## 3. MCP Configuration

### CLI Setup (Recommended)

Run the following command in your terminal:

```bash
claude mcp add openboard --command="openboard" --args="mcp"
```

### Manual Configuration

Claude Code supports configuration at two scopes:

- **User Scope (`~/.claude.json`):** Available globally across all directories.
- **Project Scope (`.mcp.json`):** Available in the current repository root.

Add `openboard` under `mcpServers`:

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

> **Note:** For official Claude Code documentation, see [Anthropic Claude Code MCP Docs](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code).

---

## 4. Verification

Verify that OpenBoard is registered and its 13 tools are recognized:

```bash
claude mcp list
```

Inside an active Claude Code session, type:

```text
/mcp
```

You should see `openboard` marked as connected with tools such as `list_boards`, `create_board`, `create_shapes`, `get_canvas_state`, etc.

---

## 5. Example Workflows & Prompts

### Multi-Step Architecture Workflow

```text
User:
List my OpenBoard boards.

Claude Code:
[Calls list_boards tool]
Found 3 boards: "Frontend Redesign", "Billing API", "Infra Map".

User:
Create a board called SaaS Architecture.

Claude Code:
[Calls create_board with { name: "SaaS Architecture" }]
Created board "SaaS Architecture" (ID: "board_9f8a1b").

User:
Draw a frontend → API → Redis → PostgreSQL architecture.

Claude Code:
[Calls create_shapes on board "board_9f8a1b" with 4 geo shapes and 3 connecting arrows]
Created 4 components and 3 connected arrows.

User:
Inspect the board and tell me if the layout is balanced.

Claude Code:
[Calls get_canvas_state and get_canvas_screenshot]
I analyzed the canvas state. Redis and PostgreSQL are aligned side-by-side.

User:
Move Redis below the API and update the arrow connections.

Claude Code:
[Calls update_shapes to adjust coordinates and reconnect arrows]
Updated shape positions and refreshed arrow bindings.
```

---

## 6. Troubleshooting

- **`openboard: command not found`:** Verify that npm's global bin directory is in your `PATH` (`npm bin -g` or `npm prefix -g`).
- **Database path:** OpenBoard uses `~/.openboard/openboard.db` by default. To use a custom location, pass `--args='["mcp", "--db", "/path/to/custom.db"]'`.
- **No browser window needed:** Claude Code interacts directly with the headless engine and SQLite. Starting `openboard start` is only required when you want to view the board in your browser.
