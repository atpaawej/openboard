import { ImageResponse } from 'next/og';
import { docsData } from '@/lib/content';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = docsData.find((d) => d.slug === slug);

  const title = doc?.title || 'OpenBoard Documentation';
  const subtitle = doc?.subtitle || 'Developer guide and reference for OpenBoard whiteboard workspace.';
  const category = doc?.category || 'Documentation';

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

        {/* Brand Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
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
              OpenBoard Docs
            </span>
          </div>

          <div
            style={{
              padding: '6px 16px',
              borderRadius: '999px',
              backgroundColor: 'rgba(37, 99, 235, 0.15)',
              border: '1px solid rgba(37, 99, 235, 0.4)',
              color: '#93c5fd',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            {category}
          </div>
        </div>

        {/* Title & Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1020px' }}>
          <div
            style={{
              display: 'flex',
              fontSize: '54px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.18,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>
          <p
            style={{
              fontSize: '22px',
              color: '#9ca3af',
              margin: 0,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#10b981', fontSize: '18px', fontFamily: 'monospace' }}>
            <span>$ openboard mcp</span>
          </div>

          <div style={{ color: '#60a5fa', fontSize: '18px', fontWeight: 600 }}>
            openboard.dev/docs
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
