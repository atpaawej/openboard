import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BoardSummary } from '@openboard/shared';

export const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchBoards = async () => {
    try {
      setErrorMessage(null);
      const res = await fetch('/api/boards');
      if (res.ok) {
        const json = await res.json();
        setBoards(json.data || []);
      } else {
        setErrorMessage('Failed to load boards from server.');
      }
    } catch (err) {
      setErrorMessage('Unable to connect to OpenBoard server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleCreateBoard = async () => {
    if (creating) return;
    setCreating(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Whiteboard ${boards.length + 1}`,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        navigate(`/board/${json.data.metadata.id}`);
        return;
      }
      const json = await res.json().catch(() => ({}));
      setErrorMessage(json?.error?.message || 'Failed to create board.');
    } catch {
      setErrorMessage('Could not connect to server to create board.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="view-container">
      <div className="dashboard-top-bar">
        <div className="dashboard-title-group">
          <h1>Whiteboard Workspaces</h1>
          <p>Local-first canvas for developers, architecture diagrams, and external AI agents</p>
        </div>
        <button
          id="btn-create-board"
          className="btn-primary"
          onClick={handleCreateBoard}
          disabled={creating}
        >
          <span>+</span> {creating ? 'Creating...' : 'New Whiteboard'}
        </button>
      </div>

      {errorMessage && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-sm)',
            color: '#f87171',
            fontSize: '0.9rem',
            marginBottom: '20px',
          }}
        >
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
          <div className="canvas-loading-spinner" style={{ width: '20px', height: '20px' }} />
          <span>Loading workspace boards...</span>
        </div>
      ) : boards.length > 0 ? (
        <div className="boards-grid">
          {boards.map((b) => (
            <div
              key={b.id}
              id={`board-card-${b.id}`}
              className="board-card"
              onClick={() => navigate(`/board/${b.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="board-card-header">
                <div>
                  <div className="board-card-title">{b.name}</div>
                  {b.description && <div className="board-card-desc">{b.description}</div>}
                </div>
                {b.favorite && <span style={{ color: '#f59e0b' }}>★</span>}
              </div>
              <div className="board-card-footer">
                <span style={{ fontFamily: 'var(--font-mono)' }}>{b.id.substring(0, 8)}...</span>
                <span>{new Date(b.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="canvas-placeholder-card"
          style={{ margin: '40px auto', maxWidth: '480px', textAlign: 'center' }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>▦</div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No Whiteboards Yet</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Create your first whiteboard to start sketching diagrams, architecture concepts, and visual workflows.
          </p>
          <button id="btn-create-first-board" className="btn-primary" onClick={handleCreateBoard} disabled={creating}>
            <span>+</span> Create First Whiteboard
          </button>
        </div>
      )}
    </div>
  );
};
