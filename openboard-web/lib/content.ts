export interface DocItem {
  slug: string;
  title: string;
  subtitle: string;
  category: 'Getting Started' | 'Architecture' | 'MCP & AI Agents' | 'Reference';
  description: string;
  readTime: string;
  lastUpdated: string;
  content: string;
  toc: Array<{ id: string; title: string }>;
}

export interface BlogItem {
  slug: string;
  title: string;
  summary: string;
  targetKeyword: string;
  publishedDate: string;
  readTime: string;
  author: string;
  authorRole: string;
  tags: string[];
  content: string;
}

export interface ComparisonItem {
  slug: string;
  competitor: string;
  title: string;
  subtitle: string;
  targetKeyword: string;
  verdict: string;
  summary: string;
  features: Array<{
    feature: string;
    openboard: boolean | string;
    competitor: boolean | string;
    description: string;
  }>;
  pros: string[];
  competitorCons: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export interface IntegrationItem {
  slug: string;
  name: string;
  category: string;
  badge: string;
  title: string;
  description: string;
  configJson: string;
  envSnippet?: string;
  features: string[];
  steps: Array<{ title: string; detail: string; command?: string }>;
}

export const docsData: DocItem[] = [
  {
    slug: 'quickstart',
    title: 'Quickstart Guide',
    subtitle: 'Get up and running with OpenBoard in under 10 seconds with zero configuration.',
    category: 'Getting Started',
    description: 'Learn how to launch OpenBoard with npx, install it globally, or integrate it with your terminal workflow.',
    readTime: '3 min read',
    lastUpdated: '2026-08-17',
    toc: [
      { id: 'instant-launch-npx', title: 'Instant Launch via npx' },
      { id: 'global-installation', title: 'Global CLI Installation' },
      { id: 'local-sqlite-storage', title: 'Local SQLite Storage Location' },
      { id: 'browser-workspace', title: 'Accessing the Browser Workspace' },
      { id: 'next-steps', title: 'Next Steps & MCP Connection' },
    ],
    content: `
### Instant Launch via npx

The fastest way to use OpenBoard is via \`npx\`. No installation, configuration, or sign-up is required:

\`\`\`bash
npx openboard-app start
\`\`\`

This command automatically:
1. Initializes your local SQLite database at \`~/.openboard/openboard.db\` if it doesn't already exist.
2. Spawns the lightweight local HTTP and Server-Sent Events (SSE) server on \`http://localhost:4747\`.
3. Opens the OpenBoard dark-mode workspace in your default browser.

---

### Global Installation

If you use OpenBoard daily for system architecture, whiteboard sketching, or AI pair programming, install it globally:

\`\`\`bash
npm install -g openboard-app
\`\`\`

Once installed, use the short CLI command anywhere on your machine:

\`\`\`bash
# Start workspace server and open browser
openboard start

# Run in background daemon mode
openboard start --port 4747

# Start stdio Model Context Protocol server for AI Agents
openboard mcp
\`\`\`

---

### Local SQLite Storage Location

OpenBoard guarantees complete data sovereignty. All whiteboards, canvas documents, shapes, text, arrows, frames, and revision histories are stored on your local disk:

- **Database Path**: \`~/.openboard/openboard.db\`
- **Zero Cloud Sync**: No external database calls, telemetry pings, or cloud servers.
- **Easy Backups**: Simply copy \`~/.openboard/openboard.db\` to backup your entire canvas library or commit it to your private dotfiles.

---

### Accessing the Browser Workspace

Once the server is running, visit \`http://localhost:4747\` in your browser:
- **Responsive Canvas**: Ultra-smooth panning, infinite zoom, and high-performance vector rendering powered by tldraw.
- **Twenty-Inspired Dark Theme**: Deep charcoal surfaces (\`#0e0e11\`), electric blue accents (\`#2563eb\`), and high legibility.
- **Live Agent Synchronization**: Watch external AI coding agents (Claude Code, Cursor, Codex) create and modify shapes in real time over SSE streams.
    `
  },
  {
    slug: 'mcp-tools',
    title: '13 Semantic MCP Tools Reference',
    subtitle: 'High-level Model Context Protocol tools for AI agents to inspect and mutate whiteboards.',
    category: 'MCP & AI Agents',
    description: 'Comprehensive specification of all 13 semantic tools exposed by the OpenBoard MCP server for Claude Code, Cursor, and Codex.',
    readTime: '6 min read',
    lastUpdated: '2026-08-17',
    toc: [
      { id: 'mcp-overview', title: 'Model Context Protocol Overview' },
      { id: 'board-management-tools', title: 'Board Management Tools' },
      { id: 'canvas-mutation-tools', title: 'Canvas Mutation & Drawing Tools' },
      { id: 'headless-inspection-tools', title: 'Headless Inspection & Vector Export' },
      { id: 'mcp-json-config', title: 'Universal MCP Configuration' },
    ],
    content: `
### Model Context Protocol Overview

OpenBoard implements the open Model Context Protocol (MCP) standard over both **stdio** (standard input/output) and **HTTP/SSE**. This allows autonomous AI coding agents—such as **Claude Code**, **Cursor**, **Codex**, **OpenCode**, and **Hermes**—to interact with your canvas with native semantic precision instead of low-level coordinate guessing.

---

### Board Management Tools

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| \`list_boards\` | \`filter?: string\` | Returns all boards in the local SQLite database with IDs, titles, timestamps, and shape counts. |
| \`create_board\` | \`title: string, description?: string\` | Creates a new canvas board and returns the generated board ID. |
| \`get_board\` | \`boardId: string\` | Fetches complete board metadata and full shape state. |
| \`delete_board\` | \`boardId: string, permanent?: boolean\` | Moves a board to Trash or permanently deletes it. |

---

### Canvas Mutation & Drawing Tools

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| \`create_shape\` | \`boardId, type, x, y, props\` | Creates rectangles, ellipses, diamonds, text, arrows, and sticky notes. |
| \`batch_create_shapes\` | \`boardId, shapes[]\` | Creates multiple connected nodes, flowcharts, or architecture diagrams in a single transaction. |
| \`update_shape\` | \`boardId, shapeId, props\` | Updates shape coordinates, dimensions, text content, color, or fill style. |
| \`delete_shape\` | \`boardId, shapeId\` | Removes a specific shape or connector from the canvas. |
| \`create_arrow_connection\` | \`boardId, fromShapeId, toShapeId, label?\` | Creates a semantic directional connector between two visual elements. |
| \`group_shapes\` | \`boardId, shapeIds[], title?\` | Creates a container frame around related visual nodes. |

---

### Headless Inspection & Vector Export

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| \`inspect_canvas\` | \`boardId, depth?: number\` | Returns a structured semantic tree of all shapes, groups, and text labels for agent comprehension. |
| \`export_svg\` | \`boardId, shapeIds?: string[]\` | Renders a pixel-perfect vector SVG snapshot of the canvas without needing a headless Chromium browser. |
| \`search_canvas\` | \`query: string\` | Searches across all whiteboards for specific text labels, node titles, or architecture elements. |

---

### Universal MCP Configuration

To register OpenBoard with your favorite AI agent, add the following to your agent configuration file (\`claude_desktop_config.json\`, \`.cursor/mcp.json\`, or Claude Code settings):

\`\`\`json
{
  "mcpServers": {
    "openboard": {
      "command": "openboard",
      "args": ["mcp"]
    }
  }
}
\`\`\`
    `
  },
  {
    slug: 'agent-setup',
    title: 'AI Agent Setup (Claude Code, Cursor, Codex)',
    subtitle: 'Step-by-step integration guides for connecting your AI coding assistants with OpenBoard.',
    category: 'MCP & AI Agents',
    description: 'Detailed instructions to configure Claude Code, Cursor IDE, Claude Desktop, and OpenCode with OpenBoard MCP.',
    readTime: '4 min read',
    lastUpdated: '2026-08-17',
    toc: [
      { id: 'claude-code-setup', title: 'Claude Code Integration' },
      { id: 'cursor-setup', title: 'Cursor IDE Integration' },
      { id: 'claude-desktop-setup', title: 'Claude Desktop Integration' },
      { id: 'verifying-connection', title: 'Verifying the Connection' },
    ],
    content: `
### Claude Code Integration

Claude Code supports MCP servers directly. Configure OpenBoard in your global or project-level settings:

\`\`\`bash
# Add OpenBoard MCP server to Claude Code
claude mcp add openboard -- openboard mcp
\`\`\`

Alternatively, add it to your \`~/.claude/settings.json\`:

\`\`\`json
{
  "mcpServers": {
    "openboard": {
      "command": "openboard",
      "args": ["mcp"]
    }
  }
}
\`\`\`

Now you can prompt Claude in your terminal:
> *"Claude, diagram our backend authentication architecture on OpenBoard and link the JWT refresh token flow."*

Claude Code will automatically invoke \`create_board\` and \`batch_create_shapes\`, streaming the diagram directly to \`http://localhost:4747\`.

---

### Cursor IDE Integration

In Cursor, OpenBoard allows Cursor's agent to read and generate visual diagrams while coding.

1. Open **Cursor Settings** (\`Cmd + ,\` or \`Ctrl + ,\`).
2. Navigate to **Features** > **MCP Servers**.
3. Click **Add New MCP Server**:
   - **Name**: \`openboard\`
   - **Type**: \`command\`
   - **Command**: \`openboard mcp\`
4. Click **Save**. The green indicator will confirm the connection.

---

### Claude Desktop Integration

For the Claude Desktop app, edit \`claude_desktop_config.json\` located at:
- **macOS**: \`~/Library/Application Support/Claude/claude_desktop_config.json\`
- **Windows**: \`%APPDATA%\\Claude\\claude_desktop_config.json\`
- **Linux**: \`~/.config/Claude/claude_desktop_config.json\`

\`\`\`json
{
  "mcpServers": {
    "openboard": {
      "command": "npx",
      "args": ["-y", "openboard-app", "mcp"]
    }
  }
}
\`\`\`
    `
  },
  {
    slug: 'architecture',
    title: 'Architecture & Security Model',
    subtitle: 'Deep dive into OpenBoard SQLite persistence, headless canvas engine, and SSE live sync.',
    category: 'Architecture',
    description: 'Understand how OpenBoard delivers sub-millisecond local-first performance with zero telemetry and complete privacy.',
    readTime: '5 min read',
    lastUpdated: '2026-08-17',
    toc: [
      { id: 'core-architecture', title: 'Core Monorepo Architecture' },
      { id: 'sqlite-persistence', title: 'SQLite Local Persistence' },
      { id: 'headless-canvas-engine', title: 'Headless Canvas & SVG Engine' },
      { id: 'sse-live-sync', title: 'Real-Time Server-Sent Events (SSE)' },
      { id: 'security-guarantees', title: 'Privacy & Security Guarantees' },
    ],
    content: `
### Core Monorepo Architecture

OpenBoard is architected as a modular TypeScript monorepo designed for maximum performance, minimal resource footprint, and zero vendor lock-in:

\`\`\`
┌───────────────────────────────────────────────────────────┐
│                     EXTERNAL AI AGENT                     │
│     (Claude Code, Cursor, OpenCode, Codex, Hermes...)     │
└─────────────────────────────┬─────────────────────────────┘
                              │ JSON-RPC 2.0 (stdio / SSE)
                              ▼
┌───────────────────────────────────────────────────────────┐
│                   OPENBOARD MCP SERVER                    │
│               (13 High-Level Semantic Tools)              │
└──────────────┬─────────────────────────────┬──────────────┘
               │                             │
               ▼                             ▼
┌───────────────────────────┐ ┌─────────────────────────────┐
│   LOCAL SQLITE DATABASE   │ │   HEADLESS CANVAS ENGINE    │
│ (~/.openboard/openboard.db│ │  (tldraw store + SVG vector)│
└───────────────────────────┘ └──────────────┬──────────────┘
                                             │
                                             ▼ SSE Live Sync
                              ┌─────────────────────────────┐
                              │     BROWSER WHITEBOARD      │
                              │   (http://localhost:4747)   │
                              └─────────────────────────────┘
\`\`\`

---

### SQLite Local Persistence

Unlike cloud-based tools (Miro, FigJam, Lucidchart) that hold your data hostage on proprietary servers, OpenBoard persists all data to an embedded **SQLite** database using \`better-sqlite3\` for blazing sub-millisecond synchronous transactions.

- **Storage File**: \`~/.openboard/openboard.db\`
- **WAL Mode**: Write-Ahead Logging is enabled for safe concurrent writes from CLI, MCP agents, and web UI.
- **Relational Schema**: Boards, shapes, bindings, assets, and version vectors are neatly structured and queryable using standard SQL.

---

### Headless Canvas & SVG Engine

AI agents often need to inspect what is on a whiteboard or generate visual previews without spinning up a heavy browser instance. OpenBoard includes a headless canvas compiler in \`@openboard/core\`:
- Parses raw canvas state into semantic hierarchies (groups, flowchart trees, text entities).
- Generates pixel-perfect standalone SVG exports in under 5ms.

---

### Real-Time Server-Sent Events (SSE)

When you view a whiteboard at \`http://localhost:4747\`, the browser opens a persistent SSE stream to the local server. When an AI agent executes an MCP tool (e.g. adding 10 nodes to represent a microservice cluster), mutations stream instantly to your open tab without needing manual refresh.
    `
  },
  {
    slug: 'cli-reference',
    title: 'CLI Command Reference',
    subtitle: 'Complete guide to all OpenBoard terminal commands, options, and flags.',
    category: 'Reference',
    description: 'Explore the full openboard CLI syntax including start, mcp, export, info, and backup commands.',
    readTime: '3 min read',
    lastUpdated: '2026-08-17',
    toc: [
      { id: 'openboard-start', title: 'openboard start' },
      { id: 'openboard-mcp', title: 'openboard mcp' },
      { id: 'openboard-export', title: 'openboard export' },
      { id: 'openboard-info', title: 'openboard info' },
    ],
    content: `
### openboard start

Launches the OpenBoard workspace server and opens the browser interface.

\`\`\`bash
openboard start [options]
\`\`\`

**Options:**
- \`-p, --port <number>\`: Specify port (default: \`4747\`)
- \`-H, --host <string>\`: Host address to bind to (default: \`localhost\`)
- \`--no-open\`: Do not automatically open default browser
- \`--db <path>\`: Custom path to SQLite database file

---

### openboard mcp

Starts the Model Context Protocol stdio server for AI agents.

\`\`\`bash
openboard mcp [options]
\`\`\`

**Options:**
- \`--db <path>\`: Custom SQLite database path
- \`--log-level <level>\`: Set logging verbosity (\`error\`, \`warn\`, \`info\`, \`debug\`)

---

### openboard export

Exports a board or diagram directly to SVG or JSON from your command line.

\`\`\`bash
openboard export <board-id> --output ./architecture.svg
\`\`\`
    `
  },
  {
    slug: 'shortcuts',
    title: 'Keyboard Shortcuts',
    subtitle: 'Boost your visual sketching productivity with keyboard-first shortcuts.',
    category: 'Reference',
    description: 'Master all keyboard shortcuts for rapid whiteboard navigation, tool switching, and canvas management.',
    readTime: '2 min read',
    lastUpdated: '2026-08-17',
    toc: [
      { id: 'global-shortcuts', title: 'Global Shortcuts' },
      { id: 'tool-shortcuts', title: 'Canvas Tool Shortcuts' },
      { id: 'selection-navigation', title: 'Selection & Navigation' },
    ],
    content: `
### Global Shortcuts

- \`N\`: Create new whiteboard
- \`/\`: Focus board search
- \`Esc\`: Deselect all / dismiss dialogs
- \`Enter\`: Confirm dialog / create node
- \`Cmd / Ctrl + K\`: Open command palette

---

### Canvas Tool Shortcuts

- \`V\` or \`1\`: Select tool (pointer)
- \`D\` or \`2\`: Draw tool (freehand pen)
- \`E\` or \`3\`: Eraser tool
- \`R\` or \`4\`: Rectangle shape
- \`O\` or \`5\`: Ellipse shape
- \`T\` or \`6\`: Text tool
- \`A\` or \`7\`: Arrow connector tool
- \`S\` or \`8\`: Sticky note tool

---

### Selection & Navigation

- \`Space + Drag\`: Pan canvas
- \`Cmd / Ctrl + +\`: Zoom in
- \`Cmd / Ctrl + -\`: Zoom out
- \`Shift + 1\`: Zoom to fit all elements
- \`Cmd / Ctrl + D\`: Duplicate selected shapes
- \`Delete\` or \`Backspace\`: Delete selection
    `
  }
];

export const blogsData: BlogItem[] = [
  {
    slug: 'why-local-first-whiteboards-matter',
    title: 'Why Local-First Whiteboards are the Future of Secure Engineering',
    summary: 'Discover why top engineering teams and privacy-conscious developers are ditching cloud whiteboard subscriptions in favor of 100% private, local SQLite-backed infinite canvases.',
    targetKeyword: 'secure local white board',
    publishedDate: '2026-08-10',
    readTime: '5 min read',
    author: 'Aawej',
    authorRole: 'Creator of OpenBoard',
    tags: ['Local-First', 'Security', 'SQLite', 'Developer Tools', 'Privacy'],
    content: `
### The Cloud Whiteboard Dilemma

For years, software development teams have relied on cloud whiteboarding tools like Miro, FigJam, and Lucidchart to sketch system architectures, database schemas, and microservice workflows. However, storing proprietary technical diagrams on third-party cloud servers introduces significant security risks:

1. **Confidential Architecture Exposure**: Unreleased algorithms, network topologies, and proprietary infrastructure diagrams sit on shared multi-tenant cloud storage.
2. **Mandatory Cloud Accounts & Telemetry**: Every keystroke, mouse movement, and diagram revision is tracked, logged, and synced to remote analytics servers.
3. **Vendor Lock-in & Paywalls**: Exporting proprietary diagrams in standard formats is often gated behind premium enterprise subscription tiers.

---

### The Power of a Secure Local Whiteboard

A **secure local white board** flips this model entirely. By adhering to the **Local-First Software Manifesto**, tools like **OpenBoard** ensure your computer remains the single source of truth:

- **100% Offline & Private**: Works completely air-gapped without an internet connection.
- **Embedded SQLite Reliability**: All shapes, documents, and canvas metadata reside in \`~/.openboard/openboard.db\`.
- **Zero Telemetry**: No tracking cookies, no telemetry beacons, and zero cloud accounts.
- **Instant Version Control**: You can backup, copy, or version control your SQLite database with the same tools you use for code (Git, rsync, Time Machine).

---

### Bridging Human Developers and AI Coding Agents

The future of software engineering is collaborative between human developers and autonomous AI coding agents (Claude Code, Cursor, Codex). Cloud-based tools fail in this ecosystem because giving an AI agent API access requires complex OAuth handshakes, rate limits, and latency overhead.

With OpenBoard's local Model Context Protocol (MCP) server, external AI agents connect over standard input/output (\`stdio\`) or local HTTP/SSE. Agents can inspect your system diagram, suggest optimizations, and generate complex architectural schemas in milliseconds with zero cloud exposure.
    `
  },
  {
    slug: 'open-source-whiteboard-guide',
    title: 'Open Source Board: The Developer\'s Guide to 100% Private Visual Collaboration',
    summary: 'Everything you need to know about choosing, deploying, and building with open-source whiteboard workspaces without paying monthly SaaS subscriptions.',
    targetKeyword: 'opensource board',
    publishedDate: '2026-08-05',
    readTime: '6 min read',
    author: 'Aawej',
    authorRole: 'Creator of OpenBoard',
    tags: ['Open Source', 'Architecture', 'tldraw', 'MCP', 'Productivity'],
    content: `
### What Makes an Open Source Board Truly Great?

When searching for an **opensource board**, developers and technical teams prioritize three core qualities:

1. **True Permissive Licensing**: Free under the MIT or Apache 2.0 license with zero commercial restrictions.
2. **Frictionless Developer Experience**: The ability to launch instantly via \`npx\` without needing Docker compose clusters, PostgreSQL setups, or Redis queues.
3. **Extensibility & Agent Protocol Support**: Modern open-source visual workspaces must bridge human sketchpads and AI coding assistants via open protocols like MCP.

---

### OpenBoard vs Legacy Open-Source Whiteboards

While open-source canvas libraries exist, most require developers to build their own backend, manage authentication, or accept cloud-only persistence models.

**OpenBoard** solves this out of the box:
- **Instant \`npx\` launch**: \`npx openboard-app start\` spawns a complete local workspace in 2 seconds.
- **Native MCP Server**: Exposes 13 high-level semantic tools for Claude Code, Cursor, and Codex.
- **Twenty-Inspired Dark Theme**: Aesthetic near-black surfaces (\`#0e0e11\`) tailored for nighttime development workflows.
- **Headless Vector Engine**: Render pixel-perfect SVGs from the terminal without browser overhead.

---

### How to Get Started Today

You can run OpenBoard right now with a single terminal command:

\`\`\`bash
npx openboard-app start
\`\`\`

Join the open-source movement on GitHub: [atpaawej/openboard](https://github.com/atpaawej/openboard) — star the repository, contribute features, and own your visual workspace forever.
    `
  },
  {
    slug: 'supercharge-ai-coding-agents-with-mcp',
    title: 'Supercharging AI Coding Agents with Model Context Protocol (MCP) and Whiteboards',
    summary: 'Learn how to give Claude Code, Cursor, and Codex the superpower of visual architecture diagramming through OpenBoard\'s 13 semantic MCP tools.',
    targetKeyword: 'mcp whiteboard',
    publishedDate: '2026-07-28',
    readTime: '7 min read',
    author: 'Aawej',
    authorRole: 'Creator of OpenBoard',
    tags: ['MCP', 'AI Agents', 'Claude Code', 'Cursor', 'Automation'],
    content: `
### Why Text-Only AI Coding Agents Hit a Wall

Large Language Models (LLMs) excel at writing code, refactoring functions, and writing tests. However, when dealing with complex system architecture—such as distributed microservices, event-driven message queues, or multi-tenant database relationships—textual markdown explanations quickly become overwhelming.

Visual diagrams are the universal language of system design. But until now, AI agents couldn't easily visualize their reasoning for human developers.

---

### Enter the Model Context Protocol (MCP) Whiteboard

Anthropic's **Model Context Protocol (MCP)** provides an open standard for LLMs to safely interact with local tools and applications.

By running OpenBoard as an MCP server, your AI coding agent gains 13 semantic canvas superpowers:
- **\`create_board\`**: Creates a dedicated whiteboard for the current feature or refactor.
- **\`batch_create_shapes\`**: Constructs interconnected microservice nodes, databases, and message brokers with labels, colors, and coordinates in one call.
- **\`create_arrow_connection\`**: Links services with directional arrows representing REST, gRPC, or WebSockets.
- **\`inspect_canvas\`**: Allows the agent to read existing diagrams created by humans to understand project architecture before generating code.

---

### Live Synchronization in Action

When you run Claude Code in your terminal and OpenBoard in your browser:
1. You ask: *"Claude, map out our payment gateway webhook handling flow."*
2. Claude uses OpenBoard's MCP tools to build the flowchart.
3. Server-Sent Events (SSE) push every node to your browser canvas in real time.
4. You visually inspect the diagram, make manual adjustments on the canvas, and ask Claude to proceed with the code implementation!
    `
  }
];

export const comparisonsData: ComparisonItem[] = [
  {
    slug: 'openboard-vs-excalidraw',
    competitor: 'Excalidraw',
    title: 'OpenBoard vs Excalidraw: Secure Local-First Open Source Board',
    subtitle: 'Compare OpenBoard and Excalidraw for developer architecture, AI agent MCP integration, and local SQLite persistence.',
    targetKeyword: 'opensource board',
    verdict: 'Choose OpenBoard if you need native Model Context Protocol (MCP) support for AI coding agents (Claude Code, Cursor), SQLite local persistence with multi-board management, and a modern Twenty-inspired dark workspace. Choose Excalidraw for hand-drawn sketch aesthetics and browser-only local storage.',
    summary: 'While Excalidraw popularized browser sketching with a hand-drawn style, OpenBoard is engineered specifically for modern developer workflows and autonomous AI agents with native SQLite storage, 13 MCP tools, and live SSE streaming.',
    features: [
      { feature: 'Model Context Protocol (MCP) for AI Agents', openboard: '13 Semantic Tools (stdio + SSE)', competitor: 'No Native MCP Server', description: 'Allows Claude Code, Cursor, and Codex to autonomously create and inspect diagrams.' },
      { feature: 'Storage & Persistence', openboard: 'Local SQLite Database (~/.openboard/openboard.db)', competitor: 'Browser LocalStorage / Cloud SaaS', description: 'Reliable multi-board relational persistence with zero cloud account dependencies.' },
      { feature: 'Multi-board Dashboard & Favorites', openboard: true, competitor: 'Cloud Subscription Only', description: 'Organize dozens of architectural whiteboards with soft delete, favorites, and search.' },
      { feature: 'Live AI Agent Browser Sync', openboard: 'Real-time Server-Sent Events (SSE)', competitor: false, description: 'Mutations from terminal coding agents project instantly into the open browser tab.' },
      { feature: 'Headless Vector SVG Export', openboard: 'CLI & MCP (Sub-5ms)', competitor: 'Browser DOM Dependent', description: 'Export diagrams directly from terminal scripts without spinning up Chromium.' },
      { feature: 'License', openboard: 'MIT (100% Open Source)', competitor: 'MIT (Core) / Closed (Cloud SaaS)', description: 'Full freedom to self-host, fork, and embed anywhere.' },
    ],
    pros: [
      'Native AI Agent MCP Integration for Claude Code, Cursor, and Codex',
      'Robust Local SQLite storage with zero cloud leaks and zero telemetry',
      'Multi-board management with Trash, Duplication, and Favorites out of the box',
      'Headless canvas inspection and instant vector SVG generation'
    ],
    competitorCons: [
      'Lacks native Model Context Protocol (MCP) server for AI coding agents',
      'Multi-board cloud workspaces require paid subscriptions or complex self-hosting',
      'Browser local storage can be accidentally wiped when clearing browser cache'
    ],
    faqs: [
      { question: 'Is OpenBoard 100% free and open source?', answer: 'Yes! OpenBoard is fully open-source under the MIT license. You can run it locally with zero subscriptions or restrictions.' },
      { question: 'How is OpenBoard different from Excalidraw?', answer: 'OpenBoard is built specifically for developers and AI agents. It features an embedded SQLite database, a built-in MCP server for tools like Claude Code and Cursor, and real-time live browser synchronization.' },
      { question: 'Can I migrate my diagrams?', answer: 'Yes, OpenBoard supports standard SVG vector exports and JSON snapshots.' }
    ]
  },
  {
    slug: 'openboard-vs-miro',
    competitor: 'Miro',
    title: 'OpenBoard vs Miro: Why Developers Choose Secure Local Whiteboards',
    subtitle: 'Compare 100% private, local SQLite whiteboard OpenBoard with proprietary cloud SaaS Miro.',
    targetKeyword: 'secure local white board',
    verdict: 'Choose OpenBoard for 100% private, air-gapped system design with zero telemetry, zero monthly subscriptions, and native AI coding agent integrations. Choose Miro if your non-technical marketing team requires enterprise board templates.',
    summary: 'Miro requires enterprise cloud subscriptions and transmits proprietary system architecture to remote servers. OpenBoard delivers an ultra-fast, local-first infinite canvas stored safely on your machine in SQLite with zero telemetry.',
    features: [
      { feature: 'Privacy & Data Ownership', openboard: '100% Local SQLite (Air-Gapped)', competitor: 'Multi-Tenant Cloud SaaS', description: 'Your confidential system architecture never leaves your local machine.' },
      { feature: 'Pricing & Licensing', openboard: '100% Free & Open Source (MIT)', competitor: '$8 - $20/user/month', description: 'Zero recurring fees, zero artificial user seat limits.' },
      { feature: 'AI Agent Coding Integration (MCP)', openboard: 'Native stdio & SSE Server', competitor: 'Proprietary Cloud Webhooks', description: 'Direct high-speed integration with Cursor, Claude Code, and terminal agents.' },
      { feature: 'Offline Operation', openboard: 'Full Offline Capability', competitor: 'Requires Active Internet Connection', description: 'Work on planes, remote environments, or secure corporate networks.' },
      { feature: 'Telemetry & Tracking', openboard: '0% (Zero Telemetry)', competitor: 'Extensive Analytics & Cookies', description: 'Complete privacy without third-party tracking scripts.' },
    ],
    pros: [
      'Complete air-gapped data security for proprietary enterprise architecture',
      'No monthly recurring SaaS fees or seat licenses',
      'Instant npx startup with zero login or signup requirements',
      'Seamless Model Context Protocol integration with AI assistants'
    ],
    competitorCons: [
      'Expensive per-seat pricing that scales rapidly with team size',
      'All diagrams reside on third-party cloud infrastructure',
      'Cannot be used offline or in strict air-gapped enterprise environments'
    ],
    faqs: [
      { question: 'Can I use OpenBoard for commercial software architecture?', answer: 'Yes! OpenBoard is MIT-licensed and completely free for commercial and personal use.' },
      { question: 'Where is my data stored?', answer: 'All whiteboards are stored locally in your SQLite database at ~/.openboard/openboard.db.' },
      { question: 'Does OpenBoard send telemetry to any servers?', answer: 'No. OpenBoard has zero telemetry, zero analytics, and zero cloud dependencies.' }
    ]
  },
  {
    slug: 'openboard-vs-tldraw',
    competitor: 'tldraw Standalone',
    title: 'OpenBoard vs tldraw: Full Workspace & MCP Server vs Raw Canvas Library',
    subtitle: 'Learn how OpenBoard builds on the power of tldraw to deliver a complete developer workspace.',
    targetKeyword: 'openboard',
    verdict: 'OpenBoard incorporates tldraw\'s legendary infinite canvas engine and pairs it with a production-grade local SQLite persistence layer, multi-board dashboard, and a 13-tool Model Context Protocol (MCP) server for AI coding agents.',
    summary: 'While tldraw provides a magnificent canvas SDK, OpenBoard delivers the complete batteries-included workspace application for developers who want instant multi-board management, local SQLite persistence, and AI agent integration out of the box.',
    features: [
      { feature: 'Canvas Engine', openboard: 'Powered by tldraw Canvas', competitor: 'tldraw Canvas SDK', description: 'Smooth vector rendering and intuitive drawing tools.' },
      { feature: 'Model Context Protocol (MCP)', openboard: '13 Semantic Tools Built-In', competitor: 'Requires Custom Implementation', description: 'Ready-to-use stdio/SSE server for Claude Code and Cursor.' },
      { feature: 'Embedded SQLite Storage Engine', openboard: 'Built-in (~/.openboard/openboard.db)', competitor: 'Memory / Browser LocalStorage', description: 'Persistent local storage with multi-board relational queries.' },
      { feature: 'Ready-to-Use CLI Application', openboard: 'npx openboard-app start', competitor: 'Developer Component / Library', description: 'Instant CLI launch with zero code setup required.' },
    ],
    pros: [
      'Turnkey developer application ready with one npx command',
      '13 high-level semantic MCP tools for AI agents',
      'Multi-board management, trash, favorites, and duplication',
      'Full dark-mode workspace inspired by Twenty'
    ],
    competitorCons: [
      'Raw library requires building your own backend and database storage',
      'No out-of-the-box MCP server for autonomous AI coding agents'
    ],
    faqs: [
      { question: 'Does OpenBoard use tldraw?', answer: 'Yes! OpenBoard leverages tldraw for its incredible infinite canvas and pairs it with a local SQLite database, CLI tools, and a full Model Context Protocol server.' },
      { question: 'Can I use OpenBoard without coding?', answer: 'Yes! Just run `npx openboard-app start` in your terminal and your personal whiteboard workspace opens automatically in your browser.' }
    ]
  }
];

export const integrationsData: IntegrationItem[] = [
  {
    slug: 'claude-code',
    name: 'Claude Code',
    category: 'Terminal AI Assistant',
    badge: 'Official MCP stdio & SSE',
    title: 'Connect OpenBoard with Claude Code in 30 Seconds',
    description: 'Empower Anthropic\'s Claude Code CLI to sketch system architecture, create microservice flowcharts, and inspect whiteboards directly from your terminal.',
    configJson: `{
  "mcpServers": {
    "openboard": {
      "command": "openboard",
      "args": ["mcp"]
    }
  }
}`,
    features: [
      '13 high-level semantic tools for creating and mutating canvas elements',
      'Real-time live projection into your browser tab via Server-Sent Events',
      'Sub-5ms headless canvas inspection and vector SVG snapshot generation',
      '100% private local SQLite persistence with zero cloud leaks'
    ],
    steps: [
      {
        title: '1. Install OpenBoard Globally',
        detail: 'Ensure OpenBoard is installed globally so the CLI is accessible anywhere in your PATH:',
        command: 'npm install -g openboard-app'
      },
      {
        title: '2. Register MCP Server with Claude Code',
        detail: 'Run the native Claude Code MCP registration command:',
        command: 'claude mcp add openboard -- openboard mcp'
      },
      {
        title: '3. Launch OpenBoard Workspace',
        detail: 'In a separate terminal tab, launch your OpenBoard visual workspace:',
        command: 'openboard start'
      },
      {
        title: '4. Prompt Claude Code to Diagram',
        detail: 'Ask Claude Code in your terminal to build architecture diagrams:',
        command: 'claude "Map out our Redis caching layer and Postgres read replica architecture on OpenBoard"'
      }
    ]
  },
  {
    slug: 'cursor',
    name: 'Cursor IDE',
    category: 'AI Code Editor',
    badge: 'Cursor MCP Native',
    title: 'Visual System Architecture & Whiteboard in Cursor IDE',
    description: 'Give Cursor\'s AI Agent the capability to inspect your local whiteboard and generate architectural diagrams while you write code.',
    configJson: `{
  "mcpServers": {
    "openboard": {
      "command": "openboard",
      "args": ["mcp"]
    }
  }
}`,
    features: [
      'Seamless integration inside Cursor Composer and Chat',
      'Direct visual validation of database schemas and API workflows',
      'Automatic synchronization with your local SQLite database',
      'Zero cloud subscriptions or third-party API dependencies'
    ],
    steps: [
      {
        title: '1. Install OpenBoard',
        detail: 'Install OpenBoard globally on your system:',
        command: 'npm install -g openboard-app'
      },
      {
        title: '2. Open Cursor Settings',
        detail: 'Open Cursor Settings (Cmd + , on macOS, Ctrl + , on Linux/Windows) and navigate to Features > MCP Servers.'
      },
      {
        title: '3. Add OpenBoard Server',
        detail: 'Click "Add New MCP Server", set Name to "openboard", Type to "command", and Command to "openboard mcp".'
      },
      {
        title: '4. Start Diagramming in Cursor Chat',
        detail: 'Prompt Cursor: "Review our database schema and create a visual entity-relationship diagram on OpenBoard."'
      }
    ]
  },
  {
    slug: 'claude-desktop',
    name: 'Claude Desktop',
    category: 'Desktop AI App',
    badge: 'Stdio MCP Protocol',
    title: 'Visual Whiteboard Workspace for Claude Desktop',
    description: 'Connect Anthropic\'s official Claude Desktop application to OpenBoard via local stdio for visual reasoning and brainstorming.',
    configJson: `{
  "mcpServers": {
    "openboard": {
      "command": "npx",
      "args": ["-y", "openboard-app", "mcp"]
    }
  }
}`,
    features: [
      'Works with standard Anthropic Claude Desktop on macOS, Windows, and Linux',
      'No global installation required (runs directly via npx)',
      'Inspect existing boards and create new visual flowcharts',
      'Safe local SQLite sandbox with zero remote data transfer'
    ],
    steps: [
      {
        title: '1. Open Claude Desktop Config',
        detail: 'Open your claude_desktop_config.json file in your user application directory.'
      },
      {
        title: '2. Paste MCP Server Configuration',
        detail: 'Add the openboard configuration snippet to your mcpServers block.'
      },
      {
        title: '3. Restart Claude Desktop',
        detail: 'Restart Claude Desktop. The hammer icon will indicate OpenBoard\'s 13 semantic tools are active.'
      }
    ]
  }
];

export const homeFaqs = [
  {
    question: 'What is OpenBoard and why is it called local-first?',
    answer:
      'OpenBoard is a modern, lightweight personal whiteboard workspace designed for developers and autonomous AI agents. It is local-first because all whiteboards, canvas documents, and metadata reside exclusively on your machine in a local SQLite database (~/.openboard/openboard.db). There are zero cloud dependencies, zero accounts required, and zero telemetry tracking.'
  },
  {
    question: 'How do AI coding agents like Claude Code and Cursor connect to OpenBoard?',
    answer:
      'OpenBoard includes a built-in Model Context Protocol (MCP) server that communicates over stdio and HTTP/SSE. It exposes 13 high-level semantic tools (such as create_board, batch_create_shapes, create_arrow_connection, and inspect_canvas) that let AI agents inspect existing diagrams and draw complex system architectures in real time.'
  },
  {
    question: 'How does live browser synchronization work if there is no cloud backend?',
    answer:
      'When you open http://localhost:4747 in your browser, OpenBoard establishes a persistent Server-Sent Events (SSE) stream with your local Node.js process. When an AI agent modifies the canvas via an MCP tool, mutations stream instantly into your browser viewport with zero perceptible latency.'
  },
  {
    question: 'Is OpenBoard completely free and open source?',
    answer:
      'Yes, OpenBoard is 100% open-source software licensed under the permissive MIT license. You can use it freely for personal projects, commercial software development, or enterprise air-gapped infrastructure.'
  },
  {
    question: 'How do I backup or move my whiteboards between computers?',
    answer:
      'Because all data is stored in standard SQLite, you can simply copy ~/.openboard/openboard.db or commit it to your private dotfiles repository. You have total data sovereignty.'
  },
  {
    question: 'How does OpenBoard compare to Excalidraw or Miro?',
    answer:
      'Unlike Miro, OpenBoard requires no monthly subscriptions, works 100% offline, and never sends your proprietary architecture diagrams to third-party clouds. Unlike standard browser-only whiteboards, OpenBoard provides robust multi-board relational persistence, a 13-tool MCP server for AI agents, and sub-5ms headless SVG vector generation from the CLI.'
  }
];
