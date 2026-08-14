import type { Board, BoardDocument, BoardId } from '@openboard/shared';

export type BoardEventType =
  'board:created' | 'board:updated' | 'board:deleted' | 'board:restored' | 'canvas:updated';

export interface BoardEventPayloads {
  'board:created': { boardId: BoardId; board: Board };
  'board:updated': { boardId: BoardId; board: Board; reason?: string };
  'board:deleted': { boardId: BoardId };
  'board:restored': { boardId: BoardId };
  'canvas:updated': { boardId: BoardId; document: BoardDocument; reason?: string };
}

export type BoardEventListener<T extends BoardEventType> = (payload: BoardEventPayloads[T]) => void;

/**
 * BoardEventBus is an in-memory event dispatcher for board and canvas mutations.
 *
 * It allows the local HTTP server or Live Canvas bridge to reactively broadcast
 * state updates to connected clients (like active browser tabs via SSE)
 * without coupling core domain services to transport or network mechanics.
 */
export class BoardEventBus {
  private readonly listeners = new Map<BoardEventType, Set<BoardEventListener<any>>>();

  on<T extends BoardEventType>(event: T, listener: BoardEventListener<T>): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(listener);

    return () => {
      set?.delete(listener);
      if (set?.size === 0) {
        this.listeners.delete(event);
      }
    };
  }

  emit<T extends BoardEventType>(event: T, payload: BoardEventPayloads[T]): void {
    const set = this.listeners.get(event);
    if (!set) return;

    for (const listener of set) {
      try {
        listener(payload);
      } catch (err) {
        console.error(`[BoardEventBus] Error in listener for "${event}":`, err);
      }
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}
