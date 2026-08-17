import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ConditionalLayout } from '@/components/ConditionalLayout';
import { SoftwareApplicationSchema } from '@/components/JsonLd';
import { constructMetadata } from '@/lib/seo';

export const viewport: Viewport = {
  themeColor: '#0c0d10',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = constructMetadata({
  title: 'OpenBoard — The Secure Local Whiteboard for Developers & AI Agents',
  description:
    '100% private, local-first infinite whiteboard pairing an interactive tldraw canvas with a 13-tool Model Context Protocol (MCP) server for Claude Code, Cursor, and Codex. Zero cloud dependencies, stored locally in SQLite.',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/logo.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <meta property="og:image" content="https://openboard.aawej.in/og.png" />
        <meta property="og:image:secure_url" content="https://openboard.aawej.in/og.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@atpaawej" />
        <meta name="twitter:creator" content="@atpaawej" />
        <meta name="twitter:image" content="https://openboard.aawej.in/og.png" />
        <meta name="twitter:image:src" content="https://openboard.aawej.in/og.png" />
        <SoftwareApplicationSchema />
      </head>
      <body className="min-h-screen bg-[#0c0d10] text-[#f3f4f6] flex flex-col font-sans antialiased selection:bg-blue-600/30 selection:text-white">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
