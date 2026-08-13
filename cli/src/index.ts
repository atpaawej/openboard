import { Command } from 'commander';
import { startCommand } from './commands/start.js';

const program = new Command();

program
  .name('openboard')
  .description('Local-first personal whiteboard workspace for developers and AI agents')
  .version('0.1.0');

program
  .command('start')
  .description('Start the local OpenBoard workspace and API server')
  .option('-p, --port <number>', 'Port to listen on', '3000')
  .option('-h, --host <host>', 'Host address to bind to', 'localhost')
  .option('--no-open', 'Do not automatically open browser')
  .action(startCommand);

program.parse(process.argv);

export { startCommand };
