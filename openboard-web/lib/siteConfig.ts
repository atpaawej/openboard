export const siteConfig = {
  name: 'OpenBoard',
  tagline: 'Local-First Personal Whiteboard for Developers & AI Agents',
  description:
    'OpenBoard is the 100% private, local-first open-source infinite whiteboard pairing an interactive tldraw canvas with a 13-tool Model Context Protocol (MCP) server for Claude Code, Cursor, Codex, and autonomous AI coding agents. Zero cloud dependencies, zero telemetry, stored locally in SQLite.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://openboard.dev',
  ogImage: 'https://openboard.dev/og.png',
  creator: 'Aawej',
  githubUrl: 'https://github.com/atpaawej/openboard',
  githubRepo: 'atpaawej/openboard',
  npmUrl: 'https://www.npmjs.com/package/openboard-app',
  npmPackage: 'openboard-app',
  mcpSpecUrl: 'https://modelcontextprotocol.io',
  license: 'MIT',
  keywords: [
    'openboard',
    'opensource board',
    'secure local white board',
    'local first whiteboard',
    'mcp whiteboard',
    'model context protocol whiteboard',
    'claude code whiteboard',
    'cursor mcp whiteboard',
    'ai agent whiteboard',
    'sqlite whiteboard',
    'private whiteboard',
    'excalidraw alternative',
    'miro alternative open source',
    'developer whiteboard',
    'infinite canvas coding agents'
  ],
  links: {
    github: 'https://github.com/atpaawej/openboard',
    npm: 'https://www.npmjs.com/package/openboard-app',
    issues: 'https://github.com/atpaawej/openboard/issues',
    discussions: 'https://github.com/atpaawej/openboard/discussions',
    releases: 'https://github.com/atpaawej/openboard/releases',
    author: 'https://github.com/atpaawej'
  },
  stats: {
    mcpTools: 13,
    storageEngine: 'Local SQLite (~/.openboard/openboard.db)',
    syncProtocol: 'Server-Sent Events (SSE) & stdio',
    license: 'MIT (100% Open Source)',
    telemetry: '0% (Zero Cloud Tracking)'
  }
};
