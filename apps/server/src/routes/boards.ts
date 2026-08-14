import { Router } from 'express';
import type { BoardService } from '@openboard/core';

export function createBoardsRouter(boardService: BoardService): Router {
  const router = Router();

  // GET /api/boards
  router.get('/', async (req, res, next) => {
    try {
      const filter = typeof req.query['filter'] === 'string' ? req.query['filter'] : undefined;
      const favoritesOnly = filter === 'favorites' || req.query['favoritesOnly'] === 'true';
      const deletedOnly = filter === 'trash' || req.query['deletedOnly'] === 'true';
      const includeDeleted = req.query['includeDeleted'] === 'true';

      const searchQuery =
        typeof req.query['q'] === 'string'
          ? req.query['q']
          : typeof req.query['searchQuery'] === 'string'
            ? req.query['searchQuery']
            : undefined;

      let sortBy = (req.query['sortBy'] as 'updatedAt' | 'createdAt' | 'name') || undefined;
      let sortDirection = (req.query['sortDirection'] as 'asc' | 'desc') || undefined;

      if (filter === 'recent' && !sortBy) {
        sortBy = 'updatedAt';
        sortDirection = 'desc';
      }

      const boards = await boardService.listBoards({
        favoritesOnly,
        deletedOnly,
        includeDeleted,
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

  // POST /api/boards/:id/duplicate
  router.post('/:id/duplicate', async (req, res, next) => {
    try {
      const { name } = req.body || {};
      const duplicated = await boardService.duplicateBoard(req.params.id, name);
      res.status(201).json({ success: true, data: duplicated });
    } catch (err) {
      next(err);
    }
  });

  // POST /api/boards/:id/restore
  router.post('/:id/restore', async (req, res, next) => {
    try {
      const success = await boardService.restoreBoard(req.params.id);
      res.status(200).json({ success, restored: success });
    } catch (err) {
      next(err);
    }
  });

  // POST /api/boards/:id/favorite
  router.post('/:id/favorite', async (req, res, next) => {
    try {
      const board = await boardService.toggleFavorite(req.params.id);
      res.status(200).json({ success: true, data: board });
    } catch (err) {
      next(err);
    }
  });

  // DELETE /api/boards/:id/permanent
  router.delete('/:id/permanent', async (req, res, next) => {
    try {
      const success = await boardService.permanentDeleteBoard(req.params.id);
      res.status(200).json({ success, permanentlyDeleted: success });
    } catch (err) {
      next(err);
    }
  });

  // DELETE /api/boards/:id
  router.delete('/:id', async (req, res, next) => {
    try {
      const permanent = req.query['permanent'] === 'true';
      if (permanent) {
        const success = await boardService.permanentDeleteBoard(req.params.id);
        res.status(200).json({ success, permanentlyDeleted: success });
        return;
      }

      const success = await boardService.deleteBoard(req.params.id);
      res.status(200).json({ success });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
