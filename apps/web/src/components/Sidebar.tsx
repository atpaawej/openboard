import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useHealthCheck } from '../hooks/useHealthCheck.js';

export const Sidebar: React.FC = () => {
  const { isConnected, data } = useHealthCheck();
  const navigate = useNavigate();

  const handleCreateBoard = async () => {
    try {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Untitled Whiteboard' }),
      });
      if (res.ok) {
        const json = await res.json();
        navigate(`/board/${json.data.metadata.id}`);
        return;
      }
    } catch {
      // Fallback navigation
    }
    navigate(`/board/board-${Date.now()}`);
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <span className="sidebar-brand-icon">✦</span>
          <div>
            <span className="sidebar-brand-title">OpenBoard</span>
            <span className="sidebar-brand-subtitle">Local Workspace</span>
          </div>
        </div>

        <button id="sidebar-btn-create" className="sidebar-action-btn" onClick={handleCreateBoard}>
          <span>+</span> New Whiteboard
        </button>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-section-title">Workspace</div>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'
            }
          >
            <span className="nav-item-icon">▦</span>
            <span>All Boards</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'
            }
          >
            <span className="nav-item-icon">⚙</span>
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div
          className="engine-status-card"
          style={{
            borderColor: isConnected ? 'var(--status-success-border)' : '#7f1d1d',
          }}
        >
          <div className="status-row">
            <span
              className="status-dot"
              style={{
                backgroundColor: isConnected ? 'var(--status-success)' : '#ef4444',
              }}
            />
            <span className="status-label">
              {isConnected ? `Engine Active (v${data?.version || '0.1.0'})` : 'Engine Offline'}
            </span>
          </div>
          <div className="status-mode">Local-First · MCP Ready</div>
        </div>
      </div>
    </aside>
  );
};
