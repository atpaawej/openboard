# OpenClaw Integration Guide

OpenClaw connects to external tools and environments using the Model Context Protocol (MCP) over `stdio`.

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

For AI agent operations via MCP, OpenClaw runs `openboard mcp` directly over stdio.

---

## 3. MCP Configuration

### Configuration File (`~/.openclaw/config.json`)

Add OpenBoard under `mcpServers` in your OpenClaw configuration file:

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

---

## 4. Verification

Apply changes and verify tool registration:

```bash
openclaw gateway restart
openclaw mcp list
```

Verify that `openboard` is active and all 13 tools are available.

---

## 5. Example Workflows & Prompts

### Multi-Step Deployment Topology Workflow

```text
User:
List my OpenBoard whiteboards.

OpenClaw:
[Calls list_boards]
Found 2 boards: "Sprint Planning", "Deployment Architecture".

User:
Inspect the canvas on "Deployment Architecture".

OpenClaw:
[Calls get_canvas_state and get_canvas_screenshot on the target board]
Retrieved 5 shapes. Kubernetes cluster is currently disconnected from Redis.

User:
Connect the Kubernetes cluster to Redis with an arrow labeled "Cache Reads/Writes".

OpenClaw:
[Calls create_shapes with arrow binding from k8s_cluster to redis_cache]
Created arrow connecting Kubernetes to Redis with label "Cache Reads/Writes".
```

---

## 6. Troubleshooting

- **Restart gateway:** Always run `openclaw gateway restart` after editing `config.json`.
- **Binary discovery:** Ensure `openboard` is installed globally (`npm install -g openboard`).
- **Clean stdio:** OpenBoard ensures stdout contains only JSON-RPC protocol frames.
