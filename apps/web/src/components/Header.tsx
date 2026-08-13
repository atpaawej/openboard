import React from 'react';
import { NavLink } from 'react-router-dom';
import { useHealthCheck } from '../hooks/useHealthCheck.js';

export const Header: React.FC = () => {
  const { isConnected, data } = useHealthCheck();

  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-icon">✦</span>
        <span className="brand-title">OpenBoard</span>
      </div>

      <nav className="nav-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Settings
        </NavLink>
      </nav>

      <div
        className="header-status"
        style={{
          color: isConnected ? 'var(--status-success)' : '#ef4444',
          backgroundColor: isConnected ? 'var(--status-success-bg)' : 'rgba(239, 68, 68, 0.12)',
        }}
      >
        <span
          className="status-dot"
          style={{
            backgroundColor: isConnected ? 'var(--status-success)' : '#ef4444',
          }}
        />
        <span>{isConnected ? `Local Engine (v${data?.version || '0.1.0'})` : 'Engine Offline'}</span>
      </div>
    </header>
  );
};
