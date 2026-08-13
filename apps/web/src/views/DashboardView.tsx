import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BoardSummary } from '@openboard/shared';

export const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBoards() {
      try {
        const res = await fetch('/api/boards');
        if (res.ok) {
          const json = await res.json();
          setBoards(json.data || []);
        }
      } catch {
        // Handled gracefully
      } finally {
        setLoading(false);
      }
    }
    fetchBoards();
  }, []);

  const handleCreateBoard = async () => {
    try {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `Whiteboard ${boards.length + 1}` }),
      });
      if (res.ok) {
        const json = await res.json();
        navigate(`/board/${json.data.metadata.id}`);
        return;
      }
    } catch {
      // Fallback direct navigate
    }
    navigate(`/board/sample-board-${Date.now()}`);
  };

  return (
    <div className="view-container">
      <div className="dashboard-top-bar">
        <div className="dashboard-title-group">
          <h1>Whiteboard Workspaces</h1>
          <p>Local-first canvas for developers, architecture diagrams, and AI agents</p>
        </div>
        <button id="btn-create-board" className="btn-primary" onClick={handleCreateBoard}>
          <span>+</span> New Whiteboard
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading workspace boards...</p>
      ) : boards.length > 0 ? (
        <div className="boards-grid">
          {boards.map((b) => (
            <div
              key={b.id}
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
                <span>ID: {b.id.substring(0, 8)}...</span>
                <span>{new Date(b.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="boards-grid">
          <div
            className="board-card"
            onClick={() => navigate('/board/demo-system-architecture')}
            style={{ cursor: 'pointer' }}
          >
            <div className="board-card-header">
              <div>
                <div className="board-card-title">System Architecture</div>
                <div className="board-card-desc">Deep modules and local engine topology</div>
              </div>
              <span style={{ color: '#f59e0b' }}>★</span>
            </div>
            <div className="board-card-footer">
              <span>Foundation Sample</span>
              <span>Today</span>
            </div>
          </div>

          <div
            className="board-card"
            onClick={() => navigate('/board/demo-agent-workflow')}
            style={{ cursor: 'pointer' }}
          >
            <div className="board-card-header">
              <div>
                <div className="board-card-title">AI Agent Workflow</div>
                <div className="board-card-desc">MCP tool orchestration canvas</div>
              </div>
            </div>
            <div className="board-card-footer">
              <span>Foundation Sample</span>
              <span>Today</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
