import { ImageResponse } from 'next/og';
import { blogsData } from '@/lib/content';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return blogsData.map((b) => ({ slug: b.slug }));
}

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = blogsData.find((b) => b.slug === slug);

  const title = blog?.title || 'OpenBoard Engineering Article';
  const summary = blog?.summary || 'Local-first infinite whiteboard for developers and AI agents.';
  const author = blog?.author || 'Aawej';
  const readTime = blog?.readTime || '5 min read';
  const tag = blog?.tags?.[0] || 'Engineering';

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

        {/* Header Bar */}
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
              OpenBoard Blog
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
            {tag}
          </div>
        </div>

        {/* Title & Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1020px' }}>
          <div
            style={{
              display: 'flex',
              fontSize: '52px',
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
            {summary}
          </p>
        </div>

        {/* Author & Footer */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontSize: '18px', color: '#e5e7eb', fontWeight: 600 }}>By {author}</span>
            <span style={{ fontSize: '16px', color: '#6b7280' }}>•</span>
            <span style={{ fontSize: '18px', color: '#9ca3af' }}>{readTime}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontSize: '18px', fontWeight: 600 }}>
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
