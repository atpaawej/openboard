import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useHealthCheck } from '../hooks/useHealthCheck.js';
import {
  IconLogo,
  IconGrid,
  IconClock,
  IconStar,
  IconTrash,
  IconBook,
  IconSettings,
  IconPlus,
} from './icons/Icons.js';

export const Sidebar: React.FC = () => {
  const { isConnected, data } = useHealthCheck();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const currentFilter = searchParams.get('filter') || 'all';
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

  const handleCreateClick = () => {
    // If not on dashboard, navigate to dashboard first
    if (!isDashboard) {
      navigate('/dashboard');
    }
    // Dispatch custom event to trigger create modal on dashboard
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openboard:open-create-modal'));
    }, 10);
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <span className="sidebar-brand-icon">
            <IconLogo size={18} />
          </span>
          <div>
            <span className="sidebar-brand-title">OpenBoard</span>
            <span className="sidebar-brand-subtitle">Local Workspace</span>
          </div>
        </div>

        <button
          id="sidebar-btn-create"
          type="button"
          className="sidebar-action-btn"
          onClick={handleCreateClick}
          title="New Whiteboard (N)"
        >
          <div className="sidebar-action-btn-left">
            <IconPlus size={15} />
            <span>New Whiteboard</span>
          </div>
          <span className="kbd-shortcut-hint">N</span>
        </button>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-section-title">Workspace</div>

          <NavLink
            to="/dashboard?filter=all"
            className={() =>
              isDashboard && currentFilter === 'all'
                ? 'sidebar-nav-item active'
                : 'sidebar-nav-item'
            }
          >
            <span className="nav-item-icon">
              <IconGrid size={16} />
            </span>
            <span>All Boards</span>
          </NavLink>

          <NavLink
            to="/dashboard?filter=recent"
            className={() =>
              isDashboard && currentFilter === 'recent'
                ? 'sidebar-nav-item active'
                : 'sidebar-nav-item'
            }
          >
            <span className="nav-item-icon">
              <IconClock size={16} />
            </span>
            <span>Recent</span>
          </NavLink>

          <NavLink
            to="/dashboard?filter=favorites"
            className={() =>
              isDashboard && currentFilter === 'favorites'
                ? 'sidebar-nav-item active'
                : 'sidebar-nav-item'
            }
          >
            <span className="nav-item-icon">
              <IconStar size={16} />
            </span>
            <span>Favorites</span>
          </NavLink>

          <NavLink
            to="/dashboard?filter=trash"
            className={() =>
              isDashboard && currentFilter === 'trash'
                ? 'sidebar-nav-item active'
                : 'sidebar-nav-item'
            }
          >
            <span className="nav-item-icon">
              <IconTrash size={16} />
            </span>
            <span>Trash</span>
          </NavLink>

          <div className="sidebar-nav-section-title" style={{ marginTop: '14px' }}>
            Reference & System
          </div>

          <NavLink
            to="/docs"
            className={({ isActive }) =>
              isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'
            }
          >
            <span className="nav-item-icon">
              <IconBook size={16} />
            </span>
            <span>Documentation</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'
            }
          >
            <span className="nav-item-icon">
              <IconSettings size={16} />
            </span>
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="engine-status-card">
          <div className="status-row">
            <span className={`status-dot ${isConnected ? 'active' : 'offline'}`} />
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
