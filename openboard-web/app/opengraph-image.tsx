import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = 'OpenBoard — The Secure Local Whiteboard for Developers & AI Agents';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#0c0d10',
          padding: '70px 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
          border: '16px solid #181920',
        }}
      >
        {/* Top Brand Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '10px',
              backgroundColor: '#181920',
              border: '1.5px solid rgba(37, 99, 235, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
              fontSize: '24px',
              fontWeight: 900,
              fontFamily: 'monospace',
            }}
          >
            OB
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '34px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              OpenBoard
            </span>
            <span
              style={{
                fontSize: '14px',
                color: '#9ca3af',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontFamily: 'monospace',
              }}
            >
              100% Private Local Whiteboard for AI Agents &amp; Developers
            </span>
          </div>
        </div>

        {/* Center Main Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '1020px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 14px',
              borderRadius: '6px',
              backgroundColor: 'rgba(37, 99, 235, 0.15)',
              border: '1px solid rgba(37, 99, 235, 0.4)',
              color: '#60a5fa',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'monospace',
              alignSelf: 'flex-start',
            }}
          >
            LOCAL SQLITE • 13 MCP TOOLS • 0% TELEMETRY • MIT LICENSE
          </div>

          <h1
            style={{
              fontSize: '50px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            The private whiteboard where you &amp; your AI agents build architecture together.
          </h1>

          <p
            style={{
              fontSize: '19px',
              color: '#d1d5db',
              lineHeight: 1.45,
              margin: 0,
            }}
          >
            Infinite tldraw canvas backed by local SQLite. Connect Claude Code, Cursor, and terminal AI agents with 1 line.
          </p>
        </div>

        {/* Bottom Terminal & Metric Bar */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Terminal Command */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              borderRadius: '8px',
              backgroundColor: '#121318',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontFamily: 'monospace',
              fontSize: '15px',
              color: '#ffffff',
            }}
          >
            <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>$</span>
            <span>npx openboard-app start</span>
          </div>

          {/* Key Guarantee Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#34d399',
                fontFamily: 'monospace',
              }}
            >
              <span>[100% Localhost]</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#60a5fa',
                fontFamily: 'monospace',
              }}
            >
              <span>[13 MCP Tools]</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#9ca3af',
                fontFamily: 'monospace',
              }}
            >
              <span>[github.com/atpaawej/openboard]</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
