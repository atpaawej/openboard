import React from 'react';
import { useHealthCheck } from '../hooks/useHealthCheck.js';
import { Badge } from '../components/ui/Badge.js';
import {
  IconSettings,
  IconCpu,
  IconTerminal,
  IconLayers,
  IconCheck,
} from '../components/icons/Icons.js';

export const SettingsView: React.FC = () => {
  const { isConnected, data } = useHealthCheck();

  return (
    <div className="view-container">
      <div className="dashboard-top-bar" style={{ marginBottom: '24px' }}>
        <div className="dashboard-title-group">
          <h1>Workspace Settings & Topology</h1>
          <p>Local-first environment configuration, MCP agent bridge, and system diagnostics</p>
        </div>
      </div>

      <div className="settings-container">
        {/* Section 1: Environment & Storage */}
        <div className="settings-section-card">
          <div className="settings-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconCpu size={16} />
              <h2 className="settings-section-title">Environment & Storage</h2>
            </div>
            <p className="settings-section-subtitle">
              Local filesystem and SQLite database configuration
            </p>
          </div>

          <div className="settings-row-item">
            <div>
              <div className="settings-row-label">Storage Engine</div>
              <div className="settings-row-desc">
                ACID-compliant SQLite database with deterministic migrations
              </div>
            </div>
            <div className="settings-row-value">
              <Badge variant="neutral">SQLite 3 (WAL mode)</Badge>
            </div>
          </div>

          <div className="settings-row-item">
            <div>
              <div className="settings-row-label">Database Location</div>
              <div className="settings-row-desc">Default storage path on local user filesystem</div>
            </div>
            <div className="settings-row-value">
              <code>~/.openboard/openboard.db</code>
            </div>
          </div>

          <div className="settings-row-item">
            <div>
              <div className="settings-row-label">Privacy & Network Mode</div>
              <div className="settings-row-desc">Telemetry, cloud sync, and remote telemetry status</div>
            </div>
            <div className="settings-row-value">
              <Badge variant="success" icon={<IconCheck size={12} />}>
                100% Offline / Local-Only
              </Badge>
            </div>
          </div>
        </div>

        {/* Section 2: MCP Protocol Server */}
        <div className="settings-section-card">
          <div className="settings-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconTerminal size={16} />
              <h2 className="settings-section-title">Model Context Protocol (MCP) Bridge</h2>
            </div>
            <p className="settings-section-subtitle">
              Standardized agent interface for Claude Code, Cursor, OpenCode, Codex, Hermes, and OpenClaw
            </p>
          </div>

          <div className="settings-row-item">
            <div>
              <div className="settings-row-label">MCP Protocol Version</div>
              <div className="settings-row-desc">Standard JSON-RPC 2.0 specification</div>
            </div>
            <div className="settings-row-value">
              <code>2024-11-05</code>
            </div>
          </div>

          <div className="settings-row-item">
            <div>
              <div className="settings-row-label">Transport Channel</div>
              <div className="settings-row-desc">
                Isolated stdio pipe (protocol on stdout, logs on stderr)
              </div>
            </div>
            <div className="settings-row-value">
              <Badge variant="accent">Standard I/O (stdio)</Badge>
            </div>
          </div>

          <div className="settings-row-item">
            <div>
              <div className="settings-row-label">Semantic MCP Tools Catalog</div>
              <div className="settings-row-desc">
                High-level tools for board management, canvas shapes, and visual inspection
              </div>
            </div>
            <div className="settings-row-value">
              <Badge variant="neutral">13 Tools Registered</Badge>
            </div>
          </div>

          <div className="settings-row-item">
            <div>
              <div className="settings-row-label">Live Agent Projection</div>
              <div className="settings-row-desc">
                Real-time Server-Sent Events (SSE) bridge to open browser canvas
              </div>
            </div>
            <div className="settings-row-value">
              <Badge variant="success" icon={<IconCheck size={12} />}>
                SSE Active
              </Badge>
            </div>
          </div>
        </div>

        {/* Section 3: Canvas Engine */}
        <div className="settings-section-card">
          <div className="settings-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconLayers size={16} />
              <h2 className="settings-section-title">Canvas Engine & Vector Renderer</h2>
            </div>
            <p className="settings-section-subtitle">
              Whiteboard drawing engine and headless SVG inspection architecture
            </p>
          </div>

          <div className="settings-row-item">
            <div>
              <div className="settings-row-label">Interactive Canvas Library</div>
              <div className="settings-row-desc">Whiteboard surface rendering engine</div>
            </div>
            <div className="settings-row-value">
              <code>tldraw v3.8.0</code>
            </div>
          </div>

          <div className="settings-row-item">
            <div>
              <div className="settings-row-label">Headless Vector Inspection</div>
              <div className="settings-row-desc">
                Pure Node.js vector renderer for multimodal AI vision without Chromium
              </div>
            </div>
            <div className="settings-row-value">
              <Badge variant="neutral">HeadlessSvgRenderer</Badge>
            </div>
          </div>

          <div className="settings-row-item">
            <div>
              <div className="settings-row-label">Autosave Engine</div>
              <div className="settings-row-desc">
                Debounced dirty-state tracking with user mutation isolation
              </div>
            </div>
            <div className="settings-row-value">
              <Badge variant="neutral">1000ms Debounce</Badge>
            </div>
          </div>
        </div>

        {/* Section 4: Keyboard Shortcuts */}
        <div className="settings-section-card">
          <div className="settings-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconSettings size={16} />
              <h2 className="settings-section-title">Keyboard Shortcuts Reference</h2>
            </div>
            <p className="settings-section-subtitle">Productivity shortcuts across OpenBoard</p>
          </div>

          <div className="settings-row-item">
            <div>
              <div className="settings-row-label">Create New Whiteboard</div>
              <div className="settings-row-desc">Open new whiteboard modal instantly</div>
            </div>
            <div className="settings-row-value">
              <kbd className="settings-kbd">N</kbd>
            </div>
          </div>

          <div className="settings-row-item">
            <div>
              <div className="settings-row-label">Focus Dashboard Search</div>
              <div className="settings-row-desc">Quickly jump cursor to board search</div>
            </div>
            <div className="settings-row-value">
              <kbd className="settings-kbd">/</kbd>
            </div>
          </div>

          <div className="settings-row-item">
            <div>
              <div className="settings-row-label">Dismiss / Clear Search / Close Modal</div>
              <div className="settings-row-desc">Close dialog or clear active search input</div>
            </div>
            <div className="settings-row-value">
              <kbd className="settings-kbd">Esc</kbd>
            </div>
          </div>

          <div className="settings-row-item">
            <div>
              <div className="settings-row-label">Confirm Dialog / Submit Form</div>
              <div className="settings-row-desc">Execute primary action on open modal</div>
            </div>
            <div className="settings-row-value">
              <kbd className="settings-kbd">Enter</kbd>
            </div>
          </div>
        </div>

        {/* Section 5: System Diagnostics */}
        <div className="settings-section-card">
          <div className="settings-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconCpu size={16} />
              <h2 className="settings-section-title">Application Info & Runtime</h2>
            </div>
            <p className="settings-section-subtitle">System build and runtime environment status</p>
          </div>

          <div className="settings-row-item">
            <div>
              <div className="settings-row-label">OpenBoard Version</div>
              <div className="settings-row-desc">Current workspace release</div>
            </div>
            <div className="settings-row-value">
              <code>v{data?.version || '0.1.0'}</code>
            </div>
          </div>

          <div className="settings-row-item">
            <div>
              <div className="settings-row-label">Engine Connection Status</div>
              <div className="settings-row-desc">Local HTTP API & SSE server heartbeat</div>
            </div>
            <div className="settings-row-value">
              <Badge
                variant={isConnected ? 'success' : 'danger'}
                icon={
                  <span
                    className={`status-dot ${isConnected ? 'active' : 'offline'}`}
                    style={{ display: 'inline-block' }}
                  />
                }
              >
                {isConnected ? 'Connected & Healthy' : 'Disconnected'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
