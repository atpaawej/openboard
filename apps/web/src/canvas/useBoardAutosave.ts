import { useState, useEffect, useRef, useCallback } from 'react';
import type { BoardId, BoardDocument } from '@openboard/shared';
import type { BoardCanvasController } from './controller.js';

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

export interface UseBoardAutosaveOptions {
  boardId: BoardId;
  controller: BoardCanvasController | null;
  debounceMs?: number;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
}

export interface UseBoardAutosaveResult {
  saveStatus: SaveStatus;
  errorMessage: string | null;
  saveNow: () => Promise<boolean>;
}

/**
 * useBoardAutosave manages the debounced autosave lifecycle for a board canvas.
 *
 * It listens to document changes from the BoardCanvasController and persists
 * document snapshots to the OpenBoard HTTP API (PATCH /api/boards/:id).
 */
export function useBoardAutosave({
  boardId,
  controller,
  debounceMs = 1000,
  onSaveSuccess,
  onSaveError,
}: UseBoardAutosaveOptions): UseBoardAutosaveResult {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);
  const hasPendingChangesRef = useRef(false);
  const controllerRef = useRef(controller);
  controllerRef.current = controller;

  const saveDocument = useCallback(
    async (doc: BoardDocument): Promise<boolean> => {
      isSavingRef.current = true;
      setSaveStatus('saving');
      setErrorMessage(null);

      try {
        let thumbnail: string | null | undefined = undefined;
        if (controllerRef.current) {
          thumbnail = await controllerRef.current.generateThumbnailSvg().catch(() => null);
        }

        const payload: Record<string, unknown> = { document: doc };
        if (thumbnail !== undefined) {
          payload.thumbnail = thumbnail;
        }

        const response = await fetch(`/api/boards/${boardId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body?.error?.message || `Server returned status ${response.status}`);
        }

        isSavingRef.current = false;

        // If changes were made while the request was in flight, schedule another save
        if (hasPendingChangesRef.current) {
          hasPendingChangesRef.current = false;
          setSaveStatus('unsaved');
          if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = setTimeout(() => {
            if (controllerRef.current) {
              try {
                const currentDoc = controllerRef.current.getDocument();
                saveDocument(currentDoc);
              } catch {
                // Ignore
              }
            }
          }, debounceMs);
        } else {
          setSaveStatus('saved');
          onSaveSuccess?.();
        }

        return true;
      } catch (err) {
        isSavingRef.current = false;
        const errObj = err instanceof Error ? err : new Error(String(err));
        setSaveStatus('error');
        setErrorMessage(errObj.message);
        onSaveError?.(errObj);
        return false;
      }
    },
    [boardId, debounceMs, onSaveSuccess, onSaveError],
  );

  const saveNow = useCallback(async (): Promise<boolean> => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (!controllerRef.current) return true;

    try {
      const doc = controllerRef.current.getDocument();
      hasPendingChangesRef.current = false;
      return await saveDocument(doc);
    } catch {
      return false;
    }
  }, [saveDocument]);

  useEffect(() => {
    if (!controller) return;

    // Reset status on new controller
    setSaveStatus('saved');
    setErrorMessage(null);
    hasPendingChangesRef.current = false;

    const unsubscribe = controller.subscribeToDocumentChanges(() => {
      hasPendingChangesRef.current = true;
      setSaveStatus('unsaved');

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        if (!isSavingRef.current && controllerRef.current) {
          try {
            const doc = controllerRef.current.getDocument();
            hasPendingChangesRef.current = false;
            saveDocument(doc);
          } catch (err) {
            console.error('[useBoardAutosave] Failed to extract document for saving:', err);
          }
        }
      }, debounceMs);
    });

    return () => {
      unsubscribe();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [controller, debounceMs, saveDocument]);

  return {
    saveStatus,
    errorMessage,
    saveNow,
  };
}
