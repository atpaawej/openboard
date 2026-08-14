# OpenBoard MCP Architecture & Canvas Domain Model

## 1. Overview & Core Product Definition

**OpenBoard** is a local-first personal whiteboard workspace that exposes boards and canvas operations to external AI agents through the **Model Context Protocol (MCP)**.

OpenBoard is **not** an AI agent. It contains no internal LLM, prompt engine, agent loop, chat interface, or API key manager. External agents (such as Codex, Claude Code, Cursor, OpenClaw, Hermes, or OpenCode) connect to OpenBoard via standard MCP transport to inspect, create, organize, and edit whiteboards.

```
┌────────────────────────┐         ┌────────────────────────┐
│  External AI Agent     │         │   Browser User         │
│  (Claude Code, Codex)  │         │   (Interactive UI)     │
└───────────┬────────────┘         └───────────┬────────────┘
            │ MCP (stdio)                      │ HTTP / SSE
            ▼                                  ▼
┌────────────────────────┐         ┌────────────────────────┐
│ OpenBoard MCP Server   │         │ OpenBoard Web / React  │
└───────────┬────────────┘         └───────────┬────────────┘
            │                                  │
            └────────────────┬─────────────────┘
                             ▼
                    ┌─────────────────┐
                    │  CanvasService  │
                    │  BoardService   │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │ BoardRepository │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │     SQLite      │
                    │ (Source of Truth)│
                    └─────────────────┘
```

---

## 2. Deep Module Architecture

Every module strictly encapsulates its implementation details behind a minimal, semantic public API:

```
MCP Layer (JSON-RPC / stdio)
   │ (Calls semantic domain methods: createShapes, listBoards)
   ▼
Core Domain Layer (CanvasService, BoardService, EventBus)
   │ (Manipulates headless TLStore / BoardDocument without knowing DB details)
   ▼
Storage Layer (BoardRepository, SQLiteBoardRepository)
   │ (Executes SQL, prepared statements, WAL pragmas, migrations)
   ▼
SQLite Database (~/.openboard/openboard.db)
```

### Module Boundaries & Invariants:

1. **MCP does not know SQLite**: The MCP module never imports `better-sqlite3`, executes SQL, references table names, or resolves database paths. It operates exclusively on `BoardService` and `CanvasService`.
2. **MCP does not depend on React or DOM**: The MCP server and domain core run completely headless in standard Node.js environments.
3. **Storage does not know MCP or Canvas**: `BoardRepository` only stores and retrieves `Board` records.
4. **Browser is a Projection, not the Authority**: The live browser tldraw editor is an optional projection of the durable SQLite state. If the browser is closed, all MCP board and canvas operations execute and persist with zero errors.
5. **No "Active Board" Ambiguity**: Every canvas operation explicitly specifies `board_id`. There are no hidden global singletons like `activeBoard` or `currentCanvas`.

---

## 3. Transport Design

OpenBoard implements standard **stdio** JSON-RPC 2.0 transport for MCP:

- **Client invocation**: External agents launch OpenBoard via `openboard mcp` or `npx openboard mcp`.
- **Standard Streams**:
  - `stdin`: Receives JSON-RPC request frames from the external agent.
  - `stdout`: Emits JSON-RPC response frames to the external agent.
  - `stderr`: Reserved exclusively for diagnostic logs, ensuring `stdout` remains clean framing.
- **Why stdio?**:
  - Direct local subprocess execution is zero-configuration and standard across all MCP clients (Claude Desktop, Cursor, Claude Code, OpenClaw).
  - No open network ports required solely for agent access.
  - Subprocess lifecycle is cleanly tied to the external agent session.

---

## 4. Persistent Document Mutation (Headless Canvas Operations)

When an agent invokes a canvas tool (such as `create_shapes`, `update_shapes`, or `delete_shapes`), the system applies the mutations headlessly:

1. `CanvasService` retrieves the `Board` document from `BoardService`.
2. `TldrawHeadlessAdapter` loads the document records into an in-memory `TLStore`.
3. The adapter executes validated record operations:
   - Generating standard `shape:xxx` IDs and parent bindings (`page:page`).
   - Filling schema defaults using tldraw shape utilities (`geo`, `note`, `text`, `arrow`, `line`, `frame`, etc.).
   - Converting plain text into structured `TLRichText` ProseMirror documents.
   - Computing or validating coordinates, dimensions, colors, and styles.
4. The adapter extracts the sanitized `TLStoreSnapshot` back into a `BoardDocument`.
5. `BoardService` updates the board record in SQLite and records the new timestamp.
6. If an OpenBoard event listener is attached (such as a running HTTP server), a `board_updated` event is dispatched.

---

