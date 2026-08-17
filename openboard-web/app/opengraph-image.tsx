import { ImageResponse } from 'next/og';

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
        }}
      >
        {/* Subtle background glow circles */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '550px',
            height: '550px',
            borderRadius: '50%',
            backgroundColor: 'rgba(37, 99, 235, 0.18)',
            filter: 'blur(120px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '200px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            backgroundColor: 'rgba(6, 182, 212, 0.12)',
            filter: 'blur(100px)',
          }}
        />

        {/* Top Brand Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              backgroundColor: '#14151a',
              border: '1.5px solid rgba(37, 99, 235, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60a5fa',
              fontSize: '32px',
              fontWeight: 800,
            }}
          >
            ✦
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
                fontSize: '16px',
                color: '#9ca3af',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Local-First Canvas for Developers &amp; AI Agents
            </span>
          </div>
        </div>

        {/* Center Main Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '1000px' }}>
          <div
            style={{
              display: 'flex',
              fontSize: '60px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
            }}
          >
            The Secure Local Whiteboard
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '44px',
              fontWeight: 800,
              color: '#60a5fa',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            Engineered for Claude Code, Cursor &amp; Codex
          </div>
          <p
            style={{
              fontSize: '22px',
              color: '#9ca3af',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            100% private SQLite storage • 13 Model Context Protocol (MCP) semantic tools • Zero cloud dependencies
          </p>
        </div>

        {/* Bottom Metadata & Badges Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingTop: '28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 18px',
                borderRadius: '10px',
                backgroundColor: '#121318',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#10b981',
                fontSize: '18px',
                fontFamily: 'monospace',
                fontWeight: 600,
              }}
            >
              $ npx openboard-app start
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                borderRadius: '10px',
                backgroundColor: 'rgba(37, 99, 235, 0.15)',
                border: '1px solid rgba(37, 99, 235, 0.4)',
                color: '#93c5fd',
                fontSize: '17px',
                fontWeight: 600,
              }}
            >
              ★ GitHub: atpaawej/openboard
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#9ca3af',
              fontSize: '18px',
              fontWeight: 500,
            }}
          >
            <span>openboard.dev</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
