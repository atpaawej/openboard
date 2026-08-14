import { Router } from 'express';
import type { BoardEventBus, BoardService } from '@openboard/core';

/**
 * Creates SSE router for real-time live browser canvas synchronization.
 */
export function createLiveSyncRouter(boardService: BoardService, eventBus: BoardEventBus): Router {
  const router = Router();

  // GET /api/boards/:id/live (SSE endpoint)
  router.get('/:id/live', async (req, res) => {
    const boardId = req.params.id;

    try {
      await boardService.getBoard(boardId);
    } catch {
      res.status(404).json({
        success: false,
        error: {
          code: 'BOARD_NOT_FOUND',
          message: `Board "${boardId}" was not found.`,
        },
      });
      return;
    }

    // Set Server-Sent Events headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    // Initial connection frame
    res.write(`data: ${JSON.stringify({ type: 'connected', boardId })}\n\n`);

    // Listen to canvas update events
    const unlistenCanvas = eventBus.on('canvas:updated', (payload) => {
      if (payload.boardId === boardId) {
        res.write(
          `data: ${JSON.stringify({
            type: 'canvas_updated',
            boardId,
            document: payload.document,
            reason: payload.reason,
          })}\n\n`,
        );
      }
    });

    // Listen to board metadata updates
    const unlistenBoard = eventBus.on('board:updated', (payload) => {
      if (payload.boardId === boardId) {
        res.write(
          `data: ${JSON.stringify({
            type: 'board_updated',
            boardId,
            board: payload.board,
            reason: payload.reason,
          })}\n\n`,
        );
      }
    });

    // Clean up listeners on client disconnect
    req.on('close', () => {
      unlistenCanvas();
      unlistenBoard();
    });
  });

  return router;
}
