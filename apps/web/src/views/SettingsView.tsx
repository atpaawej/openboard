import React from 'react';

export const SettingsView: React.FC = () => {
  return (
    <div className="view-container">
      <div className="dashboard-title-group" style={{ marginBottom: '24px' }}>
        <h1>Settings & Topology</h1>
        <p>Local-first workspace configuration and environment state</p>
      </div>

      <div className="settings-section">
        <h2 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Environment & Storage</h2>

        <div className="settings-row">
          <div>
            <div className="settings-label">Storage Driver</div>
            <div className="settings-desc">Persistent local directory for whiteboard document state</div>
          </div>
          <div className="settings-value">Local Filesystem (~/.openboard)</div>
        </div>

        <div className="settings-row">
          <div>
            <div className="settings-label">MCP Protocol Server</div>
            <div className="settings-desc">Allows AI agents to interface with your boards</div>
          </div>
          <div className="settings-value">Enabled (Local Transport)</div>
        </div>

        <div className="settings-row">
          <div>
            <div className="settings-label">Network Architecture</div>
            <div className="settings-desc">Telemetry and cloud dependencies</div>
          </div>
          <div className="settings-value" style={{ color: 'var(--status-success)' }}>100% Offline / Local-Only</div>
        </div>

        <div className="settings-row">
          <div>
            <div className="settings-label">Canvas Engine</div>
            <div className="settings-desc">Drawing engine library</div>
          </div>
          <div className="settings-value">tldraw (Phase 2 Ready)</div>
        </div>
      </div>
    </div>
  );
};
