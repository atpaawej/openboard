# Hermes Agent Integration Guide

Hermes Agent connects to MCP servers configured under the `mcp_servers` section of its configuration file.

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

For AI agent operations via MCP, Hermes Agent invokes `openboard mcp` directly over stdio.

---

## 3. MCP Configuration

### Configuration File (`~/.hermes/config.yaml`)

Add OpenBoard to your Hermes configuration file:

```yaml
mcp_servers:
  openboard:
    command: 'openboard'
    args:
      - 'mcp'
```

---

## 4. Verification

Verify that Hermes detects the OpenBoard tools:

```bash
hermes mcp status
```

You should see `openboard` listed with 13 registered tools.

---

## 5. Example Workflows & Prompts

### Multi-Step Infrastructure Planning Workflow

```text
User:
List my whiteboards on OpenBoard.

Hermes:
[Calls list_boards]
Found 1 board: "Q2 Retrospective".

User:
Create a new board for "Q3 Infrastructure Plan".

Hermes:
[Calls create_board with { name: "Q3 Infrastructure Plan" }]
Created board "Q3 Infrastructure Plan" (ID: "board_infra_q3").

User:
Add four component boxes (API Gateway, Auth Service, Billing Worker, Postgres) with notes.

Hermes:
[Calls create_shapes on "board_infra_q3" with 4 geo rectangles and 4 yellow notes]
Created 4 components with attached architecture notes.

User:
Inspect the board layout with get_canvas_state and get_canvas_screenshot.

Hermes:
[Calls get_canvas_state and get_canvas_screenshot]
Verified all 8 shapes and visual layout.
```

---

## 6. Troubleshooting

- **Executable path:** Ensure `openboard` is in PATH or provide absolute path in `command`.
- **Database path:** OpenBoard stores data in `~/.openboard/openboard.db`. Use `args: ["mcp", "--db", "/custom/path.db"]` for custom locations.
- **Logs & diagnostics:** All debug logs are output to stderr, ensuring clean stdio communication.
