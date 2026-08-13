import type { BoardSummary, Board } from './board.js';

/**
 * Health check response schema.
 */
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  name: string;
  version: string;
  uptime?: number;
  timestamp?: string;
}

/**
 * Standard API response envelope.
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type BoardListResponse = ApiResponse<BoardSummary[]>;
export type BoardResponse = ApiResponse<Board>;
