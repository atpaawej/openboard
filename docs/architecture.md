# OpenBoard Architecture

OpenBoard is a local-first personal whiteboard workspace designed specifically for developers and AI agents. It operates 100% locally on the user's machine with zero cloud backends, zero user accounts, and zero remote dependencies.

---

## 1. Deep Module Architecture

The codebase follows John Ousterhout's *Philosophy of Software Design* regarding **Deep Modules**:

* **Small, simple public interfaces** hiding rich internal functionality.
* **Thorough information hiding**: neither the Web UI nor the MCP agent protocol knows about raw storage schemas, disk layouts, or atomic write mechanics.
* **Single source of domain truth**: All clients (Web UI, MCP server, CLI) interact exclusively through the domain `BoardService` in `packages/core`.

```text
┌───────────────────────────────────────────────────────────┐
│                      Clients Layer                        │
│                                                           │
│   ┌───────────────┐     ┌───────────────┐     ┌───────┐   │
│   │    Web UI     │     │  MCP Server   │     │  CLI  │   │
│   └───────┬───────┘     └───────┬───────┘     └───┬───┘   │
└───────────┼─────────────────────┼─────────────────┼───────┘
            │                     │                 │
            ▼                     ▼                 ▼
┌───────────────────────────────────────────────────────────┐
│              Domain Service Layer (@openboard/core)       │
│                                                           │
│                    ┌──────────────┐                       │
│                    │ BoardService │                       │
│                    └──────┬───────┘                       │
└───────────────────────────┼───────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────┐
│            Storage Abstraction (@openboard/storage)       │
│                                                           │
│                   ┌──────────────┐                        │
│                   │ BoardStorage │ (Interface)            │
│                   └───────┬──────┘                        │
│                           │                               │
│            ┌──────────────┴──────────────┐                │
│            ▼                             ▼                │
│   MemoryBoardStorage             FileBoardStorage         │
│                                  (~/.openboard)           │
└───────────────────────────────────────────────────────────┘
```

---

## 2. Package Responsibilities

### `packages/shared` (`@openboard/shared`)
* **Role**: Domain types, result structures, and error primitives.
* **Responsibilities**:
  * Definitive models: `BoardId`, `BoardMetadata`, `BoardDocument`, `Board`, `BoardSummary`.
  * API contracts: `HealthCheckResponse`, `ApiResponse<T>`.
  * Base error hierarchy: `OpenBoardError`, `BoardNotFoundError`, `BoardValidationError`, `StorageOperationError`.
* **Zero dependencies** on other workspace packages or external frameworks.

### `packages/storage` (`@openboard/storage`)
* **Role**: Persistence abstraction.
* **Responsibilities**:
  * `BoardStorage` interface defining CRUD operations: `listBoards()`, `getBoard()`, `createBoard()`, `updateBoard()`, `deleteBoard()`, `restoreBoard()`.
  * `MemoryBoardStorage` for fast in-memory execution, testing, and isolated staging.
  * Extensible design ready for atomic file-system writes under `~/.openboard/boards/` in Phase 2.
  * Completely conceals serialization format, file I/O, and disk structure from upper layers.

### `packages/core` (`@openboard/core`)
* **Role**: Central domain service.
* **Responsibilities**:
  * `BoardService`: The single source of truth for business logic.
  * Encapsulates ID generation, timestamps, validation, default canvas schemas, soft/hard deletion, board duplication, and favorites toggling.
  * Prevents duplicate business logic between the Web app and AI agents.

### `packages/mcp` (`@openboard/mcp`)
* **Role**: Model Context Protocol (MCP) server for AI agents.
* **Responsibilities**:
  * Exposes agent tools (`list_boards`, `get_board`, `create_board`, etc.).
  * Translates agent tool calls directly into domain calls on `BoardService`.
  * Never interacts directly with disk files or raw storage.

### `apps/server` (`@openboard/server`)
* **Role**: Local Node.js HTTP backend.
* **Responsibilities**:
  * `OpenBoardServer` deep module.
  * Serves REST API (`/api/health`, `/api/boards`).
  * Provides programmatic `start()` / `stop()` methods for the CLI and standalone daemon execution.
  * Ready to serve static Web assets in production distribution.

### `apps/web` (`@openboard/web`)
* **Role**: Frontend SPA.
* **Responsibilities**:
  * Built with React + Vite.
  * Pure Vanilla CSS design tokens (fast, responsive, zero bloated CSS runtime).
  * Routes:
    * `/dashboard`: Board management and status.
    * `/board/:id`: Whiteboard canvas (prepared for tldraw).
    * `/settings`: Local workspace configuration.

### `cli` (`openboard`)
* **Role**: Developer command line interface.
* **Responsibilities**:
  * Binary command `openboard start` with port/host configuration.
  * Manages the lifecycle of the local server.
  * Structured for seamless browser opening upon startup.

---

## 3. Data Structure Separation

Board state is strictly separated into two distinct components:

```text
Board
 ├── metadata: BoardMetadata
 │     ├── id: string
 │     ├── name: string
 │     ├── createdAt: ISOString
 │     ├── updatedAt: ISOString
 │     ├── favorite: boolean
 │     └── thumbnail?: string | null
 │
 └── document: BoardDocument
       ├── schemaVersion: number
       └── records: Record<string, unknown> (tldraw store snapshot)
```

**Why this separation matters**:
1. **Performance**: Dashboard listings only need lightweight metadata, avoiding loading megabytes of canvas records for dozens of boards.
2. **AI Agent Efficiency**: Agents can query metadata without deserializing the entire drawing graph when performing search or categorization.
3. **Storage Flexibility**: Allows storing metadata in a fast index (or JSON header) while persisting heavy document snapshots independently.
