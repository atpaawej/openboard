# Model Context Protocol (MCP) in OpenBoard

The Model Context Protocol (MCP) enables external AI coding agents (such as Claude Code, Cursor, OpenCode, Codex, OpenClaw, and Hermes) to interact directly with OpenBoard workspaces.

---

## 1. What OpenBoard Exposes via MCP

OpenBoard exposes **13 semantic tools**:

### Board Management:

1. `list_boards` — Discover and list whiteboards with filtering and search.
2. `create_board` — Create a new whiteboard and receive its unique `board_id`.
3. `get_board` — Inspect high-level metadata and shape bounds.
4. `rename_board` — Rename a whiteboard.
5. `duplicate_board` — Clone an entire board and its shapes under a new ID.
6. `favorite_board` — Bookmark or toggle favorite status.
7. `restore_board` — Restore a soft-deleted board from Trash.
8. `delete_board` — Move a board to Trash.

### Canvas Operations & Visual Inspection:

9. `get_canvas_state` — Semantic inspection of shapes, coordinates, dimensions, bounds, and arrow connections (`from`/`to`).
10. `get_canvas_screenshot` — Headless vector SVG capture (returns MCP image blocks) for visual review.
11. `create_shapes` — Batch create shapes, notes, text, frames, and arrows with bindings.
12. `update_shapes` — Batch update shape positions, dimensions, labels, colors, or connections.
13. `delete_shapes` — Delete shapes by ID with automatic cascade cleanup of attached arrows.

---

## 2. Design Principles

- **Token-Efficient Results:** Rather than dumping hundreds of raw tldraw records, OpenBoard returns clean, concise JSON summaries with exact bounding boxes.
- **Stable Identifiers:** Custom or generated shape IDs (e.g. `api_gateway`, `db_postgres`) persist deterministically across reads and mutations.
- **Semantic Relationships:** Connected arrows explicitly report their `from` and `to` shape IDs so agents do not have to guess topology from coordinates.
- **Guided Error UX:** Errors guide the agent toward recovery (e.g. suggesting `list_boards` when an invalid `board_id` is passed).
