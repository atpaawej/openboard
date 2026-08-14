import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  IconTerminal,
  IconLayers,
  IconCpu,
  IconSettings,
  IconGrid,
  IconAlertCircle,
  IconCheck,
  IconCopy,
  IconSearch,
} from '../components/icons/Icons.js';

interface DocSection {
  id: string;
  title: string;
  category: 'core' | 'mcp' | 'agents';
  icon: React.ReactNode;
}

const SECTIONS: DocSection[] = [
  { id: 'getting-started', title: 'Getting Started', category: 'core', icon: <IconTerminal size={15} /> },
  { id: 'architecture', title: 'System Architecture', category: 'core', icon: <IconLayers size={15} /> },
  { id: 'mcp-overview', title: 'MCP Overview & Design', category: 'mcp', icon: <IconCpu size={15} /> },
  { id: 'mcp-tools', title: 'MCP Tools Reference', category: 'mcp', icon: <IconSettings size={15} /> },
  {
    id: 'visual-inspection',
    title: 'Visual Inspection & Vision',
    category: 'mcp',
    icon: <IconGrid size={15} />,
  },
  { id: 'mcp-connection', title: 'Connection & Stdio Protocol', category: 'mcp', icon: <IconTerminal size={15} /> },
  { id: 'troubleshooting', title: 'Troubleshooting & FAQs', category: 'mcp', icon: <IconAlertCircle size={15} /> },
  { id: 'agent-claude-code', title: 'Claude Code', category: 'agents', icon: <IconCpu size={15} /> },
  { id: 'agent-cursor', title: 'Cursor IDE', category: 'agents', icon: <IconCpu size={15} /> },
  { id: 'agent-opencode', title: 'OpenCode', category: 'agents', icon: <IconCpu size={15} /> },
  { id: 'agent-codex', title: 'OpenAI Codex / Agents SDK', category: 'agents', icon: <IconCpu size={15} /> },
  { id: 'agent-openclaw', title: 'OpenClaw', category: 'agents', icon: <IconCpu size={15} /> },
  { id: 'agent-hermes', title: 'Hermes Agent', category: 'agents', icon: <IconCpu size={15} /> },
  { id: 'agent-generic', title: 'Generic MCP Client', category: 'agents', icon: <IconTerminal size={15} /> },
];