## 5. Live Browser Canvas Synchronization

When a board is open in a browser:

```
Agent Mutation (MCP)
        │
        ▼
   CanvasService
        │
   ┌────┴──────────────────────────┐
   ▼                               ▼
Persist to SQLite           Emit 'board_updated'
                                   │
                                   ▼
                           SSE Stream to Browser
                           (GET /api/boards/:id/live)
                                   │
                                   ▼
                           BoardCanvasView
                                   │
                           store.mergeRemoteChanges(...)
                                   │
                                   ▼
                           tldraw Canvas updates live
```

### Key Synchronization Mechanics:

- **One-way Remote Merging**: Incoming remote updates are merged into the live editor store via `store.mergeRemoteChanges(() => { ... })`.
- **Zero Feedback Loops**: `store.mergeRemoteChanges` marks store changes with `{ source: 'remote' }`. The frontend's `useBoardAutosave` hook listens strictly to `{ scope: 'document', source: 'user' }`, completely preventing the browser from echo-saving remote agent edits back to SQLite.
- **Camera & Viewport Preservation**: Remote shape additions/updates do not alter the user's camera, zoom level, or active tool state.
- **Browser Disconnected / Closed**: If no browser is open, the SSE stream has no subscribers; the persistence path completes unconditionally and durably in SQLite.

---

## 6. Canvas State Representation for Agents

Raw tldraw documents contain extensive schema metadata, index keys, and nested ProseMirror trees that create unnecessary noise and token overhead for LLM agents.

`get_canvas_state(board_id)` transforms the raw store records into a clean, semantic JSON structure:

```json
{
  "boardId": "board_1723617890123_abc123",
  "name": "Payment Architecture",
  "shapesCount": 2,
  "bounds": {
    "minX": 100,
    "minY": 100,
    "maxX": 450,
    "maxY": 250,
    "width": 350,
    "height": 150
  },
  "shapes": [
    {
      "id": "shape:svc_api",
      "type": "geo",
      "geo": "rectangle",
      "x": 100,
      "y": 100,
      "w": 150,
      "h": 80,
      "text": "API Gateway",
      "color": "blue",
      "fill": "semi"
    },
    {
      "id": "shape:arrow_1",
      "type": "arrow",
      "x": 250,
      "y": 140,
      "text": "HTTP POST",
      "start": { "x": 0, "y": 0 },
      "end": { "x": 100, "y": 0 },
      "color": "black"
    }
  ]
}
```

---

## 7. Screenshot Architecture & Strategy

1. **Structured State as Primary Truth**: External LLM agents primarily need structured, accurate geometric coordinates, text labels, and relational connections (`get_canvas_state`).
2. **Headless Node Limitation**: tldraw's native raster screenshot and SVG rendering APIs (`exportAs`, `exportToBlob`, `getSvgAsImage`) depend on browser DOM and canvas contexts (`document.createElementNS`, font metrics, Canvas2D).
3. **Phase 3 Stance**:
   - For Phase 3, OpenBoard provides robust, deterministic structured state (`get_canvas_state`) and optional SVG outline generation.
   - We do not bundle heavyweight Chromium/Puppeteer binaries into the CLI/MCP server just to render screenshots when headless, as that would bloat installation size by hundreds of megabytes.
   - When a browser projection is mounted, the client can capture visual previews if requested.

---

## 8. Concurrency & Collision Policy

OpenBoard is a **single-user, local-first** whiteboard workspace.

- **Deterministic LWW (Last-Write-Wins)**: SQLite transactions serialize writes.
- **Granular Record Merging**: Since `TLStore` is record-based (keyed by `shape:id`), an agent adding shape B while a human moves shape A cleanly merges without clobbering each other.
- **Timestamps**: All board metadata updates write an ISO 8601 `updatedAt` timestamp.

---

## 9. Tool Surface (Vertical Slice)

The OpenBoard MCP server exposes a cohesive, semantic set of tools:

### A. Board Management Tools

- `list_boards`: List all boards with optional search query and favorite filter.
- `create_board`: Create a new whiteboard with a name and optional description.
- `get_board`: Retrieve full board metadata and canvas structure.
- `rename_board`: Rename an existing board.
- `delete_board`: Soft-delete a board.

### B. Canvas Operations Tools

- `get_canvas_state`: Retrieve clean semantic summary of shapes, positions, labels, and bounding box.
- `create_shapes`: Create one or more shapes (rectangles, ellipses, notes, text, arrows, lines, frames) with positions, dimensions, text, and styles.
- `update_shapes`: Modify properties, coordinates, dimensions, text, or styles of existing shapes.
- `delete_shapes`: Remove shapes by ID and automatically prune associated bindings.
