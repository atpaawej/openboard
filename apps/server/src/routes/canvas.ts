import { Router } from 'express';
import type { CanvasService } from '@openboard/core';

/**
 * Creates canvas operations router backed by CanvasService.
 */
export function createCanvasRouter(canvasService: CanvasService): Router {
  const router = Router();

  // GET /api/boards/:id/canvas
  router.get('/:id/canvas', async (req, res, next) => {
    try {
      const state = await canvasService.getCanvasState(req.params.id);
      res.status(200).json({ success: true, data: state });
    } catch (err) {
      next(err);
    }
  });

  // POST /api/boards/:id/canvas/shapes
  router.post('/:id/canvas/shapes', async (req, res, next) => {
    try {
      const shapes = req.body?.shapes || [];
      const result = await canvasService.createShapes(req.params.id, shapes);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  });

  // PATCH /api/boards/:id/canvas/shapes
  router.patch('/:id/canvas/shapes', async (req, res, next) => {
    try {
      const shapes = req.body?.shapes || [];
      const result = await canvasService.updateShapes(req.params.id, shapes);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  });

  // DELETE /api/boards/:id/canvas/shapes
  router.delete('/:id/canvas/shapes', async (req, res, next) => {
    try {
      const shapeIds = req.body?.shapeIds || req.body?.shape_ids || [];
      const result = await canvasService.deleteShapes(req.params.id, shapeIds);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  });

  // GET /api/boards/:id/canvas/screenshot
  router.get(['/:id/canvas/screenshot', '/:id/screenshot'], async (req, res, next) => {
    try {
      const theme = (req.query.theme as 'light' | 'dark') || 'light';
      const format = (req.query.format as 'svg' | 'png' | 'data-url') || 'svg';
      const padding = req.query.padding ? parseInt(String(req.query.padding), 10) : 40;
      const background = req.query.background !== 'false';

      const boardId = String(req.params.id);
      const screenshot = await canvasService.getCanvasScreenshot(boardId, {
        theme,
        format,
        padding,
        background,
      });

      if (format === 'svg' && req.headers.accept?.includes('image/svg+xml')) {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.status(200).send(screenshot.svg);
      } else {
        res.status(200).json({ success: true, data: screenshot });
      }
    } catch (err) {
      next(err);
    }
  });

  return router;
}
