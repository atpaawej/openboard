import { createOpenBoardServer } from '@openboard/server';

export interface StartOptions {
  port?: string | number;
  host?: string;
  open?: boolean;
}

/**
 * Starts the local OpenBoard server and manages process lifecycle.
 */
export async function startCommand(options: StartOptions = {}): Promise<void> {
  const port = options.port ? parseInt(String(options.port), 10) : 3000;
  const host = options.host || 'localhost';

  try {
    const server = createOpenBoardServer({ port, host });
    const info = await server.start();

    console.log('');
    console.log('  ┌──────────────────────────────────────────────┐');
    console.log('  │                                              │');
    console.log('  │   ✦ OpenBoard local workspace is active ✦   │');
    console.log('  │                                              │');
    console.log(`  │   Dashboard:   \x1b[36m${info.url}\x1b[0m                 │`);
    console.log(`  │   API Health:  \x1b[32m${info.url}/api/health\x1b[0m      │`);
    console.log('  │                                              │');
    console.log('  │   Press Ctrl+C to stop the server            │');
    console.log('  └──────────────────────────────────────────────┘');
    console.log('');

    // Open browser if requested (default: true)
    if (options.open !== false) {
      openBrowser(info.url);
    }

    // Lifecycle hook: Clean shutdown on interrupt
    const shutdown = async () => {
      console.log('\n[OpenBoard] Shutting down cleanly...');
      await server.stop();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    // Keep event loop alive
  } catch (err) {
    console.error('[OpenBoard] Failed to start:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

/**
 * Platform-independent browser opener.
 */
function openBrowser(url: string): void {
  const startCmd =
    process.platform === 'darwin'
      ? `open "${url}"`
      : process.platform === 'win32'
        ? `start "" "${url}"`
        : `xdg-open "${url}"`;

  import('node:child_process').then(({ exec }) => {
    exec(startCmd, (err) => {
      if (err) {
        // Non-fatal error, browser might not be available in headless environments
      }
    });
  });
}
