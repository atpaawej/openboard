# MCP Troubleshooting & Diagnostics

Common questions and resolutions when using OpenBoard MCP with external AI agents.

---

## 1. Agent Reports "Connection Refused" or Cannot Spawn MCP

### Checklist:

1. Verify OpenBoard is installed:
   ```bash
   openboard -v
   ```
2. Verify you can run the MCP command in a terminal:
   ```bash
   openboard mcp
   ```
   _(It should output `[OpenBoard MCP] Server started on stdio transport.` to stderr and wait for JSON-RPC on stdin)._
3. If using a local clone instead of a global npm install, specify the absolute path to the node binary or cli entry:
   ```json
   {
     "command": "node",
     "args": ["/path/to/openboard/cli/dist/index.js", "mcp"]
   }
   ```

---

## 2. "Board Not Found" Error

### Cause:

The `board_id` passed to the tool does not match any active board in SQLite.

### Resolution:

1. Call `list_boards` first to discover all valid board IDs.
2. If the board was deleted, call `list_boards` with `filter: "trash"` and use `restore_board` to reactivate it.

---

## 3. Does the Browser Need to Be Open?

### No.

OpenBoard's architecture is fully headless. All operations persist directly to SQLite. When you later open the board in the web dashboard, all agent creations and updates will be there.

---

## 4. Live Browser Canvas Is Not Updating

If you have a board open in your browser while an agent makes mutations:

1. Verify the OpenBoard HTTP server is running (`openboard start`).
2. Verify your browser is connected to the SSE stream at `/api/boards/:id/live`.
3. Check the status indicator in the web sidebar (it should display "Engine Active").
