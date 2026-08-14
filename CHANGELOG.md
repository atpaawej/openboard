# Changelog

All notable changes to OpenBoard are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.2] - 2026-08-14

### Bug Fixes & Improvements

- **Fixed Unbound Arrow Coordinate Rendering & Bounds Computation (Issue #1)**
  - Replaced falsy logical OR coordinate checks (`Number(props.end?.x) || 120`) in `HeadlessSvgRenderer` with strict numeric parsing, ensuring `0` values (e.g. vertical arrows with `end: { x: 0, y: 160 }`) are preserved without phantom horizontal offsets.
  - Added support for `props.start` offset handle coordinates in SVG arrow rendering.
  - Corrected arrow bounding box calculation in both `HeadlessCanvasEngine.computeBounds` and `HeadlessSvgRenderer.render` to compute accurate bounds from arrow endpoints and bindings.

- **Enabled Arrow Handle Modification & Unbinding in `update_shapes` (Issue #2)**
  - Added `start` and `end` handle offset properties to the `update_shapes` MCP JSON schema.
  - Fixed `updatedProps.end` coordinate assignment in `CanvasService.updateShapes`.
  - Added support for dynamically unbinding arrow endpoints when `from: ""` or `to: ""` is passed.

- **Normalized Text Shape Properties & Improved Canvas State Summaries (Issue #3)**
  - Allowed `text` shapes to accept `w` (wrap width) without throwing tldraw validation errors on `h`.
  - Automatically stripped unsupported `h` from `text` shapes and `w`/`h` from `note`, `arrow`, and `line` shapes in `HeadlessCanvasEngine.createStore` and `TldrawDocumentAdapter.normalizeRecords`.
  - Improved `get_canvas_state` shape summaries to report realistic geometric bounds for `text` and `note` shapes instead of default `w: 8` placeholders.

---

## [0.1.1] - 2026-08-14

### Features & Server Enhancements

- **HTTP & SSE MCP Endpoints**
  - Integrated `/mcp` HTTP POST endpoint and `/mcp/sse` Server-Sent Events endpoint into the local server (`openboard start`).
  - Added support for remote agent transports alongside native stdio.

---

## [0.1.0] - 2026-08-14

Initial public release of OpenBoard — the local-first personal whiteboard workspace for developers and external AI agents.

### Features & Capabilities

- **Local-First Whiteboards & SQLite Persistence**
  - Fully offline-capable workspace storing boards and canvas documents in local SQLite (`~/.openboard/openboard.db`).
  - Automatic database initialization and idempotent migrations on startup.
  - Soft deletion (Trash) with full recovery and permanent purging capabilities.

- **Interactive tldraw Canvas & Web Dashboard**
  - Modern infinite canvas powered by tldraw with rich shape rendering, geometric shapes, sticky notes, text, frames, and connecting arrows.
  - Debounced client-side autosave and tab-scoped active board management.
  - Multi-board dashboard with search, preset filters (All, Recent, Favorites, Trash), grid/table layouts, and quick actions.

- **Model Context Protocol (MCP) Server for AI Agents**
  - Native stdio MCP server (`openboard mcp`) implementing MCP JSON-RPC 2.0.
  - Clean stdio protocol separation: protocol frames on `stdout`, diagnostics and logs on `stderr`.
  - Browser-optional operation: AI agents can create, query, and modify boards whether the web UI is open or closed.
  - Real-time Server-Sent Events (SSE) live sync: changes made by external agents stream into active browser sessions instantly.

- **13 Semantic Agent Tools**
  - `list_boards`: Discover whiteboards with filters and search keywords.
  - `create_board`: Create new boards with metadata.
  - `get_board`: Query board metadata and document summaries.
  - `rename_board`: Rename existing whiteboards.
  - `duplicate_board`: Clone boards with identical canvas contents.
  - `favorite_board`: Toggle bookmark/favorite status.
  - `delete_board`: Move boards to Trash.
  - `restore_board`: Recover deleted boards from Trash.
  - `get_canvas_state`: Retrieve structured shapes, coordinates, bounds, text, and arrow bindings.
  - `get_canvas_screenshot`: Headless vector SVG visual rendering with auto-framing.
  - `create_shapes`: Draw geometric shapes, notes, text, frames, and arrows with bindings.
  - `update_shapes`: Modify shape positions, dimensions, styling, and connections.
  - `delete_shapes`: Remove shapes and automatically clean up attached arrow bindings.

- **Unified CLI Executable (`openboard`)**
  - `openboard start`: Start local server, serve built Web UI, and open browser.
  - `openboard mcp`: Launch stdio MCP server for agent integration.
  - `openboard info`: Output system configuration, database location, and MCP parameters.
  - `openboard --help` / `openboard -v`: Standard CLI inspection flags.

- **Integrated Documentation Center**
  - In-app documentation center at `http://localhost:3000/docs`.
  - Comprehensive integration guides for Claude Code, Cursor, OpenCode, OpenAI Codex, OpenClaw, Hermes Agent, and Generic MCP clients.
