# OpenCode Integration Guide

OpenCode provides native support for local and remote Model Context Protocol (MCP) servers.

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

For AI agent operations via MCP, OpenCode launches `openboard mcp` directly over stdio.

---

## 3. MCP Configuration

### Configuration File (`opencode.jsonc`)

OpenCode looks for configuration files at:

- **Global Config:** `~/.config/opencode/opencode.jsonc` (or `~/.config/opencode/opencode.json`)
- **Project Config:** `opencode.jsonc` (in project root)

Add the `openboard` server under the `mcp` key:

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

> **Note:** For more details, refer to the official OpenCode configuration manual.

---

## 4. Verification

Verify registered MCP servers via the OpenCode CLI:

```bash
opencode mcp list
```

Ensure `openboard` appears with status `active` and all 13 tools registered.

---

## 5. Example Workflows & Prompts

### Multi-Step System Topology Workflow

```text
User:
List my OpenBoard whiteboards and create a new one called "Kubernetes Topology".

OpenCode:
[Calls list_boards]
[Calls create_board with { name: "Kubernetes Topology" }]
Created board "Kubernetes Topology" (ID: "board_k8s_99").

User:
Draw an Ingress Controller routing traffic to Auth Pods and Order Pods.

OpenCode:
[Calls create_shapes on "board_k8s_99" with 3 shapes and 2 connecting arrows]
Added Ingress Controller, Auth Pods, and Order Pods with arrow connections.

User:
Inspect the canvas and adjust the layout so pods are aligned horizontally.

OpenCode:
[Calls get_canvas_state, then calls update_shapes with aligned Y coordinates]
Aligned Auth and Order pods at Y=250.
```

---

## 6. Troubleshooting

- **Path issues:** If OpenCode runs in an isolated subshell, verify that `openboard` is accessible in the environment's `PATH`.
- **Stdio logging:** OpenBoard emits only JSON-RPC to stdout and diagnostic logs to stderr.
- **Custom SQLite DB:** Add `"args": ["mcp", "--db", "/path/to/db.sqlite"]` if you want a project-scoped database.
