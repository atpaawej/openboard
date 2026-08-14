# Cursor IDE Integration Guide

Cursor supports Model Context Protocol (MCP) servers configured via JSON configuration files or Cursor Settings.

---

## 1. Installation

Install OpenBoard globally via npm:

```bash
npm install -g openboard
```

---

## 2. OpenBoard Startup

Launch the local OpenBoard web dashboard and server:

```bash
openboard start
```

For AI agent operations via MCP, Cursor executes `openboard mcp` directly over stdio.

---

## 3. MCP Configuration

### Configuration File Setup

Cursor reads MCP server definitions from:

- **Global Configuration:** `~/.cursor/mcp.json`
- **Project Configuration:** `.cursor/mcp.json` (inside project root)

Add the `openboard` server under `mcpServers`:

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

### Cursor UI Setup

1. Open **Cursor Settings** (`Cmd+,` on macOS or `Ctrl+,` on Linux/Windows).
2. Navigate to **Tools & MCP** (or **Features > MCP** depending on Cursor version).
3. Click **Add New MCP Server**.
4. Set **Name** to `openboard`, **Type** to `command`, and **Command** to `openboard mcp`.
5. Verify the green active status indicator.

> **Note:** For official Cursor MCP details, refer to [Cursor Documentation](https://docs.cursor.com/context/model-context-protocol).

---

## 4. Verification

In Cursor Composer or Agent Chat, ask:

```text
What MCP tools are available from openboard?
```

Cursor should list all 13 tools including `list_boards`, `create_board`, `create_shapes`, `get_canvas_state`, `get_canvas_screenshot`, and `update_shapes`.

---

## 5. Example Workflows & Prompts

### Multi-Step Architecture Diagramming in Cursor Composer

```text
User:
List my OpenBoard whiteboards.

Cursor Agent:
[Calls list_boards]
Found 2 boards: "Core Architecture", "Data Pipeline".

User:
Create a new board called "Payment Flow".

Cursor Agent:
[Calls create_board with { name: "Payment Flow" }]
Created board "Payment Flow" (ID: "board_e43f11").

User:
Draw a checkout service that sends events to Kafka and writes to Postgres.

Cursor Agent:
[Calls create_shapes on "board_e43f11" with 3 boxes and 2 directional arrows]
Added Checkout Service, Kafka Queue, and Postgres DB with connected bindings.

User:
Inspect the canvas and verify all shape coordinates and arrow links.

Cursor Agent:
[Calls get_canvas_state and get_canvas_screenshot]
Verified all 3 shapes and 2 arrow bindings. Visual layout confirmed.
```

---

## 6. Troubleshooting

- **Executable not in PATH:** If Cursor cannot find `openboard`, provide the full path to the binary in `command` (e.g. `/usr/local/bin/openboard` or `C:\\Users\\<User>\\AppData\\Roaming\\npm\\openboard.cmd`).
- **Process restart:** After modifying `~/.cursor/mcp.json`, restart Cursor or reload MCP servers in Settings.
- **Database path:** OpenBoard stores data at `~/.openboard/openboard.db`. To specify a custom path, use `"args": ["mcp", "--db", "/custom/path/openboard.db"]`.
