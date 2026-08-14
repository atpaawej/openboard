import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tldraw, type Editor, type TLStore } from 'tldraw';
import type { Board } from '@openboard/shared';
import {
  TldrawDocumentAdapter,
  BoardCanvasController,
  useBoardAutosave,
  useBoardLiveSync,
} from '../canvas/index.js';
import { IconArrowLeft, IconEdit, IconAlertCircle } from '../components/icons/Icons.js';
import { Button } from '../components/ui/Button.js';
import { useToast } from '../components/ui/ToastContext.js';

type BoardViewStatus = 'loading' | 'ready' | 'not-found' | 'error' | 'corrupt-document';

export const BoardCanvasView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [status, setStatus] = useState<BoardViewStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [board, setBoard] = useState<Board | null>(null);
  const [store, setStore] = useState<TLStore | null>(null);
  const [controller, setController] = useState<BoardCanvasController | null>(null);

  // Title editing state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  const controllerInstanceRef = useRef<BoardCanvasController | null>(null);

  // Autosave coordination
  const {
    saveStatus,
    errorMessage: saveErrorMessage,
    saveNow,
  } = useBoardAutosave({
    boardId: id || '',
    controller,
    debounceMs: 1000,
  });

  // Live SSE synchronization from external AI agent MCP mutations
  useBoardLiveSync({
    boardId: id || '',
    controller,
    onBoardMetadataUpdated: (metadata) => {
      setBoard((prev) => (prev ? { ...prev, metadata } : null));
      setTitleInput(metadata.name);
    },
  });

  // Fetch and initialize board
  const loadBoard = useCallback(async () => {
    if (!id) {
      setStatus('not-found');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch(`/api/boards/${id}`);

      if (response.status === 404) {
        setStatus('not-found');
        return;
      }

      if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        throw new Error(json?.error?.message || `Server returned status ${response.status}`);
      }

      const json = await response.json();
      const loadedBoard: Board = json.data;

      // Validate and initialize tldraw store
      try {
        const initializedStore = TldrawDocumentAdapter.createStoreFromDocument(
          loadedBoard.document,
        );
        setBoard(loadedBoard);
        setTitleInput(loadedBoard.metadata.name);
        setStore(initializedStore);
        setStatus('ready');
      } catch (docErr) {
        console.error('[BoardCanvasView] Document validation/migration failure:', docErr);
        setBoard(loadedBoard);
        setTitleInput(loadedBoard.metadata.name);
        setStatus('corrupt-document');
        setErrorMessage(
          docErr instanceof Error
            ? docErr.message
            : 'Stored whiteboard document format is invalid or incompatible.',
        );
      }
    } catch (err) {
      console.error('[BoardCanvasView] Failed to fetch board:', err);
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to connect to the OpenBoard server.',
      );
    }
  }, [id]);

  useEffect(() => {
    loadBoard();

    return () => {
      if (controllerInstanceRef.current) {
        controllerInstanceRef.current.dispose();
        controllerInstanceRef.current = null;
      }
    };
  }, [loadBoard]);

  // Handle tldraw mount
  const handleMount = useCallback((editor: Editor) => {
    const ctrl = new BoardCanvasController(editor);
    controllerInstanceRef.current = ctrl;
    setController(ctrl);
  }, []);

  // Safe navigation back to dashboard
  const handleBackToDashboard = async () => {
    // Flush any pending unsaved edits before leaving
    await saveNow();
    navigate('/dashboard');
  };

  // Title rename handling
  const handleTitleSubmit = async () => {
    setIsEditingTitle(false);
    const trimmed = titleInput.trim();
    if (!trimmed || !board || trimmed === board.metadata.name) {
      setTitleInput(board?.metadata.name || '');
      return;
    }

    setIsRenaming(true);
    try {
      const response = await fetch(`/api/boards/${board.metadata.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });

      if (response.ok) {
        const json = await response.json();
        setBoard((prev) => (prev ? { ...prev, metadata: json.data.metadata } : null));
        setTitleInput(json.data.metadata.name);
        toast.success('Renamed whiteboard', `Updated to "${trimmed}"`);
      } else {
        setTitleInput(board.metadata.name);
      }
    } catch {
      setTitleInput(board.metadata.name);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setTitleInput(board?.metadata.name || '');
    }
  };

  // Render Loading State
  if (status === 'loading') {
    return (
      <div className="canvas-view canvas-loading-view">
        <div className="canvas-loading-spinner" />
        <p style={{ color: 'var(--text-secondary)', marginTop: '16px', fontSize: '0.85rem' }}>
          Loading whiteboard...
        </p>
      </div>
    );
  }

  // Render 404 Not Found State
  if (status === 'not-found') {
    return (
      <div className="canvas-view canvas-message-view">
        <div className="canvas-placeholder-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)', marginBottom: '8px' }}>
            <IconAlertCircle size={32} />
          </div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 600 }}>Whiteboard Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            The requested whiteboard <code>{id}</code> does not exist in local SQLite storage.
          </p>
          <div style={{ marginTop: '12px' }}>
            <Button
              id="btn-return-dashboard"
              variant="primary"
              size="md"
              icon={<IconArrowLeft size={15} />}
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render Malformed/Corrupt Document Error State
  if (status === 'corrupt-document') {
    return (
      <div className="canvas-view canvas-message-view">
        <div className="canvas-placeholder-card" style={{ borderColor: 'var(--danger-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', marginBottom: '8px' }}>
            <IconAlertCircle size={32} />
          </div>
          <h2 style={{ color: 'var(--danger)', fontSize: '1.2rem', fontWeight: 600 }}>Document Data Error</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            The stored whiteboard document for <strong>{board?.metadata.name || id}</strong> could
            not be loaded safely:
          </p>
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--danger-subtle)',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-sm)',
              color: '#f87171',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-mono)',
              textAlign: 'left',
              wordBreak: 'break-word',
            }}
          >
            {errorMessage}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Your original stored data in SQLite has been preserved and was not overwritten.
          </p>
          <div
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '12px' }}
          >
            <Button variant="secondary" size="md" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
            <Button variant="primary" size="md" onClick={loadBoard}>
              Retry Loading
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render API / Network Error State
  if (status === 'error') {
    return (
      <div className="canvas-view canvas-message-view">
        <div className="canvas-placeholder-card" style={{ borderColor: 'var(--danger-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', marginBottom: '8px' }}>
            <IconAlertCircle size={32} />
          </div>
          <h2 style={{ color: 'var(--danger)', fontSize: '1.2rem', fontWeight: 600 }}>Connection Error</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            {errorMessage || 'Failed to communicate with OpenBoard server.'}
          </p>
          <div
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '12px' }}
          >
            <Button variant="secondary" size="md" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
            <Button variant="primary" size="md" onClick={loadBoard}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render Active tldraw Canvas
  return (
    <div className="canvas-view">
      <header className="canvas-toolbar">
        <div className="canvas-toolbar-left">
          <button
            id="btn-back-dashboard"
            className="btn-back-dashboard"
            onClick={handleBackToDashboard}
            title="Return to Dashboard (saves pending changes)"
          >
            <IconArrowLeft size={14} />
            <span>Boards</span>
          </button>

          <div className="canvas-title-wrapper">
            {isEditingTitle ? (
              <input
                id="input-board-title"
                className="canvas-title-input"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={handleTitleKeyDown}
                autoFocus
                maxLength={100}
                disabled={isRenaming}
              />
            ) : (
              <span
                id="display-board-title"
                className="canvas-title-display"
                onClick={() => setIsEditingTitle(true)}
                title="Click to rename whiteboard"
              >
                {board?.metadata.name || 'Untitled Whiteboard'}
                <IconEdit size={12} style={{ marginLeft: '6px', opacity: 0.6 }} />
              </span>
            )}
          </div>
        </div>

        <div className="canvas-toolbar-right">
          {/* Persistence status indicator */}
          <div
            id="save-status-indicator"
            className={`save-status-badge status-${saveStatus}`}
            title={saveErrorMessage ? `Save error: ${saveErrorMessage}` : undefined}
          >
            {saveStatus === 'saved' && (
              <>
                <span className="save-status-dot dot-saved" />
                <span>Saved</span>
              </>
            )}
            {saveStatus === 'saving' && (
              <>
                <span className="save-status-spinner" />
                <span>Saving...</span>
              </>
            )}
            {saveStatus === 'unsaved' && (
              <>
                <span className="save-status-dot dot-unsaved" />
                <span>Unsaved</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <span className="save-status-dot dot-error" />
                <span style={{ color: 'var(--danger)' }}>Save failed</span>
                <button
                  className="btn-retry-save"
                  onClick={() => saveNow()}
                  style={{ marginLeft: '6px', fontSize: '0.72rem', textDecoration: 'underline', color: 'var(--danger)' }}
                >
                  Retry
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="canvas-container">
        {store && (
          <div className="tldraw-mount-wrapper">
            <Tldraw store={store} onMount={handleMount} autoFocus />
          </div>
        )}
      </main>
    </div>
  );
};
