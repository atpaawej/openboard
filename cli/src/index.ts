import { Command } from 'commander';

const program = new Command();

program
  .name('openboard')
  .description('Local-first personal whiteboard workspace for developers and external AI agents')
  .version('0.1.4', '-v, --version', 'Output OpenBoard current version');

program
  .command('start')
  .description('Start the local OpenBoard whiteboard workspace, web dashboard, and API server')
  .option('-p, --port <number>', 'Port to listen on', '4747')
  .option('-h, --host <host>', 'Host address to bind to (localhost only for security)', 'localhost')
  .option('--db <path>', 'Custom SQLite database file path (defaults to ~/.openboard/openboard.db)')
  .option('--no-open', 'Do not automatically open browser on startup')
  .action(async (options) => {
    const { startCommand } = await import('./commands/start.js');
    await startCommand(options);
  });

program
  .command('mcp')
  .description('Start the Model Context Protocol (MCP) server on stdio for external AI agents')
  .option('--db <path>', 'Custom SQLite database file path (defaults to ~/.openboard/openboard.db)')
  .action(async (options) => {
    const { mcpCommand } = await import('./commands/mcp.js');
    await mcpCommand(options);
  });

program
  .command('info')
  .description(
    'Display OpenBoard configuration, database location, and agent MCP connection details',
  )
  .option('--db <path>', 'Custom SQLite database file path')
  .action(async (options) => {
    const { infoCommand } = await import('./commands/info.js');
    await infoCommand(options);
  });

program.parse(process.argv);
