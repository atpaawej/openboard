import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const BoardCanvasView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="canvas-view">
      <div className="canvas-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
            Board: <span style={{ color: 'var(--accent-text)', fontFamily: 'var(--font-mono)' }}>{id}</span>
          </div>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Canvas Engine: <strong style={{ color: 'var(--text-primary)' }}>tldraw (Phase 2 Ready)</strong>
        </div>
      </div>

      <div className="canvas-container">
        <div className="canvas-placeholder-card">
          <h2>Whiteboard Canvas Ready</h2>
          <p>
            Board session <code>{id}</code> is active. The canvas architecture is structured to mount tldraw seamlessly in Phase 2 with full bi-directional MCP sync.
          </p>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
