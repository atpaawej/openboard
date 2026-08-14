import { createOpenBoardServer } from './server.js';

const PORT = parseInt(process.env['PORT'] || '4747', 10);
const HOST = process.env['HOST'] || 'localhost';

async function bootstrap() {
  const server = createOpenBoardServer({ port: PORT, host: HOST });
  const info = await server.start();
  console.log(`[OpenBoard] Server running at ${info.url}`);
  console.log(`[OpenBoard] Health endpoint: ${info.url}/api/health`);
}

bootstrap().catch((err) => {
  console.error('[OpenBoard] Failed to start server:', err);
  process.exit(1);
});
