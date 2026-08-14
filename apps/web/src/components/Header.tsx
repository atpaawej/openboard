import React from 'react';
import { NavLink } from 'react-router-dom';
import { useHealthCheck } from '../hooks/useHealthCheck.js';
import { IconLogo } from './icons/Icons.js';

export const Header: React.FC = () => {
  const { isConnected, data } = useHealthCheck();

  return (
    <header className="app-header">
      <div className="brand">
        <span className="sidebar-brand-icon">
          <IconLogo size={16} />
        </span>
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
          color: isConnected ? 'var(--success)' : 'var(--danger)',
          backgroundColor: isConnected ? 'var(--success-subtle)' : 'var(--danger-subtle)',
        }}
      >
        <span
          className={`status-dot ${isConnected ? 'active' : 'offline'}`}
        />
        <span>
          {isConnected ? `Local Engine (v${data?.version || '0.1.0'})` : 'Engine Offline'}
        </span>
      </div>
    </header>
  );
};
