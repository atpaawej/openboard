import os from 'node:os';
import path from 'node:path';

export interface InfoOptions {
  db?: string;
}

/**
 * Displays OpenBoard installation, database path, and MCP integration configuration info.
 */
export async function infoCommand(options: InfoOptions = {}): Promise<void> {
  const dataDir = path.join(os.homedir(), '.openboard');
  const defaultDbPath = options.db || path.join(dataDir, 'openboard.db');

  console.log('');
  console.log('  ✦ OpenBoard System & MCP Information');
  console.log('  ─────────────────────────────────────────────────────────────');
  console.log('  Version:        \x1b[36m0.1.2\x1b[0m');
  console.log('  Data Directory: \x1b[33m' + dataDir + '\x1b[0m');
  console.log('  Database Path:  \x1b[33m' + defaultDbPath + '\x1b[0m');
  console.log('  Runtime Model:  \x1b[32mLocal-First, Zero Cloud, Browser-Optional\x1b[0m');
  console.log('  Repository:     \x1b[34mhttps://github.com/atpaawej/openboard\x1b[0m');
  console.log('');
  console.log('  ✦ Universal MCP Server Configuration for AI Agents (stdio):');
  console.log('  ─────────────────────────────────────────────────────────────');
  console.log('  Command:        \x1b[36mopenboard\x1b[0m');
  console.log('  Arguments:      \x1b[36m["mcp"]\x1b[0m');
  console.log('  Transport:      \x1b[32mstdio\x1b[0m');
  console.log('');
  console.log('  Generic JSON Config:');
  console.log('    { "mcpServers": { "openboard": { "command": "openboard", "args": ["mcp"] } } }');
  console.log('');
  console.log('  ✦ Agent Quick Setup Examples:');
  console.log('');
  console.log('  Claude Code:');
  console.log('    \x1b[90m$ \x1b[0mclaude mcp add openboard --command="openboard" --args="mcp"');
  console.log('');
  console.log('  Cursor (~/.cursor/mcp.json):');
  console.log('    { "mcpServers": { "openboard": { "command": "openboard", "args": ["mcp"] } } }');
  console.log('');
  console.log('  OpenCode (~/.config/opencode/opencode.jsonc):');
  console.log(
    '    { "mcp": { "openboard": { "type": "local", "command": "openboard", "args": ["mcp"], "enabled": true } } }',
  );
  console.log('');
  console.log('  Documentation & Web UI:');
  console.log(
    '    Start local server: \x1b[36mopenboard start\x1b[0m -> navigate to \x1b[36mhttp://localhost:3000/docs\x1b[0m',
  );
  console.log('');
  process.exit(0);
}
