import { useEffect, useRef } from 'react';
import type { Board, BoardDocument, BoardId } from '@openboard/shared';
import type { BoardCanvasController } from './controller.js';

export interface UseBoardLiveSyncOptions {
  boardId: BoardId;
  controller: BoardCanvasController | null;
  onBoardMetadataUpdated?: (metadata: Board['metadata']) => void;
  onRemoteCanvasUpdated?: (doc: BoardDocument) => void;
}

/**
 * useBoardLiveSync manages the Server-Sent Events (SSE) connection to OpenBoard server.
 *
 * When an external AI agent creates, modifies, or deletes whiteboard content via MCP,
 * this hook receives real-time update notifications and merges the remote document
 * into the active tldraw store without interrupting the user's viewport or camera.
 */
export function useBoardLiveSync({
  boardId,
  controller,
  onBoardMetadataUpdated,
  onRemoteCanvasUpdated,
}: UseBoardLiveSyncOptions): void {
  const controllerRef = useRef(controller);
  controllerRef.current = controller;

  const onMetadataRef = useRef(onBoardMetadataUpdated);
  onMetadataRef.current = onBoardMetadataUpdated;

  const onCanvasRef = useRef(onRemoteCanvasUpdated);
  onCanvasRef.current = onRemoteCanvasUpdated;

  useEffect(() => {
    if (!boardId || typeof EventSource === 'undefined') {
      return;
    }

    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(`/api/boards/${boardId}/live`);

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);

          if (payload.type === 'canvas_updated' && payload.document) {
            if (controllerRef.current) {
              controllerRef.current.mergeRemoteDocument(payload.document);
            }
            onCanvasRef.current?.(payload.document);
          } else if (payload.type === 'board_updated' && payload.board?.metadata) {
            onMetadataRef.current?.(payload.board.metadata);
            if (payload.board.document && controllerRef.current) {
              controllerRef.current.mergeRemoteDocument(payload.board.document);
            }
          }
        } catch (parseErr) {
          console.warn('[useBoardLiveSync] Failed to parse SSE event:', parseErr);
        }
      };

      eventSource.onerror = () => {
        // SSE automatically attempts reconnection on network drops
      };
    } catch (err) {
      console.warn('[useBoardLiveSync] Failed to initialize EventSource:', err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
    };
  }, [boardId]);
}
