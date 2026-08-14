# Contributing to OpenBoard

Thank you for your interest in contributing to **OpenBoard**! We welcome contributions from developers, designers, and AI tool builders across the open-source ecosystem.

---

## ✦ Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Monorepo Architecture & Structure](#monorepo-architecture--structure)
3. [Local Development Setup](#local-development-setup)
4. [Development Workflow](#development-workflow)
5. [Coding Standards & Conventions](#coding-standards--conventions)
6. [Testing & Verification](#testing--verification)
7. [Submitting a Pull Request](#submitting-a-pull-request)
8. [Reporting Issues & Bugs](#reporting-issues--bugs)

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat everyone in the community with respect and empathy.

---

## Monorepo Architecture & Structure

OpenBoard is organized as an npm workspaces monorepo:

```text
openboard/
├── apps/
│   ├── web/           # React + Vite frontend (tldraw canvas, Twenty-inspired UI, Docs)
│   └── server/        # Express + SQLite API server + SSE live projection
├── packages/
│   ├── shared/        # Pure TypeScript models, DTOs, interfaces, and validation schemas
│   ├── storage/       # SQLiteBoardRepository with migrations and memory fallback
│   ├── core/          # BoardService, CanvasService, HeadlessSvgRenderer
│   └── mcp/           # OpenBoardMcpServer (JSON-RPC 2.0 stdio / SSE transport)
├── cli/               # openboard-app CLI runtime and asset embedding bundler
├── docs/              # In-depth architectural & agent integration documentation
└── .github/           # CI workflows and issue / PR templates
```

### Architectural Rules:
- **MCP does not connect directly to SQLite:** Always interact through `BoardService` and `CanvasService`.
- **MCP does not connect directly to React:** Canvas operations execute against a headless engine (`HeadlessCanvasEngine` and `HeadlessSvgRenderer`).
- **Browser-Optional:** All board mutations and canvas operations must succeed even if no browser is open.
- **Strict Separation of Concerns:** Stdio MCP transport writes JSON-RPC protocol frames only to `stdout`; all logs/diagnostics go to `stderr`.

---

## Local Development Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher (Recommended: `v20.x` or `v22.x`)
- **npm**: `v9.x` or higher
- **Git**

### Installation

```bash
# 1. Clone your fork of the repository
git clone https://github.com/<your-username>/openboard.git
cd openboard

# 2. Install dependencies across all monorepo workspaces
npm install

# 3. Build all internal packages
npm run build:packages
```

---

## Development Workflow

### Running Locally

```bash
# Start frontend and backend in watch / dev mode
npm run dev

# Or test the CLI start command directly
npm run build && node cli/dist/index.js start
```

### Testing MCP Server with an Agent

To test the MCP server in development with Claude Code, Cursor, or OpenCode:

```bash
# Start MCP server over stdio
node cli/dist/index.js mcp
```

Or configure your local AI agent client to run the built development binary:
```json
{
  "mcpServers": {
    "openboard-dev": {
      "command": "node",
      "args": ["/path/to/openboard/cli/dist/index.js", "mcp"]
    }
  }
}
```

---

## Coding Standards & Conventions

1. **TypeScript Strict Mode:** All packages strictly enforce `noImplicitAny`, `strictNullChecks`, and ES module imports (`import ... from './file.js'`).
2. **Design System & UI Components:**
   - Use centralized CSS custom properties in `apps/web/src/index.css` (`--bg-app`, `--bg-surface`, `--accent`, `--border-default`).
   - Use vector SVG icons from `apps/web/src/components/icons/Icons.tsx` instead of emojis or ad-hoc unicode characters.
   - Do not introduce TailwindCSS or bulky external UI component suites.
3. **Commit Conventions:** Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
   - `feat(component): add new feature`
   - `fix(canvas): correct arrow handle unbinding`
   - `docs(mcp): update Cursor configuration guide`
   - `refactor(storage): optimize SQLite migration query`
   - `test(core): add headless SVG bounds test`

---

## Testing & Verification

Before submitting code, ensure all quality gates pass:

```bash
# Run TypeScript typechecks across all 7 workspace packages
npm run typecheck

# Run test suite across all packages (36+ tests)
npm run test

# Build production artifacts (packages, Vite web app, CLI bundler)
npm run build
```

---

## Submitting a Pull Request

1. Create a feature branch from `master` / `main`:
   ```bash
   git checkout -b feat/my-new-feature
   ```
2. Commit your changes following commit guidelines.
3. Push to your fork:
   ```bash
   git push origin feat/my-new-feature
   ```
4. Open a Pull Request on GitHub against the `master` branch.
5. Ensure the PR title is descriptive and fill out the provided PR template.

---

## Reporting Issues & Bugs

- Check existing [GitHub Issues](https://github.com/atpaawej/openboard/issues) before opening a new issue.
- Use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md) for bugs.
- Use our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md) for proposals.
