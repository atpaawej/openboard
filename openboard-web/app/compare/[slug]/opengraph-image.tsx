import { ImageResponse } from 'next/og';
import { comparisonsData } from '@/lib/content';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const compare = comparisonsData.find((c) => c.slug === slug);

  const competitor = compare?.competitor || 'Alternatives';
  const subtitle = compare?.subtitle || '100% Private, Local-First Open Source Whiteboard with 13 MCP Tools';

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
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            backgroundColor: 'rgba(37, 99, 235, 0.16)',
            filter: 'blur(110px)',
          }}
        />

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#14151a',
              border: '1px solid rgba(37, 99, 235, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60a5fa',
              fontSize: '26px',
              fontWeight: 800,
            }}
          >
            ✦
          </div>
          <span style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff' }}>
            OpenBoard Comparison
          </span>
        </div>

        {/* Versus Matchup Display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <span style={{ fontSize: '64px', fontWeight: 900, color: '#60a5fa' }}>
              OpenBoard
            </span>
            <span style={{ fontSize: '40px', fontWeight: 700, color: '#6b7280' }}>
              vs
            </span>
            <span style={{ fontSize: '64px', fontWeight: 900, color: '#e5e7eb' }}>
              {competitor}
            </span>
          </div>

          <p
            style={{
              fontSize: '24px',
              color: '#9ca3af',
              margin: 0,
              maxWidth: '950px',
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#10b981', fontSize: '18px', fontWeight: 600 }}>
            <span>✓ 100% Local SQLite</span>
            <span style={{ color: '#4b5563' }}>•</span>
            <span>✓ 13 MCP Tools</span>
            <span style={{ color: '#4b5563' }}>•</span>
            <span>✓ 0% Telemetry</span>
          </div>

          <div style={{ color: '#60a5fa', fontSize: '18px', fontWeight: 600 }}>
            openboard.dev
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
