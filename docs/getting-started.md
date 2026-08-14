# Getting Started with OpenBoard

OpenBoard is a local-first personal whiteboard workspace for developers and external AI agents.

## What OpenBoard Provides

- **Local Whiteboards:** Create, edit, and organize persistent vector whiteboards.
- **Tldraw Integration:** Visual editing in the browser powered by tldraw.
- **External AI Agent Control:** Full programmatic control over whiteboard creation, drawing, inspection, and lifecycle via Model Context Protocol (MCP).
- **Headless Operations:** Agents can draw, inspect, and take screenshots of whiteboards without requiring a running browser.
- **Local Persistence:** Data is stored in SQLite on your local filesystem (`~/.openboard/openboard.db`).

---

## Hard Product Boundary

> **Important:** OpenBoard is **developer & AI agent infrastructure**. OpenBoard is **not** an AI agent.
>
> OpenBoard contains **no internal LLMs, API keys, agent loops, or prompt orchestration**. Users bring their own agents (Claude Code, Cursor, OpenCode, Codex, OpenClaw, Hermes, etc.).

---

## 1. Installation

Install OpenBoard globally via npm:

```bash
npm install -g openboard
```

Or run directly without global installation:

```bash
npx openboard start
```

---

## 2. Starting the Workspace

To start the local workspace and open the web dashboard in your default browser:

```bash
openboard start
```

By default, the server binds strictly to `http://localhost:3000`.

### Options:

| Flag                  | Description                       | Default                     |
| :-------------------- | :-------------------------------- | :-------------------------- |
| `-p, --port <number>` | Port to listen on                 | `3000`                      |
| `-h, --host <host>`   | Host address to bind to           | `localhost`                 |
| `--db <path>`         | Custom SQLite database file path  | `~/.openboard/openboard.db` |
| `--no-open`           | Do not automatically open browser | `false`                     |

---

## 3. Connecting an External AI Agent

OpenBoard includes a standard Model Context Protocol (MCP) server running over `stdio`:

```bash
openboard mcp
```

### Quick Setup for Popular Agents:

- **Claude Code:**

  ```bash
  claude mcp add openboard --command="openboard" --args="mcp"
  ```

- **Cursor (`~/.cursor/mcp.json`):**

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

- **OpenCode (`~/.config/opencode/opencode.jsonc`):**

  ```jsonc
  {
    "mcp": {
      "openboard": {
        "type": "local",
        "command": "openboard",
        "args": ["mcp"],
        "enabled": true,
      },
    },
  }
  ```

- **OpenAI Codex / Agents (`~/.codex/config.toml`):**
  ```toml
  [mcp_servers.openboard]
  command = "openboard"
  args = ["mcp"]
  ```

---

## 4. Local Storage Location

All board documents, metadata, snapshots, and relationships are stored in:

```text
~/.openboard/openboard.db
```

To backup or inspect your boards:

```bash
# Direct SQLite CLI inspection:
sqlite3 ~/.openboard/openboard.db "SELECT id, name, updated_at FROM boards;"
```

---

## 5. Web Dashboard Navigation

Open `http://localhost:3000` to access:

- **All Boards:** View active boards in grid or table view.
- **Favorites:** Quick access to bookmarked boards.
- **Trash:** Soft-deleted boards with instant restore or permanent deletion.
- **Documentation Center:** Built-in interactive guides, MCP tool schemas, and integration tutorials at `http://localhost:3000/docs`.
