# OpenBoard ✦

> A local-first personal whiteboard workspace for developers and AI agents.

OpenBoard is a lightweight, local application distributed through npm. It pairs a **tldraw** canvas with a local **Model Context Protocol (MCP)** server, enabling developers and autonomous AI coding agents to visually collaborate on architectural diagrams, system designs, and workflows directly on your machine.

---

## 🌟 Product Vision & Constraints

* **100% Local-First**: All boards and scenes reside directly on your local machine.
* **Zero Remote Dependencies**: No user accounts, no authentication, no cloud databases, and no SaaS subscriptions.
* **AI Agent Native**: Includes a built-in MCP server that allows AI agents to inspect, manipulate, and generate canvas boards alongside you.
* **Unified Domain Architecture**: Both the Web UI and AI agents operate against the exact same domain service.

---

## 🏗️ Repository Architecture

```text
openboard/
├── apps/
│   ├── web/          # React + Vite frontend dashboard and canvas
│   └── server/       # Local Node.js HTTP server & API
│
├── packages/
│   ├── shared/       # Shared TypeScript models, contracts, and error hierarchy
│   ├── storage/      # Deep storage abstraction (Memory / Filesystem)
│   ├── core/         # Central BoardService domain logic
│   └── mcp/          # Model Context Protocol server for AI agents
│
├── cli/              # 'openboard' command-line binary
├── docs/             # Technical architecture and guides
│   └── architecture.md
├── package.json      # Monorepo workspaces configuration
└── tsconfig.json     # Strict TypeScript project references
```

For in-depth architectural details and module boundaries, see [`docs/architecture.md`](docs/architecture.md).

---

## 🚀 Quick Start (Development)

### 1. Install dependencies
```bash
npm install
```

### 2. Build all packages and applications
```bash
npm run build
```

### 3. Start local development
You can run the web app and server in development mode:

```bash
# Start backend server
npm run dev --workspace=@openboard/server

# Start web dashboard (in another terminal)
npm run dev --workspace=@openboard/web
```

Or run via the OpenBoard CLI:
```bash
node ./cli/bin/openboard.js start --port 3000
```

### 4. Verify TypeScript and Health
```bash
# Type check all workspaces
npm run typecheck

# Check health endpoint
curl http://localhost:3000/api/health
```

---

## 📋 Project Status: Phase 1 Complete

* [x] TypeScript monorepo with npm workspaces
* [x] Deep module architecture for `shared`, `storage`, `core`, `mcp`, `server`, and `web`
* [x] Decoupled domain models (`BoardMetadata` vs `BoardDocument`)
* [x] `BoardStorage` abstraction and `MemoryBoardStorage`
* [x] Central `BoardService` domain layer
* [x] Health check endpoint `GET /api/health`
* [x] Minimal React Web app with routes (`/dashboard`, `/board/:id`, `/settings`)
* [x] CLI package with `openboard start` command
* [x] Architectural documentation

---

## 📄 License
MIT