export const DocsView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSectionId = searchParams.get('topic') || 'getting-started';
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedToolCategory, setSelectedToolCategory] = useState<'all' | 'board' | 'canvas'>(
    'all',
  );

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredSections = SECTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="docs-page-container">
      {/* Docs Left Navigation Panel */}
      <aside className="docs-nav-panel">
        <div className="docs-nav-header">
          <div className="docs-nav-title-row">
            <span className="docs-badge">Documentation</span>
            <span className="docs-version-pill">v0.1.0</span>
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '8px', color: 'var(--text-muted)', display: 'inline-flex' }}>
              <IconSearch size={13} />
            </span>
            <input
              type="text"
              className="docs-search-input"
              style={{ width: '100%', paddingLeft: '28px' }}
              placeholder="Search guides & tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <nav className="docs-nav-links">
          <div className="docs-nav-group-title">Core Workspace</div>
          {filteredSections
            .filter((s) => s.category === 'core')
            .map((s) => (
              <button
                key={s.id}
                type="button"
                className={`docs-nav-item ${activeSectionId === s.id ? 'active' : ''}`}
                onClick={() => setSearchParams({ topic: s.id })}
              >
                <span className="docs-nav-icon">{s.icon}</span>
                <span>{s.title}</span>
              </button>
            ))}

          <div className="docs-nav-group-title">Model Context Protocol</div>
          {filteredSections
            .filter((s) => s.category === 'mcp')
            .map((s) => (
              <button
                key={s.id}
                type="button"
                className={`docs-nav-item ${activeSectionId === s.id ? 'active' : ''}`}
                onClick={() => setSearchParams({ topic: s.id })}
              >
                <span className="docs-nav-icon">{s.icon}</span>
                <span>{s.title}</span>
              </button>
            ))}

          <div className="docs-nav-group-title">AI Agent Integrations</div>
          {filteredSections
            .filter((s) => s.category === 'agents')
            .map((s) => (
              <button
                key={s.id}
                type="button"
                className={`docs-nav-item ${activeSectionId === s.id ? 'active' : ''}`}
                onClick={() => setSearchParams({ topic: s.id })}
              >
                <span className="docs-nav-icon">{s.icon}</span>
                <span>{s.title}</span>
              </button>
            ))}
        </nav>
      </aside>

      {/* Docs Main Content Panel */}
      <div className="docs-content-panel">
        <div className="docs-content-body">
          {activeSectionId === 'getting-started' && (
            <GettingStartedDoc copy={copyToClipboard} copiedKey={copiedKey} />
          )}
          {activeSectionId === 'architecture' && (
            <ArchitectureDoc copy={copyToClipboard} copiedKey={copiedKey} />
          )}
          {activeSectionId === 'mcp-overview' && (
            <McpOverviewDoc copy={copyToClipboard} copiedKey={copiedKey} />
          )}
          {activeSectionId === 'mcp-tools' && (
            <McpToolsDoc
              copy={copyToClipboard}
              copiedKey={copiedKey}
              category={selectedToolCategory}
              setCategory={setSelectedToolCategory}
            />
          )}
          {activeSectionId === 'visual-inspection' && (
            <VisualInspectionDoc copy={copyToClipboard} copiedKey={copiedKey} />
          )}
          {activeSectionId === 'mcp-connection' && (
            <McpConnectionDoc copy={copyToClipboard} copiedKey={copiedKey} />
          )}
          {activeSectionId === 'troubleshooting' && (
            <TroubleshootingDoc copy={copyToClipboard} copiedKey={copiedKey} />
          )}
          {activeSectionId === 'agent-claude-code' && (
            <ClaudeCodeDoc copy={copyToClipboard} copiedKey={copiedKey} />
          )}
          {activeSectionId === 'agent-cursor' && (
            <CursorDoc copy={copyToClipboard} copiedKey={copiedKey} />
          )}
          {activeSectionId === 'agent-opencode' && (
            <OpenCodeDoc copy={copyToClipboard} copiedKey={copiedKey} />
          )}
          {activeSectionId === 'agent-codex' && (
            <CodexDoc copy={copyToClipboard} copiedKey={copiedKey} />
          )}
          {activeSectionId === 'agent-openclaw' && (
            <OpenClawDoc copy={copyToClipboard} copiedKey={copiedKey} />
          )}
          {activeSectionId === 'agent-hermes' && (
            <HermesDoc copy={copyToClipboard} copiedKey={copiedKey} />
          )}
          {activeSectionId === 'agent-generic' && (
            <GenericMcpDoc copy={copyToClipboard} copiedKey={copiedKey} />
          )}
        </div>
      </div>
    </div>
  );
};

// ─── DOCUMENTATION CONTENT COMPONENTS ──────────────────────────────────────

interface DocProps {
  copy: (text: string, key: string) => void;
  copiedKey: string | null;
}

