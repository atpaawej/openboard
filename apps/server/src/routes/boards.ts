import { Router } from 'express';
import type { BoardService } from '@openboard/core';

export function createBoardsRouter(boardService: BoardService): Router {
  const router = Router();

  // GET /api/boards
  router.get('/', async (req, res, next) => {
    try {
      const favoritesOnly = req.query['favoritesOnly'] === 'true';
      const searchQuery = typeof req.query['q'] === 'string' ? req.query['q'] : undefined;
      const sortBy = (req.query['sortBy'] as 'updatedAt' | 'createdAt' | 'name') || undefined;
      const sortDirection = (req.query['sortDirection'] as 'asc' | 'desc') || undefined;

      const boards = await boardService.listBoards({
        favoritesOnly,
        searchQuery,
        sortBy,
        sortDirection,
      });

      res.status(200).json({ success: true, data: boards });
    } catch (err) {
      next(err);
    }
  });

  // POST /api/boards
  router.post('/', async (req, res, next) => {
    try {
      const { name, description, favorite, initialDocument } = req.body || {};
      const board = await boardService.createBoard({
        name,
        description,
        favorite,
        initialDocument,
      });
      res.status(201).json({ success: true, data: board });
    } catch (err) {
      next(err);
    }
  });

  // GET /api/boards/:id
  router.get('/:id', async (req, res, next) => {
    try {
      const board = await boardService.getBoard(req.params.id);
      res.status(200).json({ success: true, data: board });
    } catch (err) {
      next(err);
    }
  });

  // PATCH /api/boards/:id
  router.patch('/:id', async (req, res, next) => {
    try {
      const { name, description, favorite, thumbnail, document } = req.body || {};
      const board = await boardService.updateBoard(req.params.id, {
        name,
        description,
        favorite,
        thumbnail,
        document,
      });
      res.status(200).json({ success: true, data: board });
    } catch (err) {
      next(err);
    }
  });

  // DELETE /api/boards/:id
  router.delete('/:id', async (req, res, next) => {
    try {
      const success = await boardService.deleteBoard(req.params.id);
      res.status(200).json({ success });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
