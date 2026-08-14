import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { BoardService, CanvasService, BoardEventBus } from '@openboard/core';
import { createBoardRepository, type BoardRepository, type BoardStorage } from '@openboard/storage';
import { OpenBoardError } from '@openboard/shared';
import { createHealthRouter } from './routes/health.js';
import { createBoardsRouter } from './routes/boards.js';
import { createCanvasRouter } from './routes/canvas.js';
import { createLiveSyncRouter } from './routes/live.js';

export interface ServerOptions {
  port?: number;
  host?: string;
  repository?: BoardRepository;
  storage?: BoardStorage;
  boardService?: BoardService;
  canvasService?: CanvasService;
  eventBus?: BoardEventBus;
  dbPath?: string;
}

export interface RunningServerInfo {
  port: number;
  host: string;
  url: string;
}

/**
 * OpenBoardServer encapsulates the local Node HTTP backend.
 *
 * Deep module: Exposes clean start/stop lifecycle controls while internally
 * orchestrating routing, serialization, error mapping, and middleware.
 */
export class OpenBoardServer {
  private readonly app: Express;
  private readonly boardService: BoardService;
  private readonly canvasService: CanvasService;
  private readonly eventBus: BoardEventBus;
  private server: http.Server | null = null;
  private readonly defaultPort: number;
  private readonly defaultHost: string;

  constructor(options: ServerOptions = {}) {
    this.defaultPort = options.port ?? 3000;
    this.defaultHost = options.host ?? 'localhost';

    this.eventBus = options.eventBus ?? new BoardEventBus();

    const repository =
      options.repository ??
      options.storage ??
      createBoardRepository({
        type: 'sqlite',
        dbPath: options.dbPath,
      });

    this.boardService = options.boardService ?? new BoardService(repository, this.eventBus);
    this.canvasService =
      options.canvasService ?? new CanvasService(this.boardService, this.eventBus);

    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json({ limit: '10mb' }));
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.use('/api', createHealthRouter());

    // Live browser sync SSE endpoint
    this.app.use('/api/boards', createLiveSyncRouter(this.boardService, this.eventBus));

    // Canvas REST API
    this.app.use('/api/boards', createCanvasRouter(this.canvasService));

    // Boards CRUD API
    this.app.use('/api/boards', createBoardsRouter(this.boardService));

    // Fallback route for unmatched API endpoints
    this.app.use('/api/*', (_req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: {
          code: 'ENDPOINT_NOT_FOUND',
          message: 'The requested API endpoint does not exist.',
        },
      });
    });

    // Serve Web UI static build if present
    this.setupStaticWebServing();
  }

  private setupStaticWebServing(): void {
    try {
      let moduleDir = '';
      try {
        if (typeof import.meta !== 'undefined' && import.meta.url) {
          moduleDir = path.dirname(new URL(import.meta.url).pathname);
        }
      } catch {
        // fallback
      }
      const currentDir =
        moduleDir || (typeof __dirname !== 'undefined' ? __dirname : process.cwd());

      const possiblePaths = [
        path.resolve(currentDir, 'web'),
        path.resolve(currentDir, '../web'),
        path.resolve(currentDir, '../../apps/web/dist'),
        path.resolve(currentDir, '../apps/web/dist'),
        path.resolve(currentDir, '../../web/dist'),
        path.resolve(currentDir, '../web/dist'),
        path.resolve(process.cwd(), 'apps/web/dist'),
        path.resolve(process.cwd(), '../web/dist'),
        path.resolve(process.cwd(), 'web'),
      ];

      const webDistPath = possiblePaths.find((p) => fs.existsSync(path.join(p, 'index.html')));

      if (webDistPath) {
        this.app.use(express.static(webDistPath));
        this.app.get('*', (req: Request, res: Response, next: NextFunction) => {
          if (req.path.startsWith('/api')) {
            return next();
          }
          const indexPath = path.join(webDistPath, 'index.html');
          if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
          } else {
            next();
          }
        });
      }
    } catch {
      // Ignore static serving errors in isolated test runs
    }
  }

  private setupErrorHandling(): void {
    this.app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
      if (err instanceof OpenBoardError) {
        res.status(err.statusCode).json({
          success: false,
          error: {
            code: err.code,
            message: err.message,
          },
        });
        return;
      }

      console.error('[OpenBoard Server Error]:', err);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected server error occurred.',
        },
      });
    });
  }

  /**
   * Starts the HTTP server on the configured port.
   */
  async start(
    port: number = this.defaultPort,
    host: string = this.defaultHost,
  ): Promise<RunningServerInfo> {
    if (this.server) {
      const address = this.server.address();
      const currentPort = typeof address === 'object' && address ? address.port : port;
      return {
        port: currentPort,
        host,
        url: `http://${host}:${currentPort}`,
      };
    }

    return new Promise((resolve, reject) => {
      const srv = this.app.listen(port, host, () => {
        this.server = srv;
        const actualAddress = srv.address();
        const actualPort =
          typeof actualAddress === 'object' && actualAddress ? actualAddress.port : port;
        const info: RunningServerInfo = {
          port: actualPort,
          host,
          url: `http://${host}:${actualPort}`,
        };
        resolve(info);
      });

      srv.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Stops the HTTP server gracefully.
   */
  async stop(): Promise<void> {
    if (!this.server) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.server!.close((err) => {
        if (err) {
          reject(err);
        } else {
          this.server = null;
          resolve();
        }
      });
    });
  }

  getExpressApp(): Express {
    return this.app;
  }

  getBoardService(): BoardService {
    return this.boardService;
  }

  getCanvasService(): CanvasService {
    return this.canvasService;
  }

  getEventBus(): BoardEventBus {
    return this.eventBus;
  }
}

/**
 * Factory function for creating an OpenBoard server.
 */
export function createOpenBoardServer(options?: ServerOptions): OpenBoardServer {
  return new OpenBoardServer(options);
}
