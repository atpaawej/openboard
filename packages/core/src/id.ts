import type { BoardId } from '@openboard/shared';

/**
 * Generates a unique, URL-safe Board ID.
 */
export function generateBoardId(): BoardId {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback random generation
  return 'brd_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}
