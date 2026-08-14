# OpenBoard System Architecture

OpenBoard is built on local-first, deep-module architectural principles, providing clean interfaces between developer CLI tooling, local HTTP servers, headless canvas engines, and Model Context Protocol (MCP) agents.

---

## 1. High-Level Architecture

```text
                         OPENBOARD
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
       CLI                 Web                 MCP
        │                   │                   │
        │             Dashboard/Canvas    External Agents
        │                   │             Claude Code / Cursor /
        │                   │             OpenCode / Codex /
        │                   │             OpenClaw / Hermes
        │                   │
        └───────────────────┼───────────────────┘
                            │
                      BoardService
                            │
                 ┌──────────┴──────────┐
                 │                     │
            CanvasService        BoardRepository
                 │                     │
        HeadlessCanvasEngine        SQLite
                 │
              tldraw
                 │
          optional browser
```

---

## 2. Core Architectural Invariants

### 1. Browser Optionality

The application does not depend on a running browser or active frontend window.

- External AI agents can list boards, create boards, manipulate shapes, inspect semantic canvas state, and capture vector screenshots headlessly.
- When a board is opened in a browser, changes made by an agent project in real time via Server-Sent Events (SSE).

### 2. Explicit Board Addressing (No Implicit Active Board)

There is no concept of a global "active board" in the backend or MCP layer.

- Every canvas operation explicitly requires a `board_id`.
- Multiple agents or concurrent CLI commands can operate on different boards independently without collision.

### 3. Deep Domain Boundaries

- **`@openboard/shared`:** Pure TypeScript interfaces and errors. Zero dependencies on database drivers or UI frameworks.
- **`@openboard/storage`:** SQLite persistence repository using schema migrations, atomic transactions, and soft-delete capabilities.
- **`@openboard/core`:** Pure business logic (`BoardService`, `CanvasService`, `HeadlessCanvasEngine`, `HeadlessSvgRenderer`, and `BoardEventBus`).
- **`@openboard/server`:** Express HTTP REST & SSE streaming server.
- **`@openboard/mcp`:** Model Context Protocol stdio server translating agent tool calls to domain operations.
- **`@openboard/web`:** React + Vite + tldraw client dashboard and canvas UI.
- **`cli`:** Commander.js CLI binary executable.

---

## 3. Data Flow

### Agent MCP Mutation Flow (Browser Closed)

```text
Agent Tool Call (e.g. create_shapes)
   ↓ (stdio JSON-RPC)
OpenBoardMcpServer
   ↓
CanvasService.createShapes(board_id, shapes)
   ↓
HeadlessCanvasEngine (loads TLStore snapshot, validates shapes, applies mutations)
   ↓
BoardService.updateBoard(board_id, { document })
   ↓
SQLiteBoardRepository (persists updated document to SQLite)
```

### Agent MCP Mutation Flow (Browser Open)

```text
Agent Tool Call
   ↓
OpenBoardMcpServer
   ↓
CanvasService & BoardService
   ├──→ SQLiteBoardRepository (persisted to disk)
   └──→ BoardEventBus.emit('canvas:updated', { boardId, document })
           ↓ (SSE streaming)
        Browser EventSource
           ↓
        BoardCanvasController.applyExternalDocument()
           ↓
        tldraw live canvas updates visually
```

---

## 4. Headless Visual Inspection

To allow multimodal AI agents to visually inspect whiteboard scenes without launching headless Chromium or electron processes, OpenBoard provides `HeadlessSvgRenderer`.

- Generates clean, standards-compliant vector SVGs directly from SQLite board documents.
- Calculates content-aware bounding boxes with configurable padding.
- Renders shapes (`geo`, `note`, `text`, `arrow`, `frame`, `line`, `draw`) with styling, themes, and arrow connections.
- Encodes output to standard MCP image content blocks (`image/svg+xml`) and SVG text strings.
