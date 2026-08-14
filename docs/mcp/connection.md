# MCP Connection & Stdio Transport

OpenBoard implements standard JSON-RPC 2.0 over standard input and output streams (`stdio`).

---

## 1. Process Communication Model

```text
External Agent (e.g. Claude / Cursor / OpenCode)
         │
         │  (spawns child process)
         ▼
     stdio stream
         │  (JSON-RPC 2.0 frames)
         ▼
  openboard mcp
         │
  OpenBoardMcpServer
         │
  BoardService & CanvasService
         │
  SQLite (~/.openboard/openboard.db)
```

---

## 2. Protocol Invariants

1. **Protocol Cleanliness on stdout:**
   - Only valid newline-delimited JSON-RPC messages are ever emitted to `stdout`.
   - Agents will never receive unstructured log lines or console output on `stdout`.

2. **Diagnostics on stderr:**
   - Startup notices, configuration details, and unexpected internal warnings are strictly routed to `stderr`.

3. **Protocol Version:**
   - Implements MCP Protocol Specification version `2024-11-05`.

---

## 3. Invocation Command

To start the MCP server directly:

```bash
openboard mcp
```

### Custom Database Path:

```bash
openboard mcp --db /custom/path/to/openboard.db
```