const CodeBox: React.FC<{
  code: string;
  lang?: string;
  copyKey: string;
  copy: (text: string, key: string) => void;
  copiedKey: string | null;
}> = ({ code, lang = 'bash', copyKey, copy, copiedKey }) => (
  <div className="docs-code-card">
    <div className="docs-code-header">
      <span className="docs-code-lang">{lang}</span>
      <button
        type="button"
        className="docs-copy-btn"
        onClick={() => copy(code, copyKey)}
        title="Copy code"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
      >
        {copiedKey === copyKey ? (
          <>
            <IconCheck size={12} style={{ color: 'var(--success)' }} />
            <span style={{ color: 'var(--success)' }}>Copied</span>
          </>
        ) : (
          <>
            <IconCopy size={12} />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
    <pre className="docs-code-pre">
      <code>{code}</code>
    </pre>
  </div>
);

const GettingStartedDoc: React.FC<DocProps> = ({ copy, copiedKey }) => (
  <article className="docs-article">
    <div className="docs-header">
      <span className="docs-tag">Guide</span>
      <h1>Getting Started with OpenBoard</h1>
      <p className="docs-lead">
        OpenBoard is a local-first personal whiteboard workspace designed for developers and
        external AI coding agents.
      </p>
    </div>

    <div className="docs-callout docs-callout-info">
      <strong>Hard Boundary:</strong> OpenBoard is pure developer & agent infrastructure. It does
      not bundle internal LLMs, API keys, or agent loops. External agents (Claude Code, Cursor,
      OpenCode, Codex, Hermes, OpenClaw) connect via standard MCP over stdio.
    </div>

    <h2>1. Installation</h2>
    <p>Install OpenBoard globally via npm or run directly with npx:</p>
    <CodeBox
      code="npm install -g openboard"
      copyKey="install-npm"
      copy={copy}
      copiedKey={copiedKey}
    />

    <h2>2. Starting the Workspace</h2>
    <p>Launch the OpenBoard local workspace server and dashboard:</p>
    <CodeBox code="openboard start" copyKey="start-cmd" copy={copy} copiedKey={copiedKey} />
    <p>
      By default, OpenBoard binds strictly to <code>localhost:4747</code> and opens the browser
      dashboard.
    </p>

    <h2>3. CLI Commands</h2>
    <table className="docs-table">
      <thead>
        <tr>
          <th>Command</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <code>openboard start</code>
          </td>
          <td>Start local server & dashboard UI</td>
        </tr>
        <tr>
          <td>
            <code>openboard mcp</code>
          </td>
          <td>Start Model Context Protocol server on stdio</td>
        </tr>
        <tr>
          <td>
            <code>openboard info</code>
          </td>
          <td>Display system configuration & agent setup details</td>
        </tr>
        <tr>
          <td>
            <code>openboard --help</code>
          </td>
          <td>Show all available CLI flags and options</td>
        </tr>
      </tbody>
    </table>

    <h2>4. Local Data & Privacy</h2>
    <p>All whiteboard documents, shapes, metadata, and history are stored locally in SQLite at:</p>
    <CodeBox
      code="~/.openboard/openboard.db"
      lang="text"
      copyKey="db-path"
      copy={copy}
      copiedKey={copiedKey}
    />
    <p>
      No external servers, cloud accounts, or trackers are used. Your data never leaves your
      machine.
    </p>
  </article>
);

const ArchitectureDoc: React.FC<DocProps> = () => (
  <article className="docs-article">
    <div className="docs-header">
      <span className="docs-tag">Architecture</span>
      <h1>System Architecture & Deep Modules</h1>
      <p className="docs-lead">
        OpenBoard is organized around deep module boundaries with clean separation between CLI,
        Server, MCP, Domain Services, and SQLite persistence.
      </p>
    </div>

    <h2>System Architecture Diagram</h2>
    <div className="docs-diagram-card">
      <pre className="docs-ascii-diagram">{`
                         OPENBOARD
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
       CLI                 Web                 MCP
        │                   │                   │
        │             Dashboard/Canvas    External Agents
        │                   │             Claude / Cursor /
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
      `}</pre>
    </div>

    <h2>Core Architectural Invariants</h2>
    <div className="docs-card-grid">
      <div className="docs-card">
        <h3>1. Browser Optionality</h3>
        <p>
          AI agents can list, create, update, inspect, screenshot, and manage boards entirely
          headlessly. The browser is never required for MCP operations.
        </p>
      </div>
      <div className="docs-card">
        <h3>2. Explicit Board Addressing</h3>
        <p>
          There is no global or implicit "active board". All MCP tools explicitly accept a{' '}
          <code>board_id</code>, ensuring deterministic concurrent agent workflows.
        </p>
      </div>
      <div className="docs-card">
        <h3>3. Clean Domain Separation</h3>
        <p>
          The MCP layer and HTTP routes delegate directly to <code>BoardService</code> and{' '}
          <code>CanvasService</code>. Business rules and tldraw normalization are never duplicated.
        </p>
      </div>
      <div className="docs-card">
        <h3>4. Live SSE Projection</h3>
        <p>
          When a board is mounted in a live browser, agent mutations persisted in SQLite are
          simultaneously streamed via Server-Sent Events into the client canvas.
        </p>
      </div>
    </div>
  </article>
);

const McpOverviewDoc: React.FC<DocProps> = ({ copy, copiedKey }) => (
  <article className="docs-article">
    <div className="docs-header">
      <span className="docs-tag">MCP</span>
      <h1>Model Context Protocol (MCP) Overview</h1>
      <p className="docs-lead">
        Model Context Protocol enables external AI coding agents to discover, create, update, and
        visually inspect whiteboards.
      </p>
    </div>

    <h2>Design Principles</h2>
    <ul>
      <li>
        <strong>Small & Semantic:</strong> 13 expressive tools instead of dozens of fragmented
        low-level commands.
      </li>
      <li>
        <strong>Token Efficiency:</strong> Clean summaries and bounding boxes without dumping
        massive tldraw JSON snapshots.
      </li>
      <li>
        <strong>Stable Identifiers:</strong> Shape IDs (e.g. <code>api_server</code>) remain stable
        and referenceable across operations.
      </li>
      <li>
        <strong>Relationship Bindings:</strong> Arrows natively expose and bind <code>from</code>{' '}
        and <code>to</code> shape connections.
      </li>
      <li>
        <strong>Self-Documenting:</strong> Rich parameter schemas with recovery guidance on
        user/agent errors.
      </li>
    </ul>

    <h2>Starting the MCP Server</h2>
    <p>Run the stdio MCP transport:</p>
    <CodeBox code="openboard mcp" copyKey="openboard-mcp-cmd" copy={copy} copiedKey={copiedKey} />
    <p>
      All JSON-RPC protocol messages use <code>stdout</code>. All startup notices, logs, and
      diagnostics are routed strictly to <code>stderr</code>.
    </p>
  </article>
);

const McpToolsDoc: React.FC<
  DocProps & {
    category: 'all' | 'board' | 'canvas';
    setCategory: (c: 'all' | 'board' | 'canvas') => void;
  }
> = ({ copy, copiedKey, category, setCategory }) => {
  const tools = [
    {
      name: 'list_boards',
      cat: 'board',
      desc: 'Discover and list whiteboard boards with optional filters (filter: "all"|"recent"|"favorites"|"trash", searchQuery).',
      example: '{\n  "filter": "favorites",\n  "searchQuery": "Payment"\n}',
    },
    {
      name: 'create_board',
      cat: 'board',
      desc: 'Create a new whiteboard board in OpenBoard. Returns board_id for immediate shape creation.',
      example:
        '{\n  "name": "Payment Architecture",\n  "description": "Microservices topology",\n  "favorite": true\n}',
    },
    {
      name: 'get_board',
      cat: 'board',
      desc: 'Retrieve metadata and high-level bounds summary of a board by board_id.',
      example: '{\n  "board_id": "board_123"\n}',
    },
    {
      name: 'rename_board',
      cat: 'board',
      desc: 'Rename an existing whiteboard board.',
      example: '{\n  "board_id": "board_123",\n  "name": "Payment Architecture v2"\n}',
    },
    {
      name: 'duplicate_board',
      cat: 'board',
      desc: 'Duplicate an existing board with identical contents under a new unique ID.',
      example: '{\n  "board_id": "board_123",\n  "name": "Payment Architecture (Staging)"\n}',
    },
    {
      name: 'favorite_board',
      cat: 'board',
      desc: 'Set or toggle favorite bookmark status for a whiteboard board.',
      example: '{\n  "board_id": "board_123",\n  "favorite": true\n}',
    },
    {
      name: 'restore_board',
      cat: 'board',
      desc: 'Restore a deleted board from Trash back to active workspace.',
      example: '{\n  "board_id": "board_123"\n}',
    },
    {
      name: 'delete_board',
      cat: 'board',
      desc: 'Soft-delete a whiteboard board by ID (moves to Trash).',
      example: '{\n  "board_id": "board_123"\n}',
    },
    {
      name: 'get_canvas_state',
      cat: 'canvas',
      desc: 'Inspect semantic shapes, coordinates, dimensions, bounds, text labels, and arrow relationships.',
      example: '{\n  "board_id": "board_123"\n}',
    },
    {
      name: 'get_canvas_screenshot',
      cat: 'canvas',
      desc: 'Capture a headless visual inspection screenshot of the board as an SVG vector graphic / base64 image.',
      example: '{\n  "board_id": "board_123",\n  "theme": "light",\n  "padding": 40\n}',
    },
    {
      name: 'create_shapes',
      cat: 'canvas',
      desc: 'Batch create geometric shapes, sticky notes, standalone text, frames, and arrows with from/to connections.',
      example: `{\n  "board_id": "board_123",\n  "shapes": [\n    { "id": "api", "type": "geo", "geo": "rectangle", "x": 100, "y": 100, "w": 180, "h": 80, "text": "API Server", "color": "blue", "fill": "semi" },\n    { "id": "db", "type": "geo", "geo": "rectangle", "x": 380, "y": 100, "w": 180, "h": 80, "text": "PostgreSQL", "color": "green", "fill": "semi" },\n    { "id": "conn", "type": "arrow", "from": "api", "to": "db", "text": "queries", "color": "black" }\n  ]\n}`,
    },
    {
      name: 'update_shapes',
      cat: 'canvas',
      desc: 'Batch update shape coordinates (x, y), dimensions (w, h), labels, colors, fill, or arrow bindings.',
      example: `{\n  "board_id": "board_123",\n  "shapes": [\n    { "id": "api", "x": 120, "y": 150, "text": "API Server (Cluster)", "color": "violet" }\n  ]\n}`,
    },
    {
      name: 'delete_shapes',
      cat: 'canvas',
      desc: 'Delete one or more shapes by ID and cascade cleanup orphan arrow connections.',
      example: '{\n  "board_id": "board_123",\n  "shape_ids": ["api", "conn"]\n}',
    },
  ];

  const visibleTools = tools.filter((t) => category === 'all' || t.cat === category);

  return (
    <article className="docs-article">
      <div className="docs-header">
        <span className="docs-tag">Tools</span>
        <h1>MCP Tools Reference</h1>
        <p className="docs-lead">
          Complete reference of all 13 semantic tools available to external AI agents.
        </p>
      </div>

      <div className="docs-filter-tabs">
        <button
          type="button"
          className={`docs-tab ${category === 'all' ? 'active' : ''}`}
          onClick={() => setCategory('all')}
        >
          All Tools (13)
        </button>
        <button
          type="button"
          className={`docs-tab ${category === 'board' ? 'active' : ''}`}
          onClick={() => setCategory('board')}
        >
          Board Management (8)
        </button>
        <button
          type="button"
          className={`docs-tab ${category === 'canvas' ? 'active' : ''}`}
          onClick={() => setCategory('canvas')}
        >
          Canvas Operations & Vision (5)
        </button>
      </div>

      <div className="docs-tools-list">
        {visibleTools.map((tool) => (
          <div key={tool.name} className="docs-tool-card" id={`tool-${tool.name}`}>
            <div className="docs-tool-header">
              <span className="docs-tool-name">{tool.name}</span>
              <span className="docs-tool-cat-pill">{tool.cat}</span>
            </div>
            <p className="docs-tool-desc">{tool.desc}</p>
            <div className="docs-tool-example-label">Example Parameters:</div>
            <CodeBox
              code={tool.example}
              lang="json"
              copyKey={`tool-${tool.name}`}
              copy={copy}
              copiedKey={copiedKey}
            />
          </div>
        ))}
      </div>
    </article>
  );
};

const VisualInspectionDoc: React.FC<DocProps> = ({ copy, copiedKey }) => (
  <article className="docs-article">
    <div className="docs-header">
      <span className="docs-tag">Visual Inspection</span>
      <h1>Visual Inspection & Vision</h1>
      <p className="docs-lead">
        External multimodal AI agents can visually inspect whiteboard diagrams without needing a
        running browser or Chromium instance.
      </p>
    </div>

    <h2>Headless Vector Rendering Engine</h2>
    <p>
      OpenBoard includes <code>HeadlessSvgRenderer</code>, a pure Node.js vector renderer that
      operates directly on raw <code>BoardDocument</code> snapshot records stored in SQLite.
    </p>

    <div className="docs-card-grid">
      <div className="docs-card">
        <h3>Content-Aware Framing</h3>
        <p>
          Calculates the exact bounding box of all shapes with configurable padding (default 40px).
        </p>
      </div>
      <div className="docs-card">
        <h3>Theme Support</h3>
        <p>
          Supports both <code>light</code> and <code>dark</code> canvas backgrounds and palettes.
        </p>
      </div>
      <div className="docs-card">
        <h3>Standard MCP Image Blocks</h3>
        <p>
          Returns standard MCP <code>type: "image"</code> blocks (MIME: <code>image/svg+xml</code>)
          and SVG text.
        </p>
      </div>
      <div className="docs-card">
        <h3>Empty State Gracefulness</h3>
        <p>Renders a clean placeholder illustration when boards have zero shapes.</p>
      </div>
    </div>

    <h2>Tool Invocation Example</h2>
    <CodeBox
      code={`// In your AI agent:\nuse_mcp_tool({\n  server_name: "openboard",\n  tool_name: "get_canvas_screenshot",\n  arguments: {\n    board_id: "board_payment_123",\n    theme: "light",\n    padding: 40\n  }\n})`}
      lang="javascript"
      copyKey="screenshot-call"
      copy={copy}
      copiedKey={copiedKey}
    />
  </article>
);

const McpConnectionDoc: React.FC<DocProps> = ({ copy, copiedKey }) => (
  <article className="docs-article">
    <div className="docs-header">
      <span className="docs-tag">Protocol</span>
      <h1>Connection & Stdio Protocol</h1>
      <p className="docs-lead">
        OpenBoard communicates with agent clients using standard JSON-RPC 2.0 frames over process
        stdin/stdout.
      </p>
    </div>

    <h2>Protocol Guarantees</h2>
    <ul>
      <li>
        <strong>Stdout Isolation:</strong> Only valid newline-delimited JSON-RPC frames are ever
        written to stdout.
      </li>
      <li>
        <strong>Stderr Logging:</strong> All diagnostics, info banners, and runtime warnings go
        strictly to stderr.
      </li>
      <li>
        <strong>Protocol Version:</strong> MCP standard protocol version <code>2024-11-05</code>.
      </li>
    </ul>

    <h2>CLI Process Execution</h2>
    <CodeBox
      code="openboard mcp --db ~/.openboard/openboard.db"
      copyKey="mcp-proc"
      copy={copy}
      copiedKey={copiedKey}
    />
  </article>
);

const TroubleshootingDoc: React.FC<DocProps> = () => (
  <article className="docs-article">
    <div className="docs-header">
      <span className="docs-tag">Help</span>
      <h1>Troubleshooting & FAQs</h1>
      <p className="docs-lead">
        Common questions and resolutions when connecting agents to OpenBoard.
      </p>
    </div>

    <div className="docs-faq-list">
      <div className="docs-faq-item">
        <h3>Agent fails to connect to MCP</h3>
        <p>
          Verify that <code>openboard</code> is installed globally (
          <code>npm install -g openboard</code>) or accessible in PATH. Run{' '}
          <code>openboard info</code> to verify your environment.
        </p>
      </div>
      <div className="docs-faq-item">
        <h3>"Board not found" error in MCP tool</h3>
        <p>
          Call <code>list_boards</code> first to discover valid board IDs. Ensure you are passing
          the exact returned ID string.
        </p>
      </div>
      <div className="docs-faq-item">
        <h3>Does the browser need to stay open?</h3>
        <p>
          <strong>No.</strong> OpenBoard MCP operates headlessly against SQLite. If you open the
          browser, mutations project live; if closed, mutations still persist cleanly.
        </p>
      </div>
      <div className="docs-faq-item">
        <h3>How to backup or inspect SQLite database directly?</h3>
        <p>
          The database is located at <code>~/.openboard/openboard.db</code>. You can copy it or
          query it with <code>sqlite3</code> anytime.
        </p>
      </div>
    </div>
  </article>
);

const ClaudeCodeDoc: React.FC<DocProps> = ({ copy, copiedKey }) => (
  <article className="docs-article">
    <div className="docs-header">
      <span className="docs-tag">Agent</span>
      <h1>Claude Code Integration</h1>
      <p className="docs-lead">Connect Anthropic's Claude Code CLI tool to OpenBoard.</p>
    </div>

    <h2>1. Quick Setup via CLI (Recommended)</h2>
    <CodeBox
      code='claude mcp add openboard --command="openboard" --args="mcp"'
      copyKey="claude-cli-add"
      copy={copy}
      copiedKey={copiedKey}
    />

    <h2>2. Manual Configuration File</h2>
    <p>
      Add OpenBoard to your <code>~/.claude.json</code> (user scope) or <code>.mcp.json</code>{' '}
      (project scope):
    </p>
    <CodeBox
      code={`{\n  "mcpServers": {\n    "openboard": {\n      "command": "openboard",\n      "args": ["mcp"]\n    }\n  }\n}`}
      lang="json"
      copyKey="claude-json"
      copy={copy}
      copiedKey={copiedKey}
    />

    <h2>3. Example Prompts</h2>
    <div className="docs-prompt-box">
      "List my OpenBoard boards, create a new board called 'Auth Flow', and draw an API Gateway
      connecting to Cognito and Lambda."
    </div>
  </article>
);

const CursorDoc: React.FC<DocProps> = ({ copy, copiedKey }) => (
  <article className="docs-article">
    <div className="docs-header">
      <span className="docs-tag">Agent</span>
      <h1>Cursor IDE Integration</h1>
      <p className="docs-lead">Connect Cursor's AI agent to OpenBoard via MCP.</p>
    </div>

    <h2>
      1. Configure via <code>mcp.json</code>
    </h2>
    <p>
      Open or create <code>~/.cursor/mcp.json</code> (global) or <code>.cursor/mcp.json</code>{' '}
      (project):
    </p>
    <CodeBox
      code={`{\n  "mcpServers": {\n    "openboard": {\n      "command": "openboard",\n      "args": ["mcp"]\n    }\n  }\n}`}
      lang="json"
      copyKey="cursor-mcp-json"
      copy={copy}
      copiedKey={copiedKey}
    />

    <h2>2. Verification in Cursor Settings</h2>
    <p>
      Navigate to <strong>Cursor Settings &gt; Tools &amp; MCP</strong>. You will see{' '}
      <code>openboard</code> with a green active indicator.
    </p>

    <h2>3. Example Prompts</h2>
    <div className="docs-prompt-box">
      "Inspect the canvas state on board 'Payment Architecture', add a Redis cache component between
      API and Postgres, and take a screenshot."
    </div>
  </article>
);

const OpenCodeDoc: React.FC<DocProps> = ({ copy, copiedKey }) => (
  <article className="docs-article">
    <div className="docs-header">
      <span className="docs-tag">Agent</span>
      <h1>OpenCode Integration</h1>
      <p className="docs-lead">Connect OpenCode to OpenBoard using native MCP support.</p>
    </div>

    <h2>
      1. Configuration File (<code>opencode.jsonc</code>)
    </h2>
    <p>
      Add OpenBoard under <code>mcp</code> in <code>~/.config/opencode/opencode.jsonc</code>:
    </p>
    <CodeBox
      code={`{\n  "mcp": {\n    "openboard": {\n      "type": "local",\n      "command": "openboard",\n      "args": ["mcp"],\n      "enabled": true\n    }\n  }\n}`}
      lang="json"
      copyKey="opencode-json"
      copy={copy}
      copiedKey={copiedKey}
    />

    <h2>2. OpenCode CLI Setup</h2>
    <CodeBox code="opencode mcp list" copyKey="opencode-list" copy={copy} copiedKey={copiedKey} />
  </article>
);

const CodexDoc: React.FC<DocProps> = ({ copy, copiedKey }) => (
  <article className="docs-article">
    <div className="docs-header">
      <span className="docs-tag">Agent</span>
      <h1>OpenAI Codex / Agents SDK Integration</h1>
      <p className="docs-lead">Connect OpenAI agents or Codex configurations to OpenBoard.</p>
    </div>

    <h2>
      1. Configuration in <code>~/.codex/config.toml</code>
    </h2>
    <CodeBox
      code={`[mcp_servers.openboard]\ncommand = "openboard"\nargs = ["mcp"]`}
      lang="toml"
      copyKey="codex-toml"
      copy={copy}
      copiedKey={copiedKey}
    />

    <h2>2. OpenAI Agents SDK (Node/TypeScript)</h2>
    <CodeBox
      code={`import { StdioServerParameters } from "@modelcontextprotocol/sdk/client/stdio.js";\n\nconst openboardParams: StdioServerParameters = {\n  command: "openboard",\n  args: ["mcp"],\n};`}
      lang="typescript"
      copyKey="openai-sdk-code"
      copy={copy}
      copiedKey={copiedKey}
    />
  </article>
);

const OpenClawDoc: React.FC<DocProps> = ({ copy, copiedKey }) => (
  <article className="docs-article">
    <div className="docs-header">
      <span className="docs-tag">Agent</span>
      <h1>OpenClaw Integration</h1>
      <p className="docs-lead">Connect OpenClaw autonomous assistant to OpenBoard.</p>
    </div>

    <h2>
      1. Configuration in <code>~/.openclaw/openclaw</code>
    </h2>
    <CodeBox
      code={`{\n  "mcpServers": {\n    "openboard": {\n      "command": "openboard",\n      "args": ["mcp"],\n      "transport": "stdio"\n    }\n  }\n}`}
      lang="json"
      copyKey="openclaw-json"
      copy={copy}
      copiedKey={copiedKey}
    />

    <h2>2. Restart Gateway & Verify</h2>
    <CodeBox
      code="openclaw gateway restart\nopenclaw mcp list"
      copyKey="openclaw-restart"
      copy={copy}
      copiedKey={copiedKey}
    />
  </article>
);

const HermesDoc: React.FC<DocProps> = ({ copy, copiedKey }) => (
  <article className="docs-article">
    <div className="docs-header">
      <span className="docs-tag">Agent</span>
      <h1>Hermes Agent Integration</h1>
      <p className="docs-lead">Connect Hermes persistent AI agent to OpenBoard.</p>
    </div>

    <h2>
      1. Configuration in <code>~/.hermes/config.yaml</code>
    </h2>
    <CodeBox
      code={`mcp_servers:\n  openboard:\n    command: "openboard"\n    args:\n      - "mcp"`}
      lang="yaml"
      copyKey="hermes-yaml"
      copy={copy}
      copiedKey={copiedKey}
    />
  </article>
);

const GenericMcpDoc: React.FC<DocProps> = ({ copy, copiedKey }) => (
  <article className="docs-article">
    <div className="docs-header">
      <span className="docs-tag">Universal</span>
      <h1>Generic MCP Client Setup</h1>
      <p className="docs-lead">Connect any MCP-compatible tool, LLM client, or IDE extension.</p>
    </div>

    <h2>Universal Stdio Parameters</h2>
    <table className="docs-table">
      <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Command / Executable</strong>
          </td>
          <td>
            <code>openboard</code> (or full path to binary)
          </td>
        </tr>
        <tr>
          <td>
            <strong>Arguments</strong>
          </td>
          <td>
            <code>["mcp"]</code>
          </td>
        </tr>
        <tr>
          <td>
            <strong>Transport</strong>
          </td>
          <td>
            <code>stdio</code>
          </td>
        </tr>
        <tr>
          <td>
            <strong>Protocol Version</strong>
          </td>
          <td>
            <code>2024-11-05</code> (JSON-RPC 2.0)
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Generic Configuration Example</h2>
    <CodeBox
      code={`{\n  "mcpServers": {\n    "openboard": {\n      "command": "openboard",\n      "args": ["mcp"]\n    }\n  }\n}`}
      lang="json"
      copyKey="generic-mcp-json"
      copy={copy}
      copiedKey={copiedKey}
    />
  </article>
);
