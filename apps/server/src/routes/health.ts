import { Router } from 'express';
import type { HealthCheckResponse } from '@openboard/shared';

export function createHealthRouter(): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    const payload: HealthCheckResponse = {
      status: 'ok',
      name: 'openboard',
      version: '0.1.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
    res.status(200).json(payload);
  });

  return router;
}
